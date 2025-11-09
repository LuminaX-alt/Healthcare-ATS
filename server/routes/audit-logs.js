const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');

// @route   GET api/audit-logs/:doctorId
// @desc    Get all audit logs for a doctor
// @access  Private
router.get('/:doctorId', async (req, res) => {
  try {
    const auditLogs = await AuditLog.find({ doctorId: req.params.doctorId }).sort({ eventTime: -1 });
    res.json(auditLogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/audit-logs
// @desc    Get all audit logs (for dashboard display)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const auditLogs = await AuditLog.find().sort({ eventTime: -1 }).limit(100);
    res.json(auditLogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/audit-logs
// @desc    Create an audit log
// @access  Private
router.post('/', async (req, res) => {
  const { doctorId, doctorName, action, entity, entityId, details, entryHash, patientName } = req.body;

  try {
    const newLog = new AuditLog({
      doctorId,
      doctorName,
      action,
      entity,
      entityId,
      details,
      entryHash,
      patientName,
    });

    const log = await newLog.save();
    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
