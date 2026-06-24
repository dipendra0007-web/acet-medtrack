const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const medicineReminderSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  schedule: [{ type: String, required: true }], // times e.g., ["08:00", "14:00", "20:00"]
  instruction: { type: String },
  durationDays: { type: Number, required: true },
  startDate: { type: String, required: true }, // YYYY-MM-DD
  endDate: { type: String, required: true }, // YYYY-MM-DD
  active: { type: Boolean, default: true },
  history: [{
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:MM
    status: { type: String, enum: ['taken', 'missed'], required: true }
  }]
}, { timestamps: true });

module.exports = createModel('MedicineReminder', medicineReminderSchema);
