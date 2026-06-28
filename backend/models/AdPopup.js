const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const adPopupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String }, // base64 representation of image
  linkUrl: { type: String },  // Target website link
  duration: { type: Number, default: 5 }, // Skip timer in seconds
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = createModel('AdPopup', adPopupSchema);
