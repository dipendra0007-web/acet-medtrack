const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const orderSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  items: [{
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    priceINR: { type: Number, required: true },
    priceUSD: { type: Number, required: true }
  }],
  totalINR: { type: Number, required: true },
  totalUSD: { type: Number, required: true },
  contactDetails: { type: String, required: true },
  address: { type: String, required: true },
  floorName: { type: String, required: true },
  coordinates: { type: String, required: true }, // "lat, lng" representation
  status: { type: String, enum: ['Received', 'Out for Delivery', 'Delivered'], default: 'Received' },
  driverId: { type: String },      // Reference to registered driver user ID
  driverName: { type: String },
  driverPhone: { type: String },
  deliveryStreet: { type: String },
  deliveryFloor: { type: String },
  deliveryArea: { type: String },
  deliveryLandmark: { type: String }
}, { timestamps: true });

module.exports = createModel('Order', orderSchema);
