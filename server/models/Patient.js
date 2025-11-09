const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: Number,
  gender: String,
  address: String,
  medicalHistory: [String],
  allergies: [String],
  profileComplete: {
    type: Boolean,
    default: false,
  },
  cart: [
    {
      medicationId: String,
      name: String,
      dosage: String,
      quantity: Number,
      price: Number,
    },
  ],
  vitals: {
    height: Number,
    weight: Number,
    bloodPressure: String,
    temperature: Number,
    heartRate: Number,
    respiratoryRate: Number,
    lastUpdated: Date,
  },
  timeline: [
    {
      date: Date,
      type: String,
      title: String,
      description: String,
      icon: String,
    },
  ],
});

module.exports = mongoose.model('Patient', PatientSchema);
