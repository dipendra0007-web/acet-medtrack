const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const MedicineReminder = require('../models/MedicineReminder');
const User = require('../models/User');
const { logEvent } = require('../utils/logger');

// @desc    Book a doctor appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const bookAppointment = async (req, res) => {
  const { doctorId, date, timeSlot, notes } = req.body;

  if (!doctorId || !date || !timeSlot) {
    return res.status(400).json({ message: 'Doctor ID, date, and timeslot are required' });
  }

  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor' || !doctor.doctorApproved) {
      return res.status(404).json({ message: 'Approved doctor not found' });
    }

    // Check for double bookings on the same doctor, date, and slot
    const existingBooking = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This timeslot has already been booked. Please select another slot.' });
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      patientName: req.user.name,
      doctorId,
      doctorName: doctor.name,
      date,
      timeSlot,
      notes: notes || '',
      status: 'pending'
    });

    await logEvent(
      'BOOK_APPOINTMENT',
      req.user.id,
      req.user.name,
      req.user.role,
      `Booked appointment with Dr. ${doctor.name} on ${date} at ${timeSlot}`
    );

    res.status(201).json({ message: 'Appointment booked successfully!', appointment });

  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get appointments list
// @route   GET /api/appointments
// @access  Private (Patient, Doctor, Admin, Parent)
const getAppointments = async (req, res) => {
  try {
    // Parent logic
    if (req.user.role === 'parent') {
      if (!req.user.permissions?.appointments) {
        return res.status(403).json({ message: 'Access denied: Parent does not have permission to view appointments' });
      }
      // Parents fetch records for their associated patient
      const appointments = await Appointment.find({ patientId: req.user.id });
      return res.json(appointments);
    }

    if (req.user.role === 'patient') {
      const appointments = await Appointment.find({ patientId: req.user.id });
      return res.json(appointments);
    }

    if (req.user.role === 'doctor') {
      const appointments = await Appointment.find({ doctorId: req.user.id });
      return res.json(appointments);
    }

    if (req.user.role === 'admin') {
      const appointments = await Appointment.find({});
      return res.json(appointments);
    }

    res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update appointment status (accept, reject, reschedule)
// @route   PUT /api/appointments/:id
// @access  Private (Doctor, Patient)
const updateAppointmentStatus = async (req, res) => {
  const appointmentId = req.params.id;
  const { status, timeSlot, date, notes } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Role checks
    if (req.user.role === 'doctor' && appointment.doctorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to manage this appointment' });
    }
    if (req.user.role === 'patient' && appointment.patientId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to manage this appointment' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (timeSlot) updates.timeSlot = timeSlot;
    if (date) updates.date = date;
    if (notes) updates.notes = notes;

    const updatedAppt = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: updates },
      { new: true }
    );

    await logEvent(
      'UPDATE_APPOINTMENT',
      req.user.id,
      req.user.name,
      req.user.role,
      `Appointment ID ${appointmentId} updated. Status: ${status || appointment.status}`
    );

    res.json({ message: 'Appointment updated successfully', appointment: updatedAppt });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Write a digital prescription for an approved appointment
// @route   POST /api/appointments/:id/prescription
// @access  Private (Doctor)
const createPrescription = async (req, res) => {
  const appointmentId = req.params.id;
  const { notes, medicines } = req.body;

  if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
    return res.status(400).json({ message: 'Medicines list is required' });
  }

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to prescribe for this patient' });
    }

    // Create prescription record
    const prescription = await Prescription.create({
      appointmentId,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctorName,
      date: new Date().toISOString().split('T')[0],
      notes: notes || '',
      medicines
    });

    // Auto-create active medicine reminders for patient
    const today = new Date().toISOString().split('T')[0];
    for (let med of medicines) {
      // Calculate end date based on duration
      const endDateObj = new Date();
      endDateObj.setDate(endDateObj.getDate() + (Number(med.durationDays) || 7));
      const endDate = endDateObj.toISOString().split('T')[0];

      await MedicineReminder.create({
        patientId: appointment.patientId,
        name: med.name,
        dosage: med.dosage,
        schedule: med.schedule,
        instruction: med.instructions || '',
        durationDays: Number(med.durationDays) || 7,
        startDate: today,
        endDate: endDate,
        active: true,
        history: []
      });
    }

    // Update appointment with prescription ID
    await Appointment.findByIdAndUpdate(appointmentId, { 
      $set: { prescriptionId: prescription._id, status: 'approved' } 
    });

    await logEvent(
      'CREATE_PRESCRIPTION',
      req.user.id,
      req.user.name,
      req.user.role,
      `Wrote prescription for Patient ${appointment.patientName}. Created ${medicines.length} medicine reminders.`
    );

    res.status(201).json({ message: 'Prescription written successfully and medicine reminders synchronized!', prescription });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get prescriptions list
// @route   GET /api/prescriptions
// @access  Private (Patient, Doctor, Parent)
const getPrescriptions = async (req, res) => {
  try {
    if (req.user.role === 'parent') {
      if (!req.user.permissions?.prescriptions) {
        return res.status(403).json({ message: 'Access denied: Parent does not have permission to view prescriptions' });
      }
      const prescriptions = await Prescription.find({ patientId: req.user.id });
      return res.json(prescriptions);
    }

    if (req.user.role === 'patient') {
      const prescriptions = await Prescription.find({ patientId: req.user.id });
      return res.json(prescriptions);
    }

    if (req.user.role === 'doctor') {
      const prescriptions = await Prescription.find({ doctorId: req.user.id });
      return res.json(prescriptions);
    }

    res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  createPrescription,
  getPrescriptions
};
