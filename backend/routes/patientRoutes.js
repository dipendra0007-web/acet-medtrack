const express = require('express');
const router = express.Router();
const { 
  updateProfile, 
  setupParentAccess, 
  uploadRecord, 
  getRecords, 
  shareRecord,
  getSharedRecords
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

router.put('/profile', protect, authorize('patient'), updateProfile);
router.post('/parent-access', protect, authorize('patient'), setupParentAccess);
router.post('/records', protect, authorize('patient'), uploadRecord);
router.get('/records', protect, getRecords);
router.post('/records/:id/share', protect, authorize('patient'), shareRecord);
router.get('/shared-records', protect, authorize('doctor'), getSharedRecords);

module.exports = router;
