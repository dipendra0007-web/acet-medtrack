const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const gallerySchema = new mongoose.Schema({
  type: { type: String, enum: ['photo', 'video'], required: true },
  title: { type: String, required: true },
  source: { type: String, enum: ['upload', 'link'], required: true },
  url: { type: String, required: true } // base64 string or link URL
}, { timestamps: true });

module.exports = createModel('Gallery', gallerySchema);
