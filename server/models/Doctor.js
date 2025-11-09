const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  department: {
    type: String,
  },
  designation: {
    type: String,
    enum: [
      'Intern',
      'Junior Resident',
      'Senior Resident',
      'Registrar',
      'Assistant Professor',
      'Associate Professor',
      'Professor',
      'Consultant',
      'Visiting Doctor',
      'Unit Head',
      'Medical Superintendent',
      'Chief Medical Officer',
      'Medical Director',
      'Clinical Fellow',
      'Research Fellow',
      'Honorary Consultant',
      'Specialist',
      'Senior Specialist',
      'Chief Specialist',
      'Other'
    ],
  },
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
    },
  ],
  prescriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
    },
  ],
  antibioticUsageStats: {
    type: Object,
  },
  performanceMetrics: {
    type: Object,
  },
  lastLogin: {
    type: Date,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  onlineStatus: {
    type: String,
    enum: ['online', 'offline', 'busy'],
    default: 'offline',
  },
  lastStatusUpdate: {
    type: Date,
    default: Date.now,
  },
  experience: {
    type: String,
  },
  consultationFee: {
    type: Number,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  availability: {
    days: [String],
    hours: String,
  },
});

module.exports = mongoose.model('Doctor', DoctorSchema);
