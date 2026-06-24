const MedicineReminder = require('../models/MedicineReminder');
const { logEvent } = require('../utils/logger');

// @desc    Create a new manual medicine reminder
// @route   POST /api/reminders
// @access  Private (Patient)
const createReminder = async (req, res) => {
  const { name, dosage, schedule, instruction, durationDays, startDate } = req.body;

  if (!name || !dosage || !schedule || !durationDays || !startDate) {
    return res.status(400).json({ message: 'Name, dosage, schedule times, duration, and start date are required' });
  }

  try {
    // Calculate end date
    const endDateObj = new Date(startDate);
    endDateObj.setDate(endDateObj.getDate() + Number(durationDays));
    const endDate = endDateObj.toISOString().split('T')[0];

    const reminder = await MedicineReminder.create({
      patientId: req.user.id,
      name,
      dosage,
      schedule, // array of time strings e.g. ["08:00"]
      instruction: instruction || '',
      durationDays: Number(durationDays),
      startDate,
      endDate,
      active: true,
      history: []
    });

    await logEvent(
      'CREATE_REMINDER',
      req.user.id,
      req.user.name,
      req.user.role,
      `Created reminder for "${name}" (${dosage})`
    );

    res.status(201).json({ message: 'Reminder created successfully', reminder });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get patient medicine reminders
// @route   GET /api/reminders
// @access  Private (Patient, Parent)
const getReminders = async (req, res) => {
  try {
    if (req.user.role === 'parent') {
      if (!req.user.permissions?.medicineSchedules) {
        return res.status(403).json({ message: 'Access denied: Parent does not have permission to view medicine schedules' });
      }
      const reminders = await MedicineReminder.find({ patientId: req.user.id });
      return res.json(reminders);
    }

    if (req.user.role === 'patient') {
      const reminders = await MedicineReminder.find({ patientId: req.user.id });
      return res.json(reminders);
    }

    res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle reminder status (active/inactive) or edit details
// @route   PUT /api/reminders/:id
// @access  Private (Patient)
const updateReminder = async (req, res) => {
  const reminderId = req.params.id;
  const { active, name, dosage, schedule, instruction } = req.body;

  try {
    const reminder = await MedicineReminder.findById(reminderId);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    if (reminder.patientId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to modify this reminder' });
    }

    const updates = {};
    if (active !== undefined) updates.active = active;
    if (name) updates.name = name;
    if (dosage) updates.dosage = dosage;
    if (schedule) updates.schedule = schedule;
    if (instruction !== undefined) updates.instruction = instruction;

    const updatedReminder = await MedicineReminder.findByIdAndUpdate(
      reminderId,
      { $set: updates },
      { new: true }
    );

    res.json({ message: 'Reminder updated successfully', reminder: updatedReminder });
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a medicine reminder
// @route   DELETE /api/reminders/:id
// @access  Private (Patient)
const deleteReminder = async (req, res) => {
  const reminderId = req.params.id;

  try {
    const reminder = await MedicineReminder.findById(reminderId);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    if (reminder.patientId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this reminder' });
    }

    await MedicineReminder.deleteOne({ _id: reminderId });

    await logEvent(
      'DELETE_REMINDER',
      req.user.id,
      req.user.name,
      req.user.role,
      `Deleted medicine reminder for: ${reminder.name}`
    );

    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Log medicine compliance (taken / missed)
// @route   POST /api/reminders/:id/log
// @access  Private (Patient, Parent)
const logCompliance = async (req, res) => {
  const reminderId = req.params.id;
  const { date, time, status } = req.body; // status: 'taken' or 'missed'

  if (!date || !time || !status) {
    return res.status(400).json({ message: 'Date, time, and status are required' });
  }

  try {
    const reminder = await MedicineReminder.findById(reminderId);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // Auth validation (Parent can log for patient if they have medicineSchedules permission)
    if (req.user.role === 'parent') {
      if (!req.user.permissions?.medicineSchedules) {
        return res.status(403).json({ message: 'Access denied: Parent does not have permission' });
      }
    } else if (reminder.patientId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const newLog = { date, time, status };
    const history = reminder.history || [];
    
    // Check if we already logged this specific slot today to avoid duplication
    const duplicate = history.some(h => h.date === date && h.time === time);
    if (duplicate) {
      // Update it
      const index = history.findIndex(h => h.date === date && h.time === time);
      history[index].status = status;
    } else {
      history.push(newLog);
    }

    const updated = await MedicineReminder.findByIdAndUpdate(
      reminderId,
      { $set: { history } },
      { new: true }
    );

    await logEvent(
      'LOG_MEDICINE_COMPLIANCE',
      req.user.id,
      req.user.name,
      req.user.role,
      `Logged "${reminder.name}" at ${time} on ${date} as ${status.toUpperCase()}`
    );

    res.json({ message: 'Compliance log recorded successfully', reminder: updated });
  } catch (error) {
    console.error('Log compliance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  logCompliance
};
