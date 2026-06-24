const SystemLog = require('../models/SystemLog');

const logEvent = async (action, userId, userName, userRole, details) => {
  try {
    await SystemLog.create({
      action,
      userId: userId || 'system',
      userName: userName || 'System',
      userRole: userRole || 'system',
      details: details || '',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating system log:', error);
  }
};

module.exports = { logEvent };
