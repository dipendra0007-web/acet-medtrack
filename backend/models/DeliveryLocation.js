const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const deliveryLocationSchema = new mongoose.Schema({
  region: { type: String, default: '' },
  country: { type: String, default: '' },
  state: { type: String, required: true },
  district: { type: String, default: '' },
  ward: { type: String, default: '' },
  locationMapLink: { type: String, default: '' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  area: { type: String, required: true }
}, { timestamps: true });

module.exports = createModel('DeliveryLocation', deliveryLocationSchema);
