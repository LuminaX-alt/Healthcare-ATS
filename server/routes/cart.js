const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');

// @route   GET /api/cart
// @desc    Get patient's cart
// @access  Private (Patients only)
router.get('/', auth, async (req, res) => {
    if (req.user.role !== 'patient') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        const patient = await Patient.findOne({ user: req.user.id });
        if (!patient) {
            return res.status(404).json({ msg: 'Patient profile not found' });
        }
        res.json(patient.cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/cart/remove
// @desc    Remove item from cart
// @access  Private (Patients only)
router.post('/remove', auth, async (req, res) => {
    if (req.user.role !== 'patient') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { medicationId } = req.body;

    try {
        const patient = await Patient.findOne({ user: req.user.id });
        if (!patient) {
            return res.status(404).json({ msg: 'Patient profile not found' });
        }

        patient.cart = patient.cart.filter(item => item.medicationId.toString() !== medicationId);
        await patient.save();

        res.json(patient.cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
