const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Medication = require('../models/Medication');

// @route   POST /api/prescriptions
// @desc    Create a new prescription
// @access  Private (Doctors only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  const { patientId, medications, diagnosis, symptoms, notes, digitalSignature } = req.body;

  try {
    const prescription = new Prescription({
      patient: patientId,
      doctor: req.user.id,
      medications,
      diagnosis,
      symptoms,
      notes,
      digitalSignature,
    });

    await prescription.save();

    // Add prescribed medications to patient's cart
    const patient = await Patient.findById(patientId);
    if (patient) {
      for (const med of medications) {
        const medicationDetails = await Medication.findById(med.medication);
        if (medicationDetails) {
          patient.cart.push({
            medicationId: medicationDetails.id,
            name: medicationDetails.name,
            dosage: med.dosage,
            quantity: med.quantity,
            price: medicationDetails.price,
          });
        }
      }
      await patient.save();
    }

    res.json(prescription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/prescriptions/patient/:patientId
// @desc    Get all prescriptions for a patient
// @access  Private
router.get('/patient/:patientId', auth, async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.params.patientId }).populate('doctor', 'name specialty');
        res.json(prescriptions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
