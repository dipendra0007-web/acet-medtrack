const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'replied'], default: 'pending' },
  replies: [{
    sender: { type: String, enum: ['user', 'admin'], required: true },
    text: { type: String, required: true },
    timestamp: { type: String, required: true }
  }]
}, { timestamps: true });

module.exports = createModel('ContactMessage', contactMessageSchema);
