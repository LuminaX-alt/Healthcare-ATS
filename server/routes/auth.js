const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Pharmacist = require('../models/Pharmacist');
const Admin = require('../models/Admin');
const Reports = require('../models/Reports');

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (Simplified for demo)
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    console.log('Login attempt:', { email, role });

    // Find user by email only (role is for verification)
    let user = await User.findOne({ email });
    
    // If user doesn't exist, return error
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Verify role matches
    if (user.role !== role) {
      return res.status(400).json({ msg: 'Invalid role for this account' });
    }

    // Get profile based on role
    let profile;
    switch (role) {
      case 'doctor':
        profile = await Doctor.findOne({ user: user._id });
        if (!profile) {
          return res.status(404).json({ msg: 'Doctor profile not found' });
        }
        break;
      case 'admin':
        profile = await Admin.findOne({ user: user._id });
        if (!profile) {
          return res.status(404).json({ msg: 'Admin profile not found' });
        }
        break;
      case 'pharmacist':
        profile = await Pharmacist.findOne({ user: user._id });
        if (!profile) {
          return res.status(404).json({ msg: 'Pharmacist profile not found' });
        }
        break;
      case 'patient':
        profile = await Patient.findOne({ user: user._id });
        if (!profile) {
          return res.status(404).json({ msg: 'Patient profile not found' });
        }
        break;
      case 'reports':
        profile = await Reports.findOne({ user: user._id });
        if (!profile) {
          return res.status(404).json({ msg: 'Reports profile not found' });
        }
        break;
      default:
        return res.status(400).json({ msg: 'Invalid role' });
    }

    // Create a JWT token with the real user ID
    const payload = {
      user: {
        id: user._id.toString(),
        role: user.role,
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'demo-secret-key',
      { expiresIn: '7d' }
    );

    console.log('Login successful, sending response');

    res.json({
      token,
      user: {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
        status: user.status
      },
      profile: profile
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

// --- Patient Registration ---
// @route   POST /api/auth/register-patient
// @desc    Register a new patient
router.post('/register-patient', async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ msg: 'Name, email, and phone are required.' });
  }
  try {
    let user = await User.findOne({ email, role: 'patient' });
    if (user) {
      return res.status(400).json({ msg: 'Patient already exists.' });
    }
    user = new User({ email, role: 'patient', status: 'inactive', password: 'default', phoneNumber: phone });
    await user.save();
    const patient = new Patient({
      user: user._id,
      name,
      email,
      phone,
      dateOfBirth: new Date('1990-01-01'), // default
      age: 34, // default
      gender: 'male', // default
      bloodType: 'O+' // default
    });
    await patient.save();
    res.status(201).json({ user, patient });
  } catch (err) {
    console.error('Patient registration error:', err);
    res.status(500).json({ msg: 'Server error during patient registration' });
  }
});

// --- General User Registration (Doctor, Pharmacist, Admin) ---
// @route   POST /api/auth/register
// @desc    Register a new user (doctor, pharmacist, admin)
router.post('/register', async (req, res) => {
  const { name, email, password, role, status, licenseNumber, specialty, department, designation, pharmacyName } = req.body;
  
  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: 'Name, email, password, and role are required.' });
  }

  if (!['doctor', 'pharmacist', 'admin'].includes(role)) {
    return res.status(400).json({ msg: 'Invalid role. Use /register-patient for patient registration.' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists with this email.' });
    }

    // Create new user
    user = new User({
      email,
      role,
      status: status || 'active',
      password,
      phoneNumber: '' // Can be updated later
    });
    await user.save();

    // Create role-specific profile
    let profile;
    if (role === 'doctor') {
      if (!licenseNumber || !specialty) {
        return res.status(400).json({ msg: 'License number and specialty are required for doctors.' });
      }
      
      profile = new Doctor({
        user: user._id,
        name,
        email,
        licenseNumber,
        specialty,
        department: department || '',
        designation: designation || 'Other'
      });
      await profile.save();
    } else if (role === 'pharmacist') {
      if (!licenseNumber) {
        return res.status(400).json({ msg: 'License number is required for pharmacists.' });
      }
      
      profile = new Pharmacist({
        user: user._id,
        name,
        email,
        licenseNumber,
        pharmacyName: pharmacyName || `${name}'s Pharmacy`
      });
      await profile.save();
    } else if (role === 'admin') {
      profile = new Admin({
        user: user._id,
        name,
        email
      });
      await profile.save();
    }

    res.status(201).json({ 
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        status: user.status
      },
      profile 
    });
  } catch (err) {
    console.error('User registration error:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// --- OTP Logic (Demo, not production) ---
let otpStore = {};

// @route   POST /api/auth/send-otp
// @desc    Send OTP to patient phone
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ msg: 'Phone number required.' });
  // Debug: log patient search
  const patient = await Patient.findOne({ phone });
  if (!patient) {
    console.error(`No patient found with phone: ${phone}`);
    return res.status(404).json({ msg: 'No patient found with this phone number. Please register first.' });
  }
  // Demo: generate OTP and store in memory
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = otp;
  // In production, send OTP via SMS provider
  console.log(`OTP for ${phone}: ${otp}`);
  res.json({ msg: 'OTP sent successfully.' });
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login patient
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ msg: 'Phone and OTP required.' });
  if (otpStore[phone] !== otp) return res.status(401).json({ msg: 'Invalid OTP.' });
  let patient = await Patient.findOne({ phone });
  if (!patient) return res.status(404).json({ msg: 'Patient not found.' });
  let user = await User.findOne({ _id: patient.user, role: 'patient' });
  if (!user) return res.status(404).json({ msg: 'User not found.' });
  // Create JWT token
  const payload = { user: { id: user._id.toString(), role: user.role } };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'demo-secret-key', { expiresIn: '7d' });
  res.json({ token, user: { id: user._id.toString(), role: user.role, email: user.email, status: user.status }, profile: patient });
});

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret-key');
    
    const user = {
      id: decoded.user.id,
      role: decoded.user.role,
      status: 'active'
    };

    let profile = {
      id: `profile_${Date.now()}`,
      user: user.id,
      name: 'Demo User'
    };

    res.json({ user, profile });
  } catch (err) {
    console.error('Auth verification error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

module.exports = router;
