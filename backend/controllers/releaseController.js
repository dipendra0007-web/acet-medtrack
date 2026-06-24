const fs = require('fs');
const path = require('path');
const AppRelease = require('../models/AppRelease');
const { logEvent } = require('../utils/logger');

// @desc    Get all app releases & downloadable files
// @route   GET /api/releases
// @access  Public
const getReleases = async (req, res) => {
  try {
    const releases = await AppRelease.find({});
    // Sort manually since FileDb doesn't support mongoose sort/select
    const sorted = [...releases].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    res.json(sorted);
  } catch (error) {
    console.error('Get releases error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload a new app release / file
// @route   POST /api/releases
// @access  Private (Admin)
const uploadRelease = async (req, res) => {
  const { name, version, description, fileName, fileData } = req.body;

  if (!name || !version || !fileName || !fileData) {
    return res.status(400).json({ message: 'Name, version, fileName, and fileData are required' });
  }

  try {
    // 1. Decode base64 data
    let base64Content = fileData;
    if (fileData.includes(';base64,')) {
      base64Content = fileData.split(';base64,')[1];
    }
    const buffer = Buffer.from(base64Content, 'base64');
    const fileSize = buffer.length;

    // 2. Ensure target releases directory exists
    const uploadDir = path.join(__dirname, '../uploads/releases');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 3. Save file with a safe timestamped filename
    const safeFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    const finalPath = path.join(uploadDir, safeFileName);
    fs.writeFileSync(finalPath, buffer);

    const filePath = `/uploads/releases/${safeFileName}`;

    // 4. Create AppRelease record
    const release = await AppRelease.create({
      name,
      version,
      description: description || '',
      fileName,
      filePath,
      fileSize,
      downloadCount: 0,
      uploadedAt: new Date().toISOString()
    });

    await logEvent(
      'UPLOAD_RELEASE',
      req.user.id,
      req.user.name,
      req.user.role,
      `Uploaded release: "${name}" (${version})`
    );

    res.status(201).json({ message: 'Release uploaded successfully', release });
  } catch (error) {
    console.error('Upload release error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an app release / file
// @route   DELETE /api/releases/:id
// @access  Private (Admin)
const deleteRelease = async (req, res) => {
  const releaseId = req.params.id;

  try {
    const release = await AppRelease.findById(releaseId);
    if (!release) {
      return res.status(404).json({ message: 'Release not found' });
    }

    // 1. Delete physical file from disk
    const filePathOnDisk = path.join(__dirname, '..', release.filePath);
    if (fs.existsSync(filePathOnDisk)) {
      try {
        fs.unlinkSync(filePathOnDisk);
      } catch (err) {
        console.error('Failed to delete physical file from disk:', err);
      }
    }

    // 2. Delete DB record
    await AppRelease.deleteOne({ _id: releaseId });

    await logEvent(
      'DELETE_RELEASE',
      req.user.id,
      req.user.name,
      req.user.role,
      `Deleted release: "${release.name}" (${release.version})`
    );

    res.json({ message: 'Release deleted successfully' });
  } catch (error) {
    console.error('Delete release error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Download file and increment download count
// @route   GET /api/releases/:id/download
// @access  Public
const downloadRelease = async (req, res) => {
  const releaseId = req.params.id;

  try {
    const release = await AppRelease.findById(releaseId);
    if (!release) {
      return res.status(404).json({ message: 'Release not found' });
    }

    // Increment download count
    const count = (release.downloadCount || 0) + 1;
    await AppRelease.findByIdAndUpdate(releaseId, { $set: { downloadCount: count } });

    const filePathOnDisk = path.join(__dirname, '..', release.filePath);
    if (!fs.existsSync(filePathOnDisk)) {
      return res.status(404).json({ message: 'File does not exist on disk' });
    }

    let contentType = 'application/octet-stream';
    if (release.fileName.endsWith('.apk')) {
      contentType = 'application/vnd.android.package-archive';
    } else if (release.fileName.endsWith('.pptx')) {
      contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    } else if (release.fileName.endsWith('.pdf')) {
      contentType = 'application/pdf';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${release.fileName}"`);
    res.download(filePathOnDisk, release.fileName);
  } catch (error) {
    console.error('Download release error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getReleases,
  uploadRelease,
  deleteRelease,
  downloadRelease
};
