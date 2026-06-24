const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET, protect, authorize } = require('../middleware/auth');
const {
  submitMessage,
  getMessages,
  getTicket,
  replyMessage
} = require('../controllers/contactController');

// Optional protect middleware for public routes that admins also access
const optionalProtect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Ignore token decode errors for public access
    }
  }
  next();
};

// Public submission
router.post('/', submitMessage);

// Admin-only ticket list
router.get('/', protect, authorize('admin'), getMessages);

// Public single ticket access (polling)
router.get('/ticket/:id', getTicket);

// Reply to ticket (supports admin identity if token is present)
router.post('/ticket/:id/reply', optionalProtect, replyMessage);

module.exports = router;
