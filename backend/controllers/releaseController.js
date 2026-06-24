const fs = require('fs');
const path = require('path');
const AppRelease = require('../models/AppRelease');
const { logEvent } = require('../utils/logger');

// Helper: ensure a directory exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Helper: decode base64 and write to disk; returns { savedPath, fileSize } or null
const saveBase64File = (base64Data, originalName, subDir) => {
  if (!base64Data || !originalName) return null;

  let content = base64Data;
  if (base64Data.includes(';base64,')) {
    content = base64Data.split(';base64,')[1];
  }
  const buffer = Buffer.from(content, 'base64');
  const fileSize = buffer.length;

  const uploadDir = path.join(__dirname, '../uploads/releases', subDir);
  ensureDir(uploadDir);

  const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
  const finalPath = path.join(uploadDir, safeName);
  fs.writeFileSync(finalPath, buffer);

  return {
    savedPath: `/uploads/releases/${subDir}/${safeName}`,
    fileSize
  };
};

// Helper: delete a file from disk safely
const deleteFile = (relativePath) => {
  if (!relativePath) return;
  const full = path.join(__dirname, '..', relativePath);
  if (fs.existsSync(full)) {
    try { fs.unlinkSync(full); } catch (e) { console.error('Failed to delete file:', e); }
  }
};

// @desc    Get all app releases
// @route   GET /api/releases
// @access  Public
const getReleases = async (req, res) => {
  try {
    const releases = await AppRelease.find({});
    const sorted = [...releases].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    res.json(sorted);
  } catch (error) {
    console.error('Get releases error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload a new app release (APK and/or IPA) with cover photo
// @route   POST /api/releases
// @access  Private (Admin)
const uploadRelease = async (req, res) => {
  const {
    name, version, description,
    // APK
    fileName, fileData,
    // IPA
    ipaFileName, ipaFileData,
    // Cover photo
    photo, photoFileName,
    // Platform
    platform
  } = req.body;

  if (!name || !version) {
    return res.status(400).json({ message: 'App name and version are required' });
  }

  const hasApk = fileName && fileData;
  const hasIpa = ipaFileName && ipaFileData;

  if (!hasApk && !hasIpa) {
    return res.status(400).json({ message: 'At least one file (.apk or .ipa) is required' });
  }

  try {
    // 1. Save APK file
    let apkPath = '', apkSize = 0;
    if (hasApk) {
      const result = saveBase64File(fileData, fileName, 'apk');
      if (result) { apkPath = result.savedPath; apkSize = result.fileSize; }
    }

    // 2. Save IPA file
    let ipaPath = '', ipaSize = 0;
    if (hasIpa) {
      const result = saveBase64File(ipaFileData, ipaFileName, 'ipa');
      if (result) { ipaPath = result.savedPath; ipaSize = result.fileSize; }
    }

    // 3. Save cover photo
    let photoPath = '';
    if (photo && photoFileName) {
      const result = saveBase64File(photo, photoFileName, 'photos');
      if (result) photoPath = result.savedPath;
    }

    // 4. Determine platform
    let detectedPlatform = platform || 'android';
    if (hasApk && hasIpa) detectedPlatform = 'both';
    else if (hasIpa && !hasApk) detectedPlatform = 'ios';
    else if (hasApk && !hasIpa) detectedPlatform = 'android';

    // 5. Create record
    const release = await AppRelease.create({
      name,
      version,
      description: description || '',
      photo: photoPath,
      platform: detectedPlatform,
      fileName:  hasApk ? fileName  : '',
      filePath:  apkPath,
      fileSize:  apkSize,
      ipaFileName: hasIpa ? ipaFileName : '',
      ipaFilePath:  ipaPath,
      ipaFileSize:  ipaSize,
      downloadCount: 0,
      ipaDownloadCount: 0,
      uploadedAt: new Date().toISOString()
    });

    await logEvent(
      'UPLOAD_RELEASE',
      req.user.id,
      req.user.name,
      req.user.role,
      `Uploaded release: "${name}" (${version}) [${detectedPlatform.toUpperCase()}]`
    );

    res.status(201).json({ message: 'Release uploaded successfully', release });
  } catch (error) {
    console.error('Upload release error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an app release and all its files
// @route   DELETE /api/releases/:id
// @access  Private (Admin)
const deleteRelease = async (req, res) => {
  const releaseId = req.params.id;

  try {
    const release = await AppRelease.findById(releaseId);
    if (!release) {
      return res.status(404).json({ message: 'Release not found' });
    }

    // Delete all associated files
    deleteFile(release.filePath);
    deleteFile(release.ipaFilePath);
    deleteFile(release.photo);

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

// @desc    Download APK file and increment download count
// @route   GET /api/releases/:id/download
// @access  Public
const downloadRelease = async (req, res) => {
  const releaseId = req.params.id;

  try {
    const release = await AppRelease.findById(releaseId);
    if (!release) {
      return res.status(404).json({ message: 'Release not found' });
    }

    if (!release.filePath) {
      return res.status(404).json({ message: 'No APK file for this release' });
    }

    const count = (release.downloadCount || 0) + 1;
    await AppRelease.findByIdAndUpdate(releaseId, { $set: { downloadCount: count } });

    const filePathOnDisk = path.join(__dirname, '..', release.filePath);
    if (!fs.existsSync(filePathOnDisk)) {
      return res.status(404).json({ message: 'File does not exist on disk' });
    }

    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', `attachment; filename="${release.fileName}"`);
    res.download(filePathOnDisk, release.fileName);
  } catch (error) {
    console.error('Download release error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Download IPA file and increment download count
// @route   GET /api/releases/:id/download-ipa
// @access  Public
const downloadReleaseIpa = async (req, res) => {
  const releaseId = req.params.id;

  try {
    const release = await AppRelease.findById(releaseId);
    if (!release) {
      return res.status(404).json({ message: 'Release not found' });
    }

    if (!release.ipaFilePath) {
      return res.status(404).json({ message: 'No IPA file for this release' });
    }

    const count = (release.ipaDownloadCount || 0) + 1;
    await AppRelease.findByIdAndUpdate(releaseId, { $set: { ipaDownloadCount: count } });

    const filePathOnDisk = path.join(__dirname, '..', release.ipaFilePath);
    if (!fs.existsSync(filePathOnDisk)) {
      return res.status(404).json({ message: 'IPA file does not exist on disk' });
    }

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${release.ipaFileName}"`);
    res.download(filePathOnDisk, release.ipaFileName);
  } catch (error) {
    console.error('Download IPA error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getReleases,
  uploadRelease,
  deleteRelease,
  downloadRelease,
  downloadReleaseIpa
};
