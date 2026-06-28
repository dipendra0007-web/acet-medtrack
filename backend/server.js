require('dotenv').config(); // Trigger reload
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

// Public Ad, Collaborators and Delivery Locations Endpoints
const AdPopup = require('./models/AdPopup');
const Collaborator = require('./models/Collaborator');
const DeliveryLocation = require('./models/DeliveryLocation');
const WebSetting = require('./models/WebSetting');

app.get('/api/public/settings', async (req, res) => {
  try {
    let settings = await WebSetting.findOne();
    if (!settings) {
      settings = await WebSetting.create({
        websiteName: 'ACET MEDTRACK',
        logo: '',
        footerLocation: 'ACET Campus, NH-16, Aditya Nagar, Surampalem, East Godavari, Andhra Pradesh, India',
        footerPhone: '+91 8792714127',
        footerCopyright: '© 2026 ACET MEDTRACK – Crafted by Dipendra Upadhayay and TEAM',
        openingAnimationActive: true,
        openingAnimationText: 'ACET MEDTRACK',
        openingAnimationLogo: '',
        customNavLinks: [
          { label: 'Home', path: '/' },
          { label: 'About Us', path: '/about' },
          { label: 'Services', path: '/services' },
          { label: 'Our Team', path: '/team' },
          { label: 'Gallery', path: '/gallery' },
          { label: 'Shop', path: '/shop' },
          { label: 'Contact Us', path: '/contact' }
        ],
        patientRequireAge: false,
        patientRequireGender: false,
        patientRequireBloodGroup: false,
        patientRequireAllergies: false,
        driverRequireAge: true,
        driverRequireLicensePhoto: true,
        driverRequireVehicleDetails: true,
        doctorRequireSpecialization: true,
        doctorRequireExperience: true,
        doctorRequireLicenseDocument: true,
        
        // Home (Hero section) content
        heroBadge: 'Aditya College of Engineering & Technology',
        heroTitle: 'Your Health, Our Priority',
        heroSubtitle: 'Welcome to ACET MEDTRACK — a unified digital healthcare ecosystem linking patients, doctors, and family guardians to automate medication routines and protect medical histories.',
        
        // About Us section content
        aboutTitle: 'About ACFET MEDTRACK',
        aboutSubtitle: 'ACFET MEDTRACK is a full-stack, production-ready healthcare management web portal engineered by the students of Aditya College of Engineering & Technology (ACFET).',
        aboutPillar1Title: 'Data Security First',
        aboutPillar1Desc: 'All records, reports, and logins are guarded by custom JWT checks and cryptographically hashed credentials.',
        aboutPillar2Title: 'Digital Transformation',
        aboutPillar2Desc: 'Replacing ancient paper-based records with structured digital prescriptions, analytics, and automated reminders.',
        aboutPillar3Title: 'Student Innovation',
        aboutPillar3Desc: 'Engineered from scratch using modern web practices to represent practical technical problem-solving.',
        
        // Contact details
        contactEmail: 'dipendra@steptrendy.com',
        
        // Services list content
        services: [
          {
            iconName: "Clock",
            title: "Audible Medicine Alarms",
            desc: "Set exact schedules, dosage quantities, and directions. The platform plays synthesizer alarm chimes and displays full-screen browser modals to keep you on schedule.",
            color: "var(--primary-blue)"
          },
          {
            iconName: "Shield",
            title: "Digital Health Records",
            desc: "Securely upload and categorize laboratory results, clinic summaries, and medical reports. Patients control sharing permissions with doctors.",
            color: "var(--accent-teal)"
          },
          {
            iconName: "Users",
            title: "Parent/Guardian Access",
            desc: "Authorize parents using custom usernames/passwords. Parents get a tailored viewing dashboard with real-time sync of active medication compliance.",
            color: "var(--primary-blue)"
          },
          {
            iconName: "Heart",
            title: "Doctor Booking Channel",
            desc: "Browse approved specialists, check consultation times, and submit appointments. Doctors accept, reject, or suggest timeslots.",
            color: "var(--danger-red)"
          },
          {
            iconName: "Clipboard",
            title: "Digital Prescriptions",
            desc: "Doctor-written prescriptions synchronize automatically with patient medication reminders, ensuring zero manual scheduling errors.",
            color: "var(--accent-teal)"
          },
          {
            iconName: "Moon",
            title: "Dark & Light Mode Integration",
            desc: "Toggle interface themes seamlessly to match environmental lighting. Designed with accessible contrast ratios for elderly patients.",
            color: "var(--warning-orange)"
          }
        ]
      });
    }
    res.json(settings);
  } catch (err) {
    console.error('Error fetching public settings:', err);
    res.status(500).json({ message: 'Server error fetching public settings' });
  }
});

app.get('/api/public/ad-popup/active', async (req, res) => {
  try {
    const activeAd = await AdPopup.findOne({ active: true });
    res.json(activeAd || null);
  } catch (err) {
    console.error('Error fetching active ad popup:', err);
    res.status(500).json({ message: 'Server error fetching ad' });
  }
});

app.get('/api/public/collaborators', async (req, res) => {
  try {
    const collabs = await Collaborator.find({});
    res.json(collabs || []);
  } catch (err) {
    console.error('Error fetching collaborators:', err);
    res.status(500).json({ message: 'Server error fetching collaborators' });
  }
});

app.get('/api/public/delivery-locations', async (req, res) => {
  try {
    const locations = await DeliveryLocation.find({});
    res.json(locations || []);
  } catch (err) {
    console.error('Error fetching delivery locations:', err);
    res.status(500).json({ message: 'Server error fetching delivery locations' });
  }
});

app.get('/api/public/drivers', async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver', 'driverDetails.approved': true });
    const cleaned = drivers.map(d => ({
      _id: d._id,
      name: d.name,
      photo: d.photo,
      status: d.driverDetails?.status || 'inactive',
      vehicleName: d.driverDetails?.vehicleName || '',
      vehicleNumber: d.driverDetails?.vehicleNumber || '',
      state: d.driverDetails?.state || '',
      area: d.driverDetails?.landmark || ''
    }));
    res.json(cleaned);
  } catch (err) {
    console.error('Error fetching public drivers list:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

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

