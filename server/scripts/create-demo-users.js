const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const Pharmacist = require('../models/Pharmacist');
const Patient = require('../models/Patient');
const Reports = require('../models/Reports');

require('dotenv').config();

const createDemoUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    
    // First, remove any existing demo users
    await User.deleteMany({ email: { $in: ['doctor@hospital.com', 'admin@hospital.com', 'pharmacist@hospital.com', 'patient@hospital.com', 'reports@hospital.com'] } });
    await Doctor.deleteMany({ email: { $in: ['doctor@hospital.com'] } });
    await Admin.deleteMany({ email: { $in: ['admin@hospital.com'] } });
    await Pharmacist.deleteMany({ email: { $in: ['pharmacist@hospital.com'] } });
    await Patient.deleteMany({ email: { $in: ['patient@hospital.com'] } });
    console.log('Cleaned up existing demo accounts');

    // Create demo users
    const demoUsers = [
      {
        email: 'doctor@hospital.com',
        password: 'doctor123',
        role: 'doctor',
        profile: { 
          name: 'Dr. Sarah Johnson',
          specialty: 'General Medicine',
          specialization: 'General Medicine',
          licenseNumber: 'MED-2024-001',
          experience: '8 years',
          address: '123 Medical Center, Healthcare District',
          phone: '+1-555-0101'
        }
      },
      {
        email: 'admin@hospital.com',
        password: 'admin123',
        role: 'admin',
        profile: { 
          name: 'Admin Manager',
          department: 'Hospital Administration'
        }
      },
      {
        email: 'pharmacist@hospital.com',
        password: 'pharmacy123',
        role: 'pharmacist',
        profile: { 
          name: 'John Smith',
          licenseNumber: 'PHARM-2024-001'
        }
      },
      {
        email: 'patient@hospital.com',
        password: 'patient123',
        role: 'patient',
        profile: { 
          name: 'Jane Doe',
          dateOfBirth: new Date('1990-01-01'),
          gender: 'female'
        }
      },
      {
        email: 'reports@hospital.com',
        password: 'reports123',
        role: 'reports',
        profile: { 
          name: 'Lab Assistant',
          department: 'Laboratory',
          position: 'Lab Technician'
        }
      }
    ];

    for (const demoUser of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: demoUser.email });
      if (existingUser) {
        console.log(`User ${demoUser.email} already exists, skipping...`);
        continue;
      }

      // Create user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(demoUser.password, salt);

      const user = new User({
        email: demoUser.email,
        password: hashedPassword,
        role: demoUser.role,
        status: 'active'
      });

      await user.save();

      // Create profile based on role
      let Profile;
      switch (demoUser.role) {
        case 'doctor':
          Profile = Doctor;
          break;
        case 'admin':
          Profile = Admin;
          break;
        case 'pharmacist':
          Profile = Pharmacist;
          break;
        case 'patient':
          Profile = Patient;
          break;
        case 'reports':
          Profile = Reports;
          break;
      }

      const profile = new Profile({
        user: user._id,
        userId: user._id,
        email: user.email,
        ...demoUser.profile
      });

      await profile.save();
      console.log(`Created demo ${demoUser.role}: ${demoUser.email}`);
    }

    console.log('Demo users created successfully');
  } catch (error) {
    console.error('Error creating demo users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createDemoUsers();
