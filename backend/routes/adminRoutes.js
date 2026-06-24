const express = require('express');
const router = express.Router();
const { getAdminDashboard, getAllUsers, deleteUser, approveDoctor, getSystemLogs, createShopItem, updateShopItem, deleteShopItem, getAllOrders, updateOrderStatus, factoryReset } = require('../controllers/adminController');
const { createTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamController');
const { getAllReviews, approveReview, deleteReview } = require('../controllers/reviewController');
const { createGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('admin'), getAdminDashboard);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.put('/doctors/:id/approve', protect, authorize('admin'), approveDoctor);
router.get('/logs', protect, authorize('admin'), getSystemLogs);
router.post('/factory-reset', protect, authorize('admin'), factoryReset);

// Team Management
router.post('/team', protect, authorize('admin'), createTeamMember);
router.put('/team/:id', protect, authorize('admin'), updateTeamMember);
router.delete('/team/:id', protect, authorize('admin'), deleteTeamMember);

// Reviews Moderation
router.get('/reviews', protect, authorize('admin'), getAllReviews);
router.put('/reviews/:id/approve', protect, authorize('admin'), approveReview);
router.delete('/reviews/:id', protect, authorize('admin'), deleteReview);

// Gallery Management
router.post('/gallery', protect, authorize('admin'), createGalleryItem);
router.delete('/gallery/:id', protect, authorize('admin'), deleteGalleryItem);

// Shop Inventory Management
router.post('/shop', protect, authorize('admin'), createShopItem);
router.put('/shop/:id', protect, authorize('admin'), updateShopItem);
router.delete('/shop/:id', protect, authorize('admin'), deleteShopItem);

// Order Management
router.get('/orders', protect, authorize('admin'), getAllOrders);
router.put('/orders/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
