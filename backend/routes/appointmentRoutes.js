const express = require('express');
const router = express.Router();
const { 
  bookAppointment, 
  getAppointments, 
  updateAppointmentStatus, 
  createPrescription, 
  getPrescriptions 
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/', protect, getAppointments);
router.put('/:id', protect, updateAppointmentStatus);
router.post('/:id/prescription', protect, authorize('doctor'), createPrescription);
router.get('/prescriptions', protect, getPrescriptions);

module.exports = router;
