const mongoose = require('mongoose');

const PrescriptionTrackingSchema = new mongoose.Schema({
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  medication: {
    name: String,
    dosage: String,
    frequency: String,
    duration: String
  },
  status: {
    type: String,
    enum: ['prescribed', 'dispensed', 'in-progress', 'completed', 'stopped', 'missed'],
    default: 'prescribed'
  },
  adherence: {
    totalDoses: Number,
    takenDoses: Number,
    missedDoses: Number,
    adherenceRate: Number // Percentage
  },
  timeline: [
    {
      date: Date,
      status: String,
      event: String, // 'prescribed', 'dispensed', 'dose_taken', 'dose_missed', 'side_effect_reported', 'stopped'
      notes: String,
      reportedBy: {
        type: String,
        enum: ['patient', 'doctor', 'pharmacist', 'system']
      }
    }
  ],
  sideEffects: [
    {
      reportedDate: Date,
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe']
      },
      description: String,
      action: String // What action was taken
    }
  ],
  dispensingInfo: {
    pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacist'
    },
    dispensedDate: Date,
    quantity: Number,
    refillsRemaining: Number,
    nextRefillDate: Date
  },
  alerts: [
    {
      type: {
        type: String,
        enum: ['missed_dose', 'drug_interaction', 'side_effect', 'adherence_low', 'refill_needed', 'duration_exceeded']
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      message: String,
      createdAt: Date,
      resolved: Boolean,
      resolvedAt: Date,
      resolvedBy: String
    }
  ],
  outcome: {
    result: {
      type: String,
      enum: ['cured', 'improved', 'no_change', 'worsened', 'adverse_reaction', 'discontinued']
    },
    notes: String,
    followUpRequired: Boolean,
    followUpDate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

PrescriptionTrackingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate adherence rate
  if (this.adherence && this.adherence.totalDoses > 0) {
    this.adherence.adherenceRate = ((this.adherence.takenDoses / this.adherence.totalDoses) * 100).toFixed(2);
  }
  
  next();
});

module.exports = mongoose.model('PrescriptionTracking', PrescriptionTrackingSchema);
