const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { auth, adminAuth } = require('../middleware/auth');

// Get all doctors (for patients to see)
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .select('-prescriptions -antibioticUsageStats -performanceMetrics')
      .lean();
    
    // Ensure department exists (fallback to specialty) - FIX for dropdown issue
    const doctorsWithDept = doctors.map(doc => ({
      ...doc,
      department: doc.department || doc.specialty || 'Other',
      // Ensure all required fields are present
      name: doc.name || 'Unknown Doctor',
      email: doc.email || `${(doc.name || 'doctor').toLowerCase().replace(/\s+/g, '')}@hospital.com`
    }));
    
    console.log(`✅ Returning ${doctorsWithDept.length} doctors with departments`);
    res.json(doctorsWithDept);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get online doctors only
router.get('/online', async (req, res) => {
  try {
    const doctors = await Doctor.find({ 
      $or: [
        { isOnline: true },
        { onlineStatus: 'online' }
      ]
    })
      .select('-prescriptions -antibioticUsageStats -performanceMetrics')
      .lean();
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching online doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('-prescriptions -antibioticUsageStats -performanceMetrics')
      .lean();
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor status (Admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { onlineStatus, isOnline } = req.body;
    
    const updateData = {
      lastStatusUpdate: new Date(),
    };
    
    // Prefer onlineStatus if provided
    if (onlineStatus !== undefined) {
      updateData.onlineStatus = onlineStatus;
      updateData.isOnline = onlineStatus === 'online';
    } else if (isOnline !== undefined) {
      // Only use isOnline if onlineStatus is not provided
      updateData.isOnline = isOnline;
      updateData.onlineStatus = isOnline ? 'online' : 'offline';
    }
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-prescriptions -antibioticUsageStats -performanceMetrics');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Error updating doctor status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor profile (Admin only)
router.put('/:id/profile', adminAuth, async (req, res) => {
  try {
    const { experience, consultationFee, rating, availability } = req.body;
    
    const updateData = {};
    if (experience !== undefined) updateData.experience = experience;
    if (consultationFee !== undefined) updateData.consultationFee = consultationFee;
    if (rating !== undefined) updateData.rating = rating;
    if (availability !== undefined) updateData.availability = availability;
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-prescriptions -antibioticUsageStats -performanceMetrics');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk update doctor statuses (Admin only)
router.post('/bulk-status', adminAuth, async (req, res) => {
  try {
    const { updates } = req.body; // Array of { doctorId, status }
    
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.doctorId },
        update: {
          onlineStatus: update.status,
          isOnline: update.status === 'online',
          lastStatusUpdate: new Date()
        }
      }
    }));
    
    await Doctor.bulkWrite(bulkOps);
    
    res.json({ message: 'Doctor statuses updated successfully' });
  } catch (error) {
    console.error('Error bulk updating statuses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
