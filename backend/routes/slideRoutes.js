const express = require('express');
const router = express.Router();
const { getSlides, createSlide, updateSlide, deleteSlide } = require('../controllers/slideController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getSlides);  // Public — anyone can view slides
router.post('/', protect, authorize('admin'), createSlide);
router.put('/:id', protect, authorize('admin'), updateSlide);
router.delete('/:id', protect, authorize('admin'), deleteSlide);

module.exports = router;
