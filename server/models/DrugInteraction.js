const mongoose = require('mongoose');

const DrugInteractionSchema = new mongoose.Schema({
  drugA: {
    name: String,
    genericName: String,
    required: true
  },
  drugB: {
    name: String,
    genericName: String,
    required: true
  },
  interactionType: {
    type: String,
    enum: ['major', 'moderate', 'minor', 'contraindicated'],
    required: true
  },
  severity: {
    type: String,
    enum: ['severe', 'moderate', 'mild'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  effects: [String],
  mechanism: String,
  clinicalImplications: String,
  management: {
    type: String,
    required: true
  },
  alternatives: [String],
  references: [String],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Compound index for faster lookups
DrugInteractionSchema.index({ 'drugA.name': 1, 'drugB.name': 1 });
DrugInteractionSchema.index({ 'drugA.genericName': 1, 'drugB.genericName': 1 });

module.exports = mongoose.model('DrugInteraction', DrugInteractionSchema);
