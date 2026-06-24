const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const { logEvent } = require('../utils/logger');

// @desc    Update doctor profile / details
// @route   PUT /api/doctor/profile
// @access  Private (Doctor)
const updateDoctorProfile = async (req, res) => {
  const { specialization, experience, clinicInfo, availability, photo } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    user.doctorDetails = {
      specialization: specialization || user.doctorDetails?.specialization || 'General',
      experience: experience !== undefined ? Number(experience) : user.doctorDetails?.experience,
      clinicInfo: clinicInfo || user.doctorDetails?.clinicInfo || '',
      availability: availability || user.doctorDetails?.availability || []
    };

    const updateFields = { doctorDetails: user.doctorDetails };
    if (photo !== undefined) {
      updateFields.photo = photo;
    }

    await User.findByIdAndUpdate(req.user.id, { $set: updateFields });

    await logEvent('UPDATE_DOCTOR_PROFILE', user._id, user.name, user.role, 'Doctor updated professional profile');

    res.json({ message: 'Doctor profile updated successfully', doctorDetails: user.doctorDetails, photo: photo || user.photo });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all approved doctors
// @route   GET /api/doctor/list
// @access  Private (Patient, Admin, Doctor)
const getDoctorsList = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', doctorApproved: true });
    
    // Clean return list (no password or sensitive detail)
    const cleanedDoctors = doctors.map(doc => ({
      id: doc._id,
      name: doc.name,
      email: doc.email,
      doctorDetails: doc.doctorDetails
    }));

    res.json(cleanedDoctors);
  } catch (error) {
    console.error('Get doctors list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get Doctor Dashboard Stats & Patients
// @route   GET /api/doctor/dashboard
// @access  Private (Doctor)
const getDoctorDashboard = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id });
    const prescriptions = await Prescription.find({ doctorId: req.user.id });

    // Aggregate unique patient ids treated
    const treatedPatientIds = [...new Set(prescriptions.map(p => p.patientId))];
    const patientsTreatedCount = treatedPatientIds.length;

    // Filter appointments for counts
    const pendingCount = appointments.filter(a => a.status === 'pending').length;
    const approvedCount = appointments.filter(a => a.status === 'approved').length;

    res.json({
      stats: {
        totalAppointments: appointments.length,
        pendingAppointments: pendingCount,
        approvedAppointments: approvedCount,
        patientsTreated: patientsTreatedCount
      },
      upcomingAppointments: appointments.filter(a => a.status === 'approved').slice(0, 5)
    });
  } catch (error) {
    console.error('Doctor dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateDoctorProfile,
  getDoctorsList,
  getDoctorDashboard
};
