const mongoose = require('mongoose');
const { createModel } = require('./dbModel');

const shopItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  priceINR: { type: Number, required: true },
  priceUSD: { type: Number, required: true },
  stocks: { type: Number, required: true, default: 0 },
  photo: { type: String, required: true }, // Base64 representation or URL
  category: { type: String, required: true }
}, { timestamps: true });

module.exports = createModel('ShopItem', shopItemSchema);
