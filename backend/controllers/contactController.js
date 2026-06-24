const ContactMessage = require('../models/ContactMessage');
const { sendNotification } = require('../utils/notifier');

// @desc    Submit a new contact message ticket
// @route   POST /api/contact
// @access  Public
const submitMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields (name, email, subject, message) are required' });
  }

  try {
    const contact = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      status: 'pending',
      replies: []
    });

    // Create system notification for administrative dashboard
    await sendNotification(
      'admin',
      'New Support Ticket',
      `"${name}" submitted a ticket: "${subject}"`,
      'new_ticket'
    );

    res.status(201).json(contact);
  } catch (error) {
    console.error('Submit contact message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all contact messages (tickets)
// @route   GET /api/contact
// @access  Private (Admin)
const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({});
    // Sort manually by date descending
    const sorted = [...messages].sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));
    res.json(sorted);
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single ticket details
// @route   GET /api/contact/ticket/:id
// @access  Public
const getTicket = async (req, res) => {
  try {
    const ticket = await ContactMessage.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a reply to a contact ticket thread
// @route   POST /api/contact/ticket/:id/reply
// @access  Public (Used by user, or Admin if authenticated)
const replyMessage = async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Reply message text is required' });
  }

  try {
    const ticket = await ContactMessage.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Determine sender based on authorization token presence
    const sender = (req.user && req.user.role === 'admin') ? 'admin' : 'user';
    
    // Update status
    const status = (sender === 'admin') ? 'replied' : 'pending';

    const newReply = {
      sender,
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedReplies = [...(ticket.replies || []), newReply];

    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          status, 
          replies: updatedReplies 
        } 
      },
      { new: true }
    );

    // If user replies, send notification to admin
    if (sender === 'user') {
      await sendNotification(
        'admin',
        'New Ticket Reply',
        `User replied to support ticket "${ticket.subject}"`,
        'ticket_reply'
      );
    }

    res.json(updated);
  } catch (error) {
    console.error('Reply ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitMessage,
  getMessages,
  getTicket,
  replyMessage
};
