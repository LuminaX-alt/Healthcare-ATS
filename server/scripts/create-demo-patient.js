// Run this script with: node server/scripts/create-demo-patient.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Patient = require('../models/Patient');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare-prototype';

async function createDemoPatient() {
  await mongoose.connect(MONGO_URI);
  const email = '12devsharma10c@gmail.com';
  const phone = '9123144609';
  let user = await User.findOne({ email, role: 'patient' });
  if (!user) {
    user = new User({
      email,
      role: 'patient',
      status: 'active',
      password: 'default',
      phoneNumber: phone
    });
    await user.save();
    console.log('Demo patient user created:', user._id);
  } else {
    console.log('Demo patient user already exists:', user._id);
  }
  let patient = await Patient.findOne({ user: user._id });
  if (!patient) {
    patient = new Patient({
      user: user._id,
      name: 'Dev Sharma',
      email,
      phone,
      dateOfBirth: new Date('1990-01-01'),
      age: 34,
      gender: 'male',
      bloodType: 'O+'
    });
    await patient.save();
    console.log('Demo patient profile created:', patient._id);
  } else {
    console.log('Demo patient profile already exists:', patient._id);
  }
  mongoose.disconnect();
}
createDemoPatient();
