const express = require('express');
const router = express.Router();
const {
  getDriverDashboard,
  updateDriverStatus,
  updateDriverLocation,
  getAvailableDrivers,
  updateAssignedOrderStatus
} = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('driver'), getDriverDashboard);
router.put('/status', protect, authorize('driver'), updateDriverStatus);
router.put('/location', protect, authorize('driver'), updateDriverLocation);
router.get('/available', protect, authorize('admin'), getAvailableDrivers);
router.put('/orders/:id/status', protect, authorize('driver'), updateAssignedOrderStatus);

module.exports = router;
