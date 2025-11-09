const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Medication = require('../models/Medication');

// @route   GET /api/medications
// @desc    Get all available medications
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const medications = await Medication.find();
        res.json(medications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// This is a helper route to seed the database with some initial medications.
// In a real application, this would be handled by an admin interface.
router.post('/seed', async (req, res) => {
    try {
        await Medication.deleteMany(); // Clear existing medications
        const medicationsToSeed = [
            { name: 'Amoxicillin', type: 'antibiotic', dosage: '500mg', price: 15, stock: 100 },
            { name: 'Ibuprofen', type: 'general', dosage: '200mg', price: 8, stock: 200 },
            { name: 'Lisinopril', type: 'general', dosage: '10mg', price: 12, stock: 150 },
            { name: 'Metformin', type: 'general', dosage: '500mg', price: 10, stock: 180 },
            { name: 'Azithromycin', type: 'antibiotic', dosage: '250mg', price: 25, stock: 80 },
        ];
        const insertedMedications = await Medication.insertMany(medicationsToSeed);
        res.json({ msg: 'Medication database seeded', data: insertedMedications });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
