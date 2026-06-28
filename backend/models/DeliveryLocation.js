const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const deliveryLocationSchema = new mongoose.Schema({
  state: { type: String, required: true },
  area: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
}, { timestamps: true });

module.exports = createModel('DeliveryLocation', deliveryLocationSchema);
