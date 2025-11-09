const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  medications: [
    {
      medication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medication',
      },
      dosage: String,
      frequency: String,
      duration: String,
      quantity: Number,
    },
  ],
  diagnosis: String,
  symptoms: String,
  notes: String,
  digitalSignature: String, // Base64 encoded image
  status: {
    type: String,
    enum: ['active', 'dispensed', 'cancelled'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
