const express = require('express');
const router = express.Router();
const { submitReview, getApprovedReviews } = require('../controllers/reviewController');

router.post('/', submitReview);
router.get('/', getApprovedReviews);

module.exports = router;
