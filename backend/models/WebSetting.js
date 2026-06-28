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
  doctorRequireLicenseDocument: { type: Boolean, default: true },

  // Home (Hero section) content
  heroBadge: { type: String, default: 'Aditya College of Engineering & Technology' },
  heroTitle: { type: String, default: 'Your Health, Our Priority' },
  heroSubtitle: { type: String, default: 'Welcome to ACET MEDTRACK — a unified digital healthcare ecosystem linking patients, doctors, and family guardians to automate medication routines and protect medical histories.' },
  
  // About Us section content
  aboutTitle: { type: String, default: 'About ACFET MEDTRACK' },
  aboutSubtitle: { type: String, default: 'ACFET MEDTRACK is a full-stack, production-ready healthcare management web portal engineered by the students of Aditya College of Engineering & Technology (ACFET).' },
  aboutPillar1Title: { type: String, default: 'Data Security First' },
  aboutPillar1Desc: { type: String, default: 'All records, reports, and logins are guarded by custom JWT checks and cryptographically hashed credentials.' },
  aboutPillar2Title: { type: String, default: 'Digital Transformation' },
  aboutPillar2Desc: { type: String, default: 'Replacing ancient paper-based records with structured digital prescriptions, analytics, and automated reminders.' },
  aboutPillar3Title: { type: String, default: 'Student Innovation' },
  aboutPillar3Desc: { type: String, default: 'Engineered from scratch using modern web practices to represent practical technical problem-solving.' },

  // Contact details
  contactEmail: { type: String, default: 'dipendra@steptrendy.com' },

  // Services list content
  services: [
    {
      iconName: { type: String, required: true },
      title: { type: String, required: true },
      desc: { type: String, required: true },
      color: { type: String, default: 'var(--primary-blue)' }
    }
  ]
}, { timestamps: true });

module.exports = createModel('WebSetting', webSettingSchema);
