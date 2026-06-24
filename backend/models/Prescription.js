const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true },
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorId: { type: String, required: true },
  doctorName: { type: String, required: true },
  date: { type: String, required: true },
  notes: { type: String },
  medicines: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    schedule: [{ type: String, required: true }], // times e.g. ["08:00", "20:00"]
    durationDays: { type: Number, required: true },
    instructions: { type: String }
  }]
}, { timestamps: true });

module.exports = createModel('Prescription', prescriptionSchema);
