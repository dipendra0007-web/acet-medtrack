const Notification = require('../models/Notification');

const sendNotification = async (userId, title, message, type = 'info') => {
  try {
    await Notification.create({
      userId: String(userId),
      title,
      message,
      type
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = { sendNotification };
