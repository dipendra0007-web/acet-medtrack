const express = require('express');
const router = express.Router();
const { 
  getReleases, 
  uploadRelease, 
  deleteRelease, 
  downloadRelease 
} = require('../controllers/releaseController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getReleases);
router.get('/:id/download', downloadRelease);

// Admin-only protected routes
router.post('/', protect, authorize('admin'), uploadRelease);
router.delete('/:id', protect, authorize('admin'), deleteRelease);

module.exports = router;
