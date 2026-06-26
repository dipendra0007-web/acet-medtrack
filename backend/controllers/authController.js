const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');
const { logEvent } = require('../utils/logger');

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const {
    name, email, password, role, adminSecret,
    doctorDetails, patientDetails, driverDetails
  } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    let isApproved = false;
    let finalRole = role;

    if (role === 'admin') {
      if (adminSecret !== '884822') {
        return res.status(400).json({ message: 'Invalid Admin registration secret' });
      }
      isApproved = true;
    } else if (role === 'patient') {
      isApproved = true;
    } else if (role === 'doctor') {
      isApproved = false; // Needs admin approval
    } else if (role === 'driver') {
      isApproved = false; // Needs admin approval
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      doctorApproved: isApproved
    };

    if (role === 'doctor') {
      userData.doctorDetails = {
        specialization: doctorDetails?.specialization || 'General',
        experience: Number(doctorDetails?.experience) || 1,
        clinicInfo: doctorDetails?.clinicInfo || '',
        availability: doctorDetails?.availability || [
          { day: 'Monday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
          { day: 'Tuesday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
          { day: 'Wednesday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
          { day: 'Thursday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
          { day: 'Friday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] }
        ],
        // Location fields
        country: doctorDetails?.country || '',
        state: doctorDetails?.state || '',
        city: doctorDetails?.city || '',
        pincode: doctorDetails?.pincode || '',
        landmark: doctorDetails?.landmark || '',
        // Contact & Document fields
        contactNumber: doctorDetails?.contactNumber || '',
        licenseDocument: doctorDetails?.licenseDocument || '',
        educationQualification: doctorDetails?.educationQualification || '',
        otherDocuments: doctorDetails?.otherDocuments || ''
      };
    } else if (role === 'patient') {
      userData.patientDetails = {
        bloodGroup: '',
        allergies: [],
        conditions: [],
        // Location fields
        country: patientDetails?.country || '',
        state: patientDetails?.state || '',
        city: patientDetails?.city || '',
        pincode: patientDetails?.pincode || '',
        landmark: patientDetails?.landmark || '',
        emergencyContact: { name: '', phone: '', relation: '' },
        parentAccess: {
          username: '',
          passwordHash: '',
          permissions: {
            medicalRecords: false,
            prescriptions: false,
            medicineSchedules: false,
            appointments: false
          }
        }
      };
    } else if (role === 'driver') {
      if (!driverDetails?.licenseNumber || !driverDetails?.vehicleNumber || !driverDetails?.vehicleName) {
        return res.status(400).json({ message: 'License number, vehicle number, and vehicle name are required for drivers' });
      }
      userData.driverDetails = {
        age: Number(driverDetails?.age) || 18,
        licenseNumber: driverDetails?.licenseNumber || '',
        vehicleNumber: driverDetails?.vehicleNumber || '',
        vehicleName: driverDetails?.vehicleName || '',
        licensePhoto: driverDetails?.licensePhoto || '',
        approved: false,
        status: 'active',
        currentLocation: { latitude: null, longitude: null }
      };
    }

    const user = await User.create(userData);

    await logEvent(
      'REGISTER',
      user._id,
      user.name,
      user.role,
      `User registered successfully. Approved: ${user.doctorApproved}. Role: ${user.role}`
    );

    const pendingRoles = ['doctor', 'driver'];
    res.status(201).json({
      message: pendingRoles.includes(role)
        ? `Registration successful! Your account is pending Admin verification.`
        : 'Registration successful!',
      token: isApproved ? generateToken({ id: user._id, role: user.role, name: user.name }) : null,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        doctorApproved: user.doctorApproved,
        driverApproved: user.driverDetails?.approved || false
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user (Patient, Doctor, Admin, Driver)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role === 'doctor' && !user.doctorApproved) {
      return res.status(403).json({ message: 'Your doctor account is pending Admin approval. Please wait or contact support.' });
    }

    if (user.role === 'driver' && !user.driverDetails?.approved) {
      return res.status(403).json({ message: 'Your driver account is pending Admin approval. Please wait or contact support.' });
    }

    await logEvent('LOGIN', user._id, user.name, user.role, 'User logged in successfully');

    res.json({
      token: generateToken({ id: user._id, role: user.role, name: user.name }),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        doctorApproved: user.doctorApproved,
        patientDetails: user.patientDetails,
        doctorDetails: user.doctorDetails,
        driverDetails: user.driverDetails
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Parent login using patient generated credentials
// @route   POST /api/auth/parent-login
// @access  Public
const loginParent = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const allUsers = await User.find({ role: 'patient' });
    let patient = null;

    for (let u of allUsers) {
      if (u.patientDetails?.parentAccess?.username === username) {
        patient = u;
        break;
      }
    }

    if (!patient) {
      return res.status(401).json({ message: 'Invalid parent credentials' });
    }

    const parentAccess = patient.patientDetails.parentAccess;
    const isMatch = await bcrypt.compare(password, parentAccess.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid parent credentials' });
    }

    await logEvent(
      'PARENT_LOGIN',
      patient._id,
      `Parent of ${patient.name}`,
      'parent',
      `Parent logged in to monitor Patient: ${patient.name}`
    );

    res.json({
      token: generateToken({
        id: patient._id,
        role: 'parent',
        name: `Parent of ${patient.name}`,
        permissions: parentAccess.permissions
      }),
      user: {
        id: patient._id,
        name: `Parent of ${patient.name}`,
        role: 'parent',
        patientName: patient.name,
        permissions: parentAccess.permissions
      }
    });

  } catch (error) {
    console.error('Parent login error:', error);
    res.status(500).json({ message: 'Server error during parent login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    if (userObj.patientDetails?.parentAccess) {
      delete userObj.patientDetails.parentAccess.passwordHash;
    }
    // Strip sensitive base64 docs from getMe to save bandwidth (return flag instead)
    if (userObj.doctorDetails) {
      userObj.doctorDetails.hasLicenseDocument = !!userObj.doctorDetails.licenseDocument;
      userObj.doctorDetails.hasEducationQualification = !!userObj.doctorDetails.educationQualification;
      userObj.doctorDetails.hasOtherDocuments = !!userObj.doctorDetails.otherDocuments;
      // Keep base64 for profile display only when explicitly needed
    }

    res.json(userObj);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginParent,
  getMe
};
