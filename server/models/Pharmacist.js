const mongoose = require('mongoose');

const PharmacistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    pharmacyId: String,
    licenseNumber: String,
    lastLogin: Date,
});

module.exports = mongoose.model('Pharmacist', PharmacistSchema);
