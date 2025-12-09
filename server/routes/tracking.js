const express = require('express');
const router = express.Router();
const PrescriptionTracking = require('../models/PrescriptionTracking');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');

// @route   GET /api/tracking/prescription/:prescriptionId
// @desc    Get tracking details for a prescription
router.get('/prescription/:prescriptionId', auth, async (req, res) => {
  try {
    const tracking = await PrescriptionTracking.findOne({ prescription: req.params.prescriptionId })
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialty')
      .populate('dispensingInfo.pharmacist', 'name');
    
    if (!tracking) {
      return res.status(404).json({ msg: 'Tracking not found' });
    }
    
    res.json(tracking);
  } catch (err) {
    console.error('Error fetching tracking:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/tracking/patient/:patientId
// @desc    Get all tracking records for a patient
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const trackingRecords = await PrescriptionTracking.find({ patient: req.params.patientId })
      .populate('prescription')
      .populate('doctor', 'name specialty')
      .sort({ createdAt: -1 });
    
    res.json(trackingRecords);
  } catch (err) {
    console.error('Error fetching patient tracking:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/tracking/doctor/:doctorId
// @desc    Get all tracking records for a doctor's prescriptions
router.get('/doctor/:doctorId', auth, async (req, res) => {
  try {
    const trackingRecords = await PrescriptionTracking.find({ doctor: req.params.doctorId })
      .populate('patient', 'name email')
      .populate('prescription')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(trackingRecords);
  } catch (err) {
    console.error('Error fetching doctor tracking:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/tracking/create
// @desc    Create new prescription tracking
router.post('/create', auth, async (req, res) => {
  try {
    const { prescriptionId, patientId, doctorId, medication } = req.body;
    
    // Check if tracking already exists
    const existingTracking = await PrescriptionTracking.findOne({ prescription: prescriptionId });
    if (existingTracking) {
      return res.status(400).json({ msg: 'Tracking already exists for this prescription' });
    }
    
    const tracking = new PrescriptionTracking({
      prescription: prescriptionId,
      patient: patientId,
      doctor: doctorId,
      medication,
      timeline: [{
        date: new Date(),
        status: 'prescribed',
        event: 'prescribed',
        notes: 'Prescription created',
        reportedBy: 'doctor'
      }]
    });
    
    await tracking.save();
    
    // Emit real-time update
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(`patient_${patientId}`).emit('trackingCreated', { tracking });
        io.to(`doctor_${doctorId}`).emit('trackingCreated', { tracking });
      }
    } catch (emitErr) {
      console.error('Socket emit error:', emitErr);
    }
    
    res.json({ success: true, tracking });
  } catch (err) {
    console.error('Error creating tracking:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/tracking/:id/dose
// @desc    Record a dose taken
router.put('/:id/dose', auth, async (req, res) => {
  try {
    const { taken, notes } = req.body;
    
    const tracking = await PrescriptionTracking.findById(req.params.id);
    if (!tracking) {
      return res.status(404).json({ msg: 'Tracking not found' });
    }
    
    // Update adherence
    if (taken) {
      tracking.adherence.takenDoses = (tracking.adherence.takenDoses || 0) + 1;
    } else {
      tracking.adherence.missedDoses = (tracking.adherence.missedDoses || 0) + 1;
      
      // Create alert for missed dose
      tracking.alerts.push({
        type: 'missed_dose',
        severity: 'medium',
        message: 'Patient missed a scheduled dose',
        createdAt: new Date(),
        resolved: false
      });
    }
    
    tracking.adherence.totalDoses = (tracking.adherence.totalDoses || 0) + 1;
    
    // Add to timeline
    tracking.timeline.push({
      date: new Date(),
      status: tracking.status,
      event: taken ? 'dose_taken' : 'dose_missed',
      notes: notes || (taken ? 'Dose taken as scheduled' : 'Dose missed'),
      reportedBy: 'patient'
    });
    
    await tracking.save();
    
    // Emit real-time update
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(`patient_${tracking.patient}`).emit('trackingUpdated', { tracking });
        io.to(`doctor_${tracking.doctor}`).emit('trackingUpdated', { tracking });
      }
    } catch (emitErr) {
      console.error('Socket emit error:', emitErr);
    }
    
    res.json({ success: true, tracking });
  } catch (err) {
    console.error('Error recording dose:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/tracking/:id/side-effect
// @desc    Report a side effect
router.post('/:id/side-effect', auth, async (req, res) => {
  try {
    const { severity, description, action } = req.body;
    
    const tracking = await PrescriptionTracking.findById(req.params.id);
    if (!tracking) {
      return res.status(404).json({ msg: 'Tracking not found' });
    }
    
    tracking.sideEffects.push({
      reportedDate: new Date(),
      severity,
      description,
      action: action || 'Reported to doctor'
    });
    
    // Create alert
    const alertSeverity = severity === 'severe' ? 'critical' : severity === 'moderate' ? 'high' : 'medium';
    tracking.alerts.push({
      type: 'side_effect',
      severity: alertSeverity,
      message: `${severity} side effect reported: ${description}`,
      createdAt: new Date(),
      resolved: false
    });
    
    // Add to timeline
    tracking.timeline.push({
      date: new Date(),
      status: tracking.status,
      event: 'side_effect_reported',
      notes: `${severity} side effect: ${description}`,
      reportedBy: 'patient'
    });
    
    await tracking.save();
    
    // Emit real-time alert to doctor
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(`doctor_${tracking.doctor}`).emit('sideEffectAlert', { 
          tracking,
          sideEffect: tracking.sideEffects[tracking.sideEffects.length - 1]
        });
      }
    } catch (emitErr) {
      console.error('Socket emit error:', emitErr);
    }
    
    res.json({ success: true, tracking });
  } catch (err) {
    console.error('Error reporting side effect:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/tracking/:id/dispense
// @desc    Mark prescription as dispensed
router.put('/:id/dispense', auth, async (req, res) => {
  try {
    const { pharmacistId, quantity, refills } = req.body;
    
    const tracking = await PrescriptionTracking.findById(req.params.id);
    if (!tracking) {
      return res.status(404).json({ msg: 'Tracking not found' });
    }
    
    tracking.status = 'dispensed';
    tracking.dispensingInfo = {
      pharmacist: pharmacistId,
      dispensedDate: new Date(),
      quantity,
      refillsRemaining: refills || 0,
      nextRefillDate: refills > 0 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
    };
    
    tracking.timeline.push({
      date: new Date(),
      status: 'dispensed',
      event: 'dispensed',
      notes: `Dispensed ${quantity} units with ${refills} refills`,
      reportedBy: 'pharmacist'
    });
    
    await tracking.save();
    
    res.json({ success: true, tracking });
  } catch (err) {
    console.error('Error dispensing prescription:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/tracking/:id/status
// @desc    Update prescription status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const tracking = await PrescriptionTracking.findById(req.params.id);
    if (!tracking) {
      return res.status(404).json({ msg: 'Tracking not found' });
    }
    
    tracking.status = status;
    tracking.timeline.push({
      date: new Date(),
      status,
      event: status,
      notes: notes || `Status changed to ${status}`,
      reportedBy: 'doctor'
    });
    
    await tracking.save();
    
    res.json({ success: true, tracking });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/tracking/analytics/adherence
// @desc    Get adherence analytics
router.get('/analytics/adherence', auth, async (req, res) => {
  try {
    const analytics = await PrescriptionTracking.aggregate([
      {
        $group: {
          _id: null,
          avgAdherence: { $avg: '$adherence.adherenceRate' },
          totalTracked: { $sum: 1 },
          highAdherence: {
            $sum: {
              $cond: [{ $gte: ['$adherence.adherenceRate', 80] }, 1, 0]
            }
          },
          lowAdherence: {
            $sum: {
              $cond: [{ $lt: ['$adherence.adherenceRate', 50] }, 1, 0]
            }
          }
        }
      }
    ]);
    
    res.json(analytics[0] || {});
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/tracking/alerts/active
// @desc    Get all active alerts
router.get('/alerts/active', auth, async (req, res) => {
  try {
    const trackingRecords = await PrescriptionTracking.find({
      'alerts.resolved': false
    })
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialty')
      .select('medication alerts patient doctor');
    
    const activeAlerts = [];
    trackingRecords.forEach(record => {
      record.alerts
        .filter(alert => !alert.resolved)
        .forEach(alert => {
          activeAlerts.push({
            ...alert.toObject(),
            medication: record.medication,
            patient: record.patient,
            doctor: record.doctor,
            trackingId: record._id
          });
        });
    });
    
    res.json(activeAlerts);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/tracking/alert/:alertId/resolve
// @desc    Resolve an alert
router.put('/alert/:trackingId/:alertIndex/resolve', auth, async (req, res) => {
  try {
    const { trackingId, alertIndex } = req.params;
    const { resolvedBy } = req.body;
    
    const tracking = await PrescriptionTracking.findById(trackingId);
    if (!tracking) {
      return res.status(404).json({ msg: 'Tracking not found' });
    }
    
    if (tracking.alerts[alertIndex]) {
      tracking.alerts[alertIndex].resolved = true;
      tracking.alerts[alertIndex].resolvedAt = new Date();
      tracking.alerts[alertIndex].resolvedBy = resolvedBy;
      
      await tracking.save();
      res.json({ success: true, tracking });
    } else {
      res.status(404).json({ msg: 'Alert not found' });
    }
  } catch (err) {
    console.error('Error resolving alert:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
