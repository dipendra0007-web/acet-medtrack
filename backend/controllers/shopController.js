const ShopItem = require('../models/ShopItem');
const Order = require('../models/Order');
const { logEvent } = require('../utils/logger');
const { sendNotification } = require('../utils/notifier');

// @desc    Get all shop items
// @route   GET /api/shop
// @access  Public
const getShopItems = async (req, res) => {
  try {
    const items = await ShopItem.find({});
    res.json(items);
  } catch (error) {
    console.error('Error fetching shop items:', error);
    res.status(500).json({ message: 'Failed to retrieve shop catalog' });
  }
};

// @desc    Place a new order
// @route   POST /api/shop/order
// @access  Private (Patient)
const placeOrder = async (req, res) => {
  const { items, totalINR, totalUSD, contactDetails, address, floorName, coordinates } = req.body;

  if (!items || items.length === 0 || !totalINR || !totalUSD || !contactDetails || !address || !floorName || !coordinates) {
    return res.status(400).json({ message: 'All order checkout details are required.' });
  }

  try {
    // Verify stocks and decrement them
    for (let ordItem of items) {
      const dbItem = await ShopItem.findById(ordItem.itemId);
      if (!dbItem) {
        return res.status(404).json({ message: `Item ${ordItem.name} not found in inventory.` });
      }
      if (dbItem.stocks < ordItem.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${dbItem.name}. Available: ${dbItem.stocks}` });
      }
    }

    // Decrement stock levels
    for (let ordItem of items) {
      const dbItem = await ShopItem.findById(ordItem.itemId);
      await ShopItem.findByIdAndUpdate(ordItem.itemId, {
        $set: { stocks: dbItem.stocks - ordItem.quantity }
      });
    }

    // Create the order
    const order = await Order.create({
      patientId: req.user._id || req.user.id,
      patientName: req.user.name,
      items,
      totalINR,
      totalUSD,
      contactDetails,
      address,
      floorName,
      coordinates,
      status: 'Received'
    });

    // Notify patient
    await sendNotification(
      req.user._id || req.user.id,
      'Order Placed! 🛒',
      `Your order #${order._id.substring(0, 8)}... has been received and is pending dispatch.`,
      'new_order'
    );

    // Notify admin
    await sendNotification(
      'admin',
      'New Pharmacy Order 📥',
      `New order #${order._id.substring(0, 8)}... placed by ${req.user.name} totaling ₹${totalINR}.`,
      'new_order'
    );

    logEvent('ORDER_PLACED', req.user._id || req.user.id, req.user.role, `Placed order ${order._id} totaling ₹${totalINR} / $${totalUSD}`);
    res.status(201).json({ message: 'Order placed successfully.', order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order.' });
  }
};

// @desc    Get logged in patient's order history
// @route   GET /api/shop/orders/my
// @access  Private (Patient)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ patientId: req.user._id || req.user.id });
    // Sort by createdAt descending
    const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedOrders);
  } catch (error) {
    console.error('Error fetching patient orders:', error);
    res.status(500).json({ message: 'Failed to retrieve order history.' });
  }
};

module.exports = {
  getShopItems,
  placeOrder,
  getMyOrders
};
