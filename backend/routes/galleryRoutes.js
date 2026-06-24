const express = require('express');
const router = express.Router();
const { getGalleryItems } = require('../controllers/galleryController');

router.get('/', getGalleryItems);

module.exports = router;
