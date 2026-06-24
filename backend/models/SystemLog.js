const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const systemLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  userId: { type: String },
  userName: { type: String },
  userRole: { type: String },
  details: { type: String },
  timestamp: { type: String, required: true }
}, { timestamps: true });

module.exports = createModel('SystemLog', systemLogSchema);
