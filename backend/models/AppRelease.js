const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const appReleaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  version: { type: String, required: true },
  description: { type: String, default: '' },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number, required: true },
  downloadCount: { type: Number, default: 0 },
  uploadedAt: { type: String, required: true }
}, { timestamps: true });

module.exports = createModel('AppRelease', appReleaseSchema);
