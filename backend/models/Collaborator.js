const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const collaboratorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String }, // base64 representation of photo
  websiteLink: { type: String, required: true }
}, { timestamps: true });

module.exports = createModel('Collaborator', collaboratorSchema);
