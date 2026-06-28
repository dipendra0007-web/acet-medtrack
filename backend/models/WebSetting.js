const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const webSettingSchema = new mongoose.Schema({
  logo: { type: String, default: '' }, // base64 string
  websiteName: { type: String, default: 'ACET MEDTRACK' },
  footerLocation: { type: String, default: 'ACET Campus, NH-16, Aditya Nagar, Surampalem, East Godavari, Andhra Pradesh, India' },
  footerPhone: { type: String, default: '+91 8792714127' },
  footerCopyright: { type: String, default: '© 2026 ACET MEDTRACK – Crafted by Dipendra Upadhayay and TEAM' },
  
  // opening animation settings
  openingAnimationActive: { type: Boolean, default: true },
  openingAnimationText: { type: String, default: 'ACET MEDTRACK' },
  openingAnimationLogo: { type: String, default: '' }, // base64 string

  // Dynamic navbar navigation list
  customNavLinks: [
    {
      label: { type: String, required: true },
      path: { type: String, required: true }
    }
  ],

  // Admin registration checklist config
  patientRequireAge: { type: Boolean, default: false },
  patientRequireGender: { type: Boolean, default: false },
  patientRequireBloodGroup: { type: Boolean, default: false },
  patientRequireAllergies: { type: Boolean, default: false },
  
  driverRequireAge: { type: Boolean, default: true },
  driverRequireLicensePhoto: { type: Boolean, default: true },
  driverRequireVehicleDetails: { type: Boolean, default: true },
  
  doctorRequireSpecialization: { type: Boolean, default: true },
  doctorRequireExperience: { type: Boolean, default: true },
  doctorRequireLicenseDocument: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = createModel('WebSetting', webSettingSchema);
