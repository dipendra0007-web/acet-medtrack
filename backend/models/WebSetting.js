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

  // dynamic navbar navigation list
  customNavLinks: [
    {
      label: { type: String, required: true },
      path: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = createModel('WebSetting', webSettingSchema);
