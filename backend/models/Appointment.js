const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorId: { type: String, required: true },
  doctorName: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  timeSlot: { type: String, required: true }, // e.g., "09:00"
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'rescheduled'], 
    default: 'pending' 
  },
  notes: { type: String },
  prescriptionId: { type: String },
  paymentDetails: {
    amountINR: { type: Number },
    amountUSD: { type: Number },
    status: { type: String }, // e.g. "Paid"
    method: { type: String }, // "UPI" or "Card"
    transactionId: { type: String }
  }
}, { timestamps: true });

module.exports = createModel('Appointment', appointmentSchema);
