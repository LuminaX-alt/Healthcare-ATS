const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuditLogSchema = new Schema({
  eventTime: { type: Date, default: Date.now },
  doctorId: { type: String, required: false },
  doctorName: { type: String, required: true },
  patientName: { type: String, required: true },
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: { type: String, required: true },
  details: { type: String, required: true },
  entryHash: { type: String, required: true },
  route: { type: String, enum: ['Oral', 'IV', 'IM', 'Topical', 'Subcutaneous', 'Inhalation', 'N/A'], default: 'N/A' },
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
