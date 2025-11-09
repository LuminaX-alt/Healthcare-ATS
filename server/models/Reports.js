const mongoose = require('mongoose');

const ReportsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    default: 'Laboratory',
  },
  position: {
    type: String,
    enum: ['Lab Technician', 'Lab Assistant', 'Radiologist', 'Pathologist'],
    default: 'Lab Technician',
  },
  phone: {
    type: String,
  },
  licenseNumber: {
    type: String,
  },
  specialization: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Reports', ReportsSchema);
