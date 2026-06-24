const express = require('express');
const router = express.Router();
const { 
  createReminder, 
  getReminders, 
  updateReminder, 
  deleteReminder, 
  logCompliance 
} = require('../controllers/reminderController');
const { protect, authorize } = require('../middleware/auth');

// Both patients AND parents can schedule/manage medicine reminders
router.post('/', protect, authorize('patient', 'parent'), createReminder);
router.get('/', protect, getReminders);
router.put('/:id', protect, authorize('patient', 'parent'), updateReminder);
router.delete('/:id', protect, authorize('patient', 'parent'), deleteReminder);
router.post('/:id/log', protect, logCompliance);

module.exports = router;
