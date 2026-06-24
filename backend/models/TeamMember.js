const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String },
  photo: { type: String }, // base64 representation of photo
  contactNumber: { type: String },
  instagramLink: { type: String },
  facebookLink: { type: String }
}, { timestamps: true });

module.exports = createModel('TeamMember', teamMemberSchema);
