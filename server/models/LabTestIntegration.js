const mongoose = require('mongoose');

const LabTestIntegrationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  tracking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrescriptionTracking'
  },
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  testType: {
    type: String,
    required: true
  },
  testCategory: {
    type: String,
    enum: ['blood', 'urine', 'imaging', 'biopsy', 'genetic', 'cardiac', 'respiratory', 'other']
  },
  purpose: {
    type: String,
    enum: ['diagnosis', 'monitoring', 'pre_treatment', 'post_treatment', 'routine_checkup']
  },
  relatedMedication: {
    name: String,
    reason: String // e.g., "Monitor kidney function while on medication"
  },
  status: {
    type: String,
    enum: ['ordered', 'scheduled', 'sample_collected', 'in_progress', 'completed', 'cancelled'],
    default: 'ordered'
  },
  priority: {
    type: String,
    enum: ['routine', 'urgent', 'stat'],
    default: 'routine'
  },
  scheduledDate: Date,
  collectionDate: Date,
  completionDate: Date,
  results: {
    available: {
      type: Boolean,
      default: false
    },
    values: [{
      parameter: String,
      value: String,
      unit: String,
      referenceRange: String,
      status: {
        type: String,
        enum: ['normal', 'abnormal_low', 'abnormal_high', 'critical']
      },
      flags: [String]
    }],
    summary: String,
    interpretation: String,
    attachments: [{
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    }]
  },
  criticalValues: [{
    parameter: String,
    value: String,
    severity: String,
    notifiedAt: Date,
    acknowledgedBy: String
  }],
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpNotes: String,
  nextTestDate: Date,
  notifications: [{
    recipient: String,
    type: String,
    sentAt: Date,
    acknowledged: Boolean
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to check if results are critical
LabTestIntegrationSchema.methods.hasCriticalResults = function() {
  return this.results.values.some(v => v.status === 'critical');
};

// Method to determine if follow-up is needed based on results
LabTestIntegrationSchema.methods.assessFollowUpNeed = function() {
  const abnormalCount = this.results.values.filter(v => 
    v.status === 'abnormal_low' || v.status === 'abnormal_high' || v.status === 'critical'
  ).length;
  
  return abnormalCount > 0;
};

module.exports = mongoose.model('LabTestIntegration', LabTestIntegrationSchema);
