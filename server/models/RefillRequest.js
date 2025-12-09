const mongoose = require('mongoose');

const RefillRequestSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
    required: true
  },
  tracking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrescriptionTracking'
  },
  medication: {
    name: String,
    dosage: String,
    quantity: Number
  },
  requestType: {
    type: String,
    enum: ['refill', 'early_refill', 'emergency'],
    default: 'refill'
  },
  reason: String,
  urgency: {
    type: String,
    enum: ['routine', 'urgent', 'emergency'],
    default: 'routine'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'dispensed', 'cancelled'],
    default: 'pending'
  },
  requestedDate: {
    type: Date,
    default: Date.now
  },
  expectedPickupDate: Date,
  doctorApproval: {
    approved: Boolean,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    approvedAt: Date,
    notes: String
  },
  pharmacyProcessing: {
    pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacist'
    },
    preparedAt: Date,
    dispensedAt: Date,
    notes: String
  },
  insuranceVerification: {
    verified: Boolean,
    copayAmount: Number,
    coveragePercentage: Number,
    notes: String
  },
  autoRefill: {
    enabled: Boolean,
    frequency: Number // days
  },
  timeline: [{
    status: String,
    timestamp: Date,
    updatedBy: String,
    notes: String
  }],
  notifications: [{
    type: String,
    sentAt: Date,
    method: String,
    delivered: Boolean
  }]
});

// Auto-populate certain fields
RefillRequestSchema.pre(/^find/, function(next) {
  this.populate('patient', 'name email phone')
      .populate('prescription')
      .populate('doctorApproval.approvedBy', 'name specialty')
      .populate('pharmacyProcessing.pharmacist', 'name');
  next();
});

module.exports = mongoose.model('RefillRequest', RefillRequestSchema);
