const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin', 'driver'], required: true },
  photo: { type: String }, // base64 representation of profile photo
  doctorApproved: { type: Boolean, default: false },

  doctorDetails: {
    specialization: { type: String },
    experience: { type: Number },
    clinicInfo: { type: String },
    availability: [{
      day: { type: String },
      slots: [{ type: String }]
    }],
    // Location
    country: { type: String },
    state: { type: String },
    city: { type: String },
    pincode: { type: String },
    landmark: { type: String },
    // Contact & Verification Documents
    contactNumber: { type: String },
    licenseDocument: { type: String },         // base64
    educationQualification: { type: String },  // base64
    otherDocuments: { type: String }           // base64
  },

  patientDetails: {
    bloodGroup: { type: String },
    allergies: [{ type: String }],
    conditions: [{ type: String }],
    // Location
    country: { type: String },
    state: { type: String },
    city: { type: String },
    pincode: { type: String },
    landmark: { type: String },
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
  },

  driverDetails: {
    age: { type: Number },
    licenseNumber: { type: String },
    vehicleNumber: { type: String },
    vehicleName: { type: String },
    licensePhoto: { type: String },  // base64
    approved: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive', 'on_delivery'], default: 'active' },
    currentLocation: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  }

}, { timestamps: true });

module.exports = createModel('User', userSchema);
