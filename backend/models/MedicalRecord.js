const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Report', 'Prescription', 'Lab Result', 'Other'], 
    default: 'Other' 
  },
  fileUrl: { type: String, required: true }, // Store base64 dataurl or custom mock file URL
  fileName: { type: String, required: true },
  uploadedAt: { type: String, required: true },
  sharedWithDoctors: [{ type: String }] // Array of doctor userIds
}, { timestamps: true });

module.exports = createModel('MedicalRecord', medicalRecordSchema);
