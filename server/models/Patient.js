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
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  dateOfBirth: Date,
  age: Number,
  gender: String,
  bloodType: String,
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
    oxygenSaturation: Number,
    bloodSugar: Number,
    bmi: Number,
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
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String,
  },
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    expiryDate: Date,
  },
  chronicConditions: [String],
  medications: [
    {
      name: String,
      dosage: String,
      frequency: String,
      startDate: Date,
      endDate: Date,
      prescribedBy: String,
    }
  ],
  vaccinations: [
    {
      name: String,
      date: Date,
      nextDue: Date,
    }
  ],
  labResults: [
    {
      testName: String,
      date: Date,
      result: String,
      normalRange: String,
      status: String,
    }
  ],
  lastVisit: Date,
  nextAppointment: Date,
  riskFactors: [String],
  lifestyleInfo: {
    smoking: Boolean,
    alcohol: Boolean,
    exercise: String,
    diet: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

PatientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.vitals && this.vitals.height && this.vitals.weight) {
    const heightInMeters = this.vitals.height / 100;
    this.vitals.bmi = (this.vitals.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  next();
});

module.exports = mongoose.model('Patient', PatientSchema);
