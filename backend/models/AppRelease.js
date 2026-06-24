const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const appReleaseSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  version:        { type: String, required: true },
  description:    { type: String, default: '' },
  photo:          { type: String, default: '' },    // URL path to cover image
  platform:       { type: String, default: 'android', enum: ['android', 'ios', 'both'] },

  // Android APK
  fileName:       { type: String, default: '' },
  filePath:       { type: String, default: '' },
  fileSize:       { type: Number, default: 0 },

  // iOS IPA
  ipaFileName:    { type: String, default: '' },
  ipaFilePath:    { type: String, default: '' },
  ipaFileSize:    { type: Number, default: 0 },

  downloadCount:  { type: Number, default: 0 },
  ipaDownloadCount: { type: Number, default: 0 },
  uploadedAt:     { type: String, required: true }
}, { timestamps: true });

module.exports = createModel('AppRelease', appReleaseSchema);
