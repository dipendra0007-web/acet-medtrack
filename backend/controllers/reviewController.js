const Review = require('../models/Review');
const { logEvent } = require('../utils/logger');

// @desc    Submit a review
// @route   POST /api/reviews
// @access  Public
const submitReview = async (req, res) => {
  const { name, email, rating, comment } = req.body;

  if (!name || !email || !rating || !comment) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const review = await Review.create({
      name,
      email,
      rating: Number(rating),
      comment,
      approved: false // Requires admin moderation
    });

    res.status(201).json({ message: 'Review submitted successfully. It will be visible after admin approval.', review });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

// @desc    Get all approved reviews
// @route   GET /api/reviews
// @access  Public
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

// @desc    Get all reviews for moderation
// @route   GET /api/admin/reviews
// @access  Private (Admin)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews list' });
  }
};

// @desc    Approve/Reject a review
// @route   PUT /api/admin/reviews/:id/approve
// @access  Private (Admin)
const approveReview = async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const updated = await Review.findByIdAndUpdate(id, { approved }, { new: true });
    logEvent('REVIEW_MODERATED', req.user._id, req.user.role, `${approved ? 'Approved' : 'Rejected'} review from ${review.name}`);
    res.json(updated);
  } catch (error) {
    console.error('Error moderating review:', error);
    res.status(500).json({ message: 'Failed to moderate review' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin)
const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Review.deleteOne({ _id: id });
    logEvent('REVIEW_DELETED', req.user._id, req.user.role, `Deleted review from ${review.name}`);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
};

module.exports = {
  submitReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  deleteReview
};
