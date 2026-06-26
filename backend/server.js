require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const teamRoutes = require('./routes/teamRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const shopRoutes = require('./routes/shopRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const slideRoutes = require('./routes/slideRoutes');
const releaseRoutes = require('./routes/releaseRoutes');
const contactRoutes = require('./routes/contactRoutes');
const driverRoutes = require('./routes/driverRoutes');

const app = express();

// Connect to Database (handles Mongo and fallback fileDb)
connectDB();

// Ensure uploads/releases subfolders exist on startup
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads/releases');
const apkDir = path.join(__dirname, 'uploads/releases/apk');
const ipaDir = path.join(__dirname, 'uploads/releases/ipa');
const photosDir = path.join(__dirname, 'uploads/releases/photos');
[uploadsDir, apkDir, ipaDir, photosDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Backup default data at startup for Factory Reset functionality
const dataDir = path.join(__dirname, 'data');
const backupDir = path.join(__dirname, 'data_backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  if (fs.existsSync(dataDir)) {
    try {
      const files = fs.readdirSync(dataDir);
      files.forEach(file => {
        fs.copyFileSync(path.join(dataDir, file), path.join(backupDir, file));
      });
      console.log('[Backup] Initial database files copied to backup folder');
    } catch (err) {
      console.error('[Backup] Failed to copy initial database files:', err);
    }
  }
}

// Middlewares
app.use(cors());
// Set limits high enough to handle base64 files uploads for health reports and app releases
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ limit: '150mb', extended: true }));

// Serve static assets if any (optional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/releases', releaseRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/driver', driverRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    databaseMode: require('./models/dbModel').getUseMongo() ? 'MongoDB' : 'Local JSON'
  });
});

// Public Stats Endpoint
app.get('/api/public-stats', async (req, res) => {
  try {
    const User = require('./models/User');
    const MedicineReminder = require('./models/MedicineReminder');

    const dbPatients = await User.countDocuments({ role: 'patient' });
    const dbDoctors = await User.countDocuments({ role: 'doctor', doctorApproved: true });
    const dbReminders = await MedicineReminder.countDocuments({});

    res.json({
      patients: 2400 + dbPatients,
      doctors: 80 + dbDoctors,
      doses: 15420 + dbReminders * 14,
      accuracy: 98.7
    });
  } catch (err) {
    console.error('Error fetching public stats:', err);
    res.json({
      patients: 2400,
      doctors: 80,
      doses: 15420,
      accuracy: 98.7
    });
  }
});

// Serve frontend static assets in production
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Express Error]', err);
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[Express] Server is running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Express] ❌ Port ${PORT} is already in use. Please close the other process and restart.`);
    process.exit(1);
  } else {
    throw err;
  }
});

