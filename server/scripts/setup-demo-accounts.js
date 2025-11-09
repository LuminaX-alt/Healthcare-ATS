const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const Pharmacist = require('../models/Pharmacist');
const Patient = require('../models/Patient');

require('dotenv').config();

const demoUsers = [
  {
    email: 'doctor@demo.com',
    password: 'doctor123',
    role: 'doctor',
    name: 'Demo Doctor',
    specialty: 'General Medicine',
    licenseNumber: 'DEMO-DOC-001'
  },
  {
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'admin',
    name: 'Demo Admin'
  },
  {
    email: 'pharmacist@demo.com',
    password: 'pharma123',
    role: 'pharmacist',
    name: 'Demo Pharmacist',
    licenseNumber: 'DEMO-PHARM-001'
  },
  {
    email: 'patient@demo.com',
    password: 'patient123',
    role: 'patient',
    name: 'Demo Patient'
  }
];

async function createDemoUser(userData) {
  const user = new User({
    email: userData.email,
    password: userData.password, // Store plain text for demo accounts
    role: userData.role,
    status: 'active',
    isVerified: true
  });

  await user.save();

  let profile;
  switch (userData.role) {
    case 'doctor':
      profile = new Doctor({
        user: user._id,
        email: userData.email,
        name: userData.name,
        specialty: userData.specialty,
        licenseNumber: userData.licenseNumber,
        status: 'active'
      });
      break;
    case 'admin':
      profile = new Admin({
        user: user._id,
        email: userData.email,
        name: userData.name
      });
      break;
    case 'pharmacist':
      profile = new Pharmacist({
        user: user._id,
        email: userData.email,
        name: userData.name,
        licenseNumber: userData.licenseNumber
      });
      break;
    case 'patient':
      profile = new Patient({
        user: user._id,
        email: userData.email,
        name: userData.name
      });
      break;
  }

  await profile.save();
  console.log(`Created demo ${userData.role}: ${userData.email}`);
}

async function setupDemoAccounts() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Clean up existing demo accounts
    await User.deleteMany({ email: /.*@demo\.com$/ });
    await Doctor.deleteMany({ email: /.*@demo\.com$/ });
    await Admin.deleteMany({ email: /.*@demo\.com$/ });
    await Pharmacist.deleteMany({ email: /.*@demo\.com$/ });
    await Patient.deleteMany({ email: /.*@demo\.com$/ });
    console.log('Cleaned up existing demo accounts');

    // Create new demo accounts
    for (const userData of demoUsers) {
      await createDemoUser(userData);
    }

    console.log('Demo accounts created successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

setupDemoAccounts();
