const express = require('express');
const router = express.Router();
const {
  getDriverDashboard,
  updateDriverStatus,
  updateDriverLocation,
  getAvailableDrivers
} = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('driver'), getDriverDashboard);
router.put('/status', protect, authorize('driver'), updateDriverStatus);
router.put('/location', protect, authorize('driver'), updateDriverLocation);
router.get('/available', protect, authorize('admin'), getAvailableDrivers);

module.exports = router;
