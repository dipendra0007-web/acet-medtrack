const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'admin') {
      // Admins see all notifications
      query = {};
    } else {
      // Patients / Doctors see their own or 'all'
      query = { userId: { $in: [String(req.user._id || req.user.id), 'all'] } };
    }

    const list = await Notification.find(query);
    // Sort descending by createdAt
    const sortedList = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedList);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to retrieve notifications.' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const updated = await Notification.findByIdAndUpdate(id, {
      $set: { isRead: true }
    }, { new: true });

    res.json(updated);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear all notifications for user
// @route   DELETE /api/notifications
// @access  Private
const clearNotifications = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      await Notification.deleteMany({});
    } else {
      await Notification.deleteMany({ userId: String(req.user._id || req.user.id) });
    }
    res.json({ message: 'Notifications cleared successfully.' });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  clearNotifications
};
