const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const slideSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  photoPrompt: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  keyPoints: { type: [String], default: [] },
  explanation: { type: String, default: '' },
  accent: { type: String, default: '#1d4ed8' },
  type: { type: String, default: 'standard' },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#1e293b' },
  titleColor: { type: String, default: '#1d4ed8' },
  subtitleColor: { type: String, default: '#d97706' },
  fontFamily: { type: String, default: 'Poppins' }
}, { timestamps: true });

module.exports = createModel('Slide', slideSchema);
