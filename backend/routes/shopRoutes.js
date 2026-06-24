const express = require('express');
const router = express.Router();
const { getShopItems, placeOrder, getMyOrders } = require('../controllers/shopController');
const { protect } = require('../middleware/auth');

router.get('/', getShopItems);
router.post('/order', protect, placeOrder);
router.get('/orders/my', protect, getMyOrders);

module.exports = router;
