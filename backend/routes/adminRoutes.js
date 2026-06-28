const express = require('express');
const router = express.Router();
const { 
  getAdminDashboard, 
  getAllUsers, 
  deleteUser, 
  approveDoctor, 
  approveDriver, 
  getSystemLogs, 
  createShopItem, 
  updateShopItem, 
  deleteShopItem, 
  getAllOrders, 
  updateOrderStatus, 
  factoryReset,
  updateUserRole,
  getAdPopups,
  createAdPopup,
  updateAdPopup,
  deleteAdPopup,
  getCollaborators,
  createCollaborator,
  updateCollaborator,
  deleteCollaborator,
  getDeliveryLocations,
  createDeliveryLocation,
  deleteDeliveryLocation,
  getWebSettings,
  updateWebSettings
} = require('../controllers/adminController');
const { createTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamController');
const { getAllReviews, approveReview, deleteReview } = require('../controllers/reviewController');
const { createGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('admin'), getAdminDashboard);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.put('/doctors/:id/approve', protect, authorize('admin'), approveDoctor);
router.put('/drivers/:id/approve', protect, authorize('admin'), approveDriver);
router.get('/logs', protect, authorize('admin'), getSystemLogs);
router.post('/factory-reset', protect, authorize('admin'), factoryReset);

// Team Role / Access Management
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);

// Delivery Locations Management
router.get('/delivery-locations', protect, authorize('admin'), getDeliveryLocations);
router.post('/delivery-locations', protect, authorize('admin'), createDeliveryLocation);
router.delete('/delivery-locations/:id', protect, authorize('admin'), deleteDeliveryLocation);

// Homepage Ad Popup Management
router.get('/ad-popup', protect, authorize('admin'), getAdPopups);
router.post('/ad-popup', protect, authorize('admin'), createAdPopup);
router.put('/ad-popup/:id', protect, authorize('admin'), updateAdPopup);
router.delete('/ad-popup/:id', protect, authorize('admin'), deleteAdPopup);

// Collaborators Management
router.get('/collaborators', protect, authorize('admin'), getCollaborators);
router.post('/collaborators', protect, authorize('admin'), createCollaborator);
router.put('/collaborators/:id', protect, authorize('admin'), updateCollaborator);
router.delete('/collaborators/:id', protect, authorize('admin'), deleteCollaborator);

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

// Web Settings Customization
router.get('/settings', protect, authorize('admin'), getWebSettings);
router.post('/settings', protect, authorize('admin'), updateWebSettings);

module.exports = router;
