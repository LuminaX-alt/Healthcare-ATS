const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // We will create this middleware next
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Pharmacist = require('../models/Pharmacist');
const Admin = require('../models/Admin');

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    let profile;
    const user = req.user;

    if (user.role === 'patient') {
      profile = await Patient.findOne({ user: user.id });
    } else if (user.role === 'doctor') {
      profile = await Doctor.findOne({ user: user.id });
    } else if (user.role === 'pharmacist') {
      profile = await Pharmacist.findOne({ user: user.id });
    } else if (user.role === 'admin') {
      profile = await Admin.findOne({ user: user.id });
    }

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    res.json({ user, profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/users
// @desc    Get all non-patient users (for admin)
// @access  Private (Admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  try {
    const users = await User.find({ role: { $ne: 'patient' } }).select('-password');
    
    const doctorIds = users.filter(u => u.role === 'doctor').map(u => u._id);
    const pharmacistIds = users.filter(u => u.role === 'pharmacist').map(u => u._id);
    const adminIds = users.filter(u => u.role === 'admin').map(u => u._id);

    const doctors = await Doctor.find({ user: { $in: doctorIds } });
    const pharmacists = await Pharmacist.find({ user: { $in: pharmacistIds } });
    const admins = await Admin.find({ user: { $in: adminIds } });

    const profiles = [...doctors, ...pharmacists, ...admins];

    res.json({ users, profiles });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/users/patients/:doctorId
// @desc    Get all patients for a specific doctor
// @access  Private (Doctor only)
router.get('/patients/:doctorId', auth, async (req, res) => {
  if (req.user.role !== 'doctor' || req.user.id !== req.params.doctorId) {
    // For security, only the logged-in doctor can access their patients.
    // An admin could have a separate, more privileged route if needed.
    return res.status(401).json({ msg: 'Not authorized' });
  }

  try {
    // This logic assumes that patients are not directly linked to doctors in the DB.
    // It fetches all patients. A real-world app would have a linking table/field.
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/users/:id
// @desc    Update a user's details
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  const { name, email, role, status, department, designation } = req.body;
  const { id } = req.params;

  try {
    // Find and validate user
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Validate status if it's being updated
    if (status && !['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    // Update user
    user = await User.findByIdAndUpdate(
      id,
      { 
        $set: { 
          status: status || user.status,
          email: email || user.email
        } 
      },
      { new: true }
    );

    // Find and update the corresponding profile
    let profile;
    if (user.role === 'doctor') {
      const updateFields = { 
        name: name || profile?.name, 
        email: email || profile?.email 
      };
      
      // FIX: Add department and designation, and keep specialty in sync
      if (department !== undefined) {
        updateFields.department = department;
        // Keep specialty in sync with department for consistency
        updateFields.specialty = department;
        console.log(`✅ Updated doctor department: ${department}`);
      }
      if (designation !== undefined) {
        updateFields.designation = designation;
        console.log(`✅ Updated doctor designation: ${designation}`);
      }
      
      profile = await Doctor.findOneAndUpdate(
        { user: id },
        { $set: updateFields },
        { new: true }
      );
      
      console.log(`✅ Doctor profile updated:`, profile?.name);
    } else if (user.role === 'pharmacist') {
      profile = await Pharmacist.findOneAndUpdate(
        { user: id },
        { $set: { name: name || profile?.name, email: email || profile?.email } },
        { new: true }
      );
    } else if (user.role === 'admin') {
      profile = await Admin.findOneAndUpdate(
        { user: id },
        { $set: { name: name || profile?.name, email: email || profile?.email } },
        { new: true }
      );
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/users
// @desc    Create a new user
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  const { name, email, password, role, licenseNumber, specialty, department, designation, pharmacyName } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role
    });

    await newUser.save();

    let profile;
    if (role === 'doctor') {
      profile = new Doctor({ 
        user: newUser._id, 
        name, 
        email, 
        licenseNumber, 
        specialty, 
        department: department || '',
        designation: designation || 'Other'
      });
    } else if (role === 'pharmacist') {
      profile = new Pharmacist({ user: newUser._id, name, email, licenseNumber, pharmacyName });
    }
    // Add other roles as needed

    if (profile) {
      await profile.save();
    }

    res.status(201).json({ user: newUser, profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
