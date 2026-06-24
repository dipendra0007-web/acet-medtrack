const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], required: true },
  photo: { type: String }, // base64 representation of profile photo
  doctorApproved: { type: Boolean, default: false },
  doctorDetails: {
    specialization: { type: String },
    experience: { type: Number },
    clinicInfo: { type: String },
    availability: [{
      day: { type: String },
      slots: [{ type: String }]
    }]
  },
  patientDetails: {
    bloodGroup: { type: String },
    allergies: [{ type: String }],
    conditions: [{ type: String }],
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relation: { type: String }
    },
    parentAccess: {
      username: { type: String },
      passwordHash: { type: String },
      permissions: {
        medicalRecords: { type: Boolean, default: false },
        prescriptions: { type: Boolean, default: false },
        medicineSchedules: { type: Boolean, default: false },
        appointments: { type: Boolean, default: false }
      }
    }
  }
}, { timestamps: true });

module.exports = createModel('User', userSchema);
