const mongoose = require('mongoose');
const { setUseMongo } = require('../models/dbModel');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.log('[Database] No MONGO_URI found in environment. Falling back to local JSON storage.');
    setUseMongo(false);
    return;
  }

  try {
    console.log('[Database] Attempting connection to MongoDB...');
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('[Database] MongoDB connected successfully.');
    setUseMongo(true);
  } catch (error) {
    console.error(`[Database] MongoDB connection failed: ${error.message}`);
    console.log('[Database] Falling back to local JSON storage.');
    setUseMongo(false);
  }
};

module.exports = connectDB;
