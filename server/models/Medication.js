const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['antibiotic', 'general'],
    required: true,
  },
  dosage: String,
  price: Number,
  stock: Number,
  manufacturer: String,
  expiryDate: Date,
  requiresPrescription: {
    type: Boolean,
    default: true,
  },
  sideEffects: [String],
});

module.exports = mongoose.model('Medication', MedicationSchema);
