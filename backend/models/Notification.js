const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // can be patientId, doctorId, 'admin', or 'all'
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' }, // 'order_dispatch', 'new_order', 'approval', etc.
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = createModel('Notification', notificationSchema);
