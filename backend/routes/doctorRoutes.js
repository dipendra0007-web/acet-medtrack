const express = require('express');
const router = express.Router();
const { updateDoctorProfile, getDoctorsList, getDoctorDashboard } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);
router.get('/list', protect, getDoctorsList);
router.get('/dashboard', protect, authorize('doctor'), getDoctorDashboard);

module.exports = router;
