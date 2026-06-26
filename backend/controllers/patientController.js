const User = require('../models/User');
const MedicalRecord = require('../models/MedicalRecord');
const bcrypt = require('bcryptjs');
const { logEvent } = require('../utils/logger');
const Appointment = require('../models/Appointment');

// @desc    Update patient profile details
// @route   PUT /api/patient/profile
// @access  Private (Patient)
const updateProfile = async (req, res) => {
  const { bloodGroup, allergies, conditions, emergencyContact, photo,
          country, state, city, pincode, landmark } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Merge patient details
    user.patientDetails = {
      ...user.patientDetails,
      bloodGroup: bloodGroup !== undefined ? bloodGroup : user.patientDetails.bloodGroup,
      allergies: allergies !== undefined ? allergies : user.patientDetails.allergies,
      conditions: conditions !== undefined ? conditions : user.patientDetails.conditions,
      emergencyContact: emergencyContact !== undefined ? emergencyContact : user.patientDetails.emergencyContact,
      country: country !== undefined ? country : (user.patientDetails.country || ''),
      state: state !== undefined ? state : (user.patientDetails.state || ''),
      city: city !== undefined ? city : (user.patientDetails.city || ''),
      pincode: pincode !== undefined ? pincode : (user.patientDetails.pincode || ''),
      landmark: landmark !== undefined ? landmark : (user.patientDetails.landmark || '')
    };

    const updateFields = { patientDetails: user.patientDetails };
    if (photo !== undefined) {
      updateFields.photo = photo;
    }

    await User.findByIdAndUpdate(req.user.id, { $set: updateFields });

    await logEvent('UPDATE_PROFILE', user._id, user.name, user.role, 'Patient updated medical profile');

    res.json({ message: 'Profile updated successfully', patientDetails: user.patientDetails, photo: photo || user.photo });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Setup or update parent access credentials
// @route   POST /api/patient/parent-access
// @access  Private (Patient)
const setupParentAccess = async (req, res) => {
  const { username, password, permissions } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    let passwordHash = user.patientDetails?.parentAccess?.passwordHash || '';
    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    user.patientDetails.parentAccess = {
      username: username || user.patientDetails.parentAccess?.username || '',
      passwordHash,
      permissions: {
        medicalRecords: permissions?.medicalRecords ?? user.patientDetails.parentAccess?.permissions?.medicalRecords ?? false,
        prescriptions: permissions?.prescriptions ?? user.patientDetails.parentAccess?.permissions?.prescriptions ?? false,
        medicineSchedules: permissions?.medicineSchedules ?? user.patientDetails.parentAccess?.permissions?.medicineSchedules ?? false,
        appointments: permissions?.appointments ?? user.patientDetails.parentAccess?.permissions?.appointments ?? false
      }
    };

    await User.findByIdAndUpdate(req.user.id, { $set: { patientDetails: user.patientDetails } });

    await logEvent(
      'SETUP_PARENT_ACCESS',
      user._id,
      user.name,
      user.role,
      `Patient configured parent account. Username: ${user.patientDetails.parentAccess.username}`
    );

    res.json({ 
      message: 'Parent access settings saved successfully', 
      parentAccess: {
        username: user.patientDetails.parentAccess.username,
        permissions: user.patientDetails.parentAccess.permissions
      }
    });
  } catch (error) {
    console.error('Parent access error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload medical document / record
// @route   POST /api/patient/records
// @access  Private (Patient)
const uploadRecord = async (req, res) => {
  const { title, category, fileUrl, fileName } = req.body;

  if (!title || !fileUrl || !fileName) {
    return res.status(400).json({ message: 'Title, file contents, and filename are required' });
  }

  try {
    const record = await MedicalRecord.create({
      patientId: req.user.id,
      title,
      category: category || 'Other',
      fileUrl,
      fileName,
      uploadedAt: new Date().toISOString(),
      sharedWithDoctors: []
    });

    await logEvent(
      'UPLOAD_RECORD',
      req.user.id,
      req.user.name,
      req.user.role,
      `Uploaded record: "${title}" (${category})`
    );

    res.status(201).json({ message: 'Record uploaded successfully', record });
  } catch (error) {
    console.error('Upload record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get patient medical records
// @route   GET /api/patient/records
// @access  Private (Patient, Parent, Doctor)
const getRecords = async (req, res) => {
  const patientId = req.query.patientId || req.user.id;

  try {
    // If parent logs in, req.user.id will be the patient's id
    // We check permissions
    if (req.user.role === 'parent') {
      if (!req.user.permissions?.medicalRecords) {
        return res.status(403).json({ message: 'Access denied: Parent does not have permission to view medical records' });
      }
    }

    if (req.user.role === 'doctor') {
      // Doctor requesting records. A doctor can see records shared with them,
      // or if they have an appointment with this patient.
      const records = await MedicalRecord.find({ patientId });
      
      // Filter records that are explicitly shared with this doctor
      const sharedRecords = records.filter(r => r.sharedWithDoctors?.includes(req.user.id));
      
      // Also, check if doctor has an approved appointment with this patient to see basic records
      const hasAppt = await Appointment.findOne({ 
        patientId, 
        doctorId: req.user.id, 
        status: 'approved' 
      });

      if (hasAppt) {
        // If doctor has an approved appointment, they can see all records
        return res.json(records);
      }

      return res.json(sharedRecords);
    }

    // Default: Patient fetching their own records
    const records = await MedicalRecord.find({ patientId });
    res.json(records);
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Share medical record with a doctor
// @route   POST /api/patient/records/:id/share
// @access  Private (Patient)
const shareRecord = async (req, res) => {
  const recordId = req.params.id;
  const { doctorId } = req.body;

  if (!doctorId) {
    return res.status(400).json({ message: 'Doctor ID is required' });
  }

  try {
    const record = await MedicalRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Verify ownership
    if (record.patientId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to share this record' });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Add doctor to shared list if not already present
    let sharedWith = record.sharedWithDoctors || [];
    if (!sharedWith.includes(doctorId)) {
      sharedWith.push(doctorId);
      await MedicalRecord.findByIdAndUpdate(recordId, { $set: { sharedWithDoctors: sharedWith } });
    }

    await logEvent(
      'SHARE_RECORD',
      req.user.id,
      req.user.name,
      req.user.role,
      `Shared record "${record.title}" with Doctor ${doctor.name}`
    );

    res.json({ message: `Record shared successfully with Dr. ${doctor.name}`, record });
  } catch (error) {
    console.error('Share record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get shared records for doctors
// @route   GET /api/patient/shared-records
// @access  Private (Doctor)
const getSharedRecords = async (req, res) => {
  try {
    const allRecords = await MedicalRecord.find({});
    // Filter records shared with this doctor
    const sharedRecords = allRecords.filter(r => r.sharedWithDoctors?.includes(req.user.id));
    res.json(sharedRecords);
  } catch (error) {
    console.error('Get shared records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateProfile,
  setupParentAccess,
  uploadRecord,
  getRecords,
  shareRecord,
  getSharedRecords
};
