const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const auth = require('../middleware/auth');

// @route   GET /api/patients/:id
// @desc    Get patient profile with full details
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('user', 'email status')
      .lean();
    
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (err) {
    console.error('Error fetching patient:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/patients/:id
// @desc    Update patient profile
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, age, gender, bloodType, address, allergies, medicalHistory } = req.body;
    
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    
    // Update patient fields
    if (name) patient.name = name;
    if (email) patient.email = email;
    if (phone) patient.phone = phone;
    if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
    if (age) patient.age = age;
    if (gender) patient.gender = gender;
    if (bloodType) patient.bloodType = bloodType;
    if (address) patient.address = address;
    if (allergies) patient.allergies = allergies;
    if (medicalHistory) patient.medicalHistory = medicalHistory;
    
    patient.profileComplete = true;
    
    await patient.save();

    // Emit update to sockets
    try {
      const io = req.app.get('io');
      if (io) io.to(`patient_${req.params.id}`).emit('patientProfileUpdated', { patient });
    } catch (emitErr) {
      console.error('Socket emit error (profile update):', emitErr);
    }
    
    res.json({ success: true, patient });
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/patients/:id/vitals
// @desc    Update patient vitals
router.put('/:id/vitals', auth, async (req, res) => {
  try {
    const { height, weight, bloodPressure, temperature, heartRate, respiratoryRate, oxygenSaturation, bloodSugar } = req.body;
    
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    
    patient.vitals = {
      height: height || patient.vitals?.height,
      weight: weight || patient.vitals?.weight,
      bloodPressure: bloodPressure || patient.vitals?.bloodPressure,
      temperature: temperature || patient.vitals?.temperature,
      heartRate: heartRate || patient.vitals?.heartRate,
      respiratoryRate: respiratoryRate || patient.vitals?.respiratoryRate,
      oxygenSaturation: oxygenSaturation || patient.vitals?.oxygenSaturation,
      bloodSugar: bloodSugar || patient.vitals?.bloodSugar,
      lastUpdated: new Date()
    };
    
    await patient.save();

    // Emit vitals update to patient room
    try {
      const io = req.app.get('io');
      if (io) io.to(`patient_${req.params.id}`).emit('patientVitalsUpdated', { vitals: patient.vitals });
    } catch (emitErr) {
      console.error('Socket emit error (vitals):', emitErr);
    }
    
    res.json({ success: true, vitals: patient.vitals });
  } catch (err) {
    console.error('Error updating vitals:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/patients/:id/appointments
// @desc    Get patient appointments with doctor details
router.get('/:id/appointments', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    
    const appointments = await Appointment.find({ patient: req.params.id })
      .populate('doctor', 'name specialty')
      .sort({ appointmentDate: -1 })
      .lean();
    
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/patients/:id/appointments
// @desc    Book new appointment
router.post('/:id/appointments', auth, async (req, res) => {
  try {
    const { doctorId, appointmentDate, reason, symptoms } = req.body;
    
    const patient = await Patient.findById(req.params.id);
    const doctor = await Doctor.findById(doctorId);
    
    if (!patient || !doctor) {
      return res.status(404).json({ msg: 'Patient or Doctor not found' });
    }
    
    const appointment = new Appointment({
      patient: req.params.id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      reason,
      symptoms,
      status: 'scheduled'
    });
    
    await appointment.save();

    // Emit appointment created event
    try {
      const io = req.app.get('io');
      if (io) io.to(`patient_${req.params.id}`).emit('patientAppointmentCreated', { appointment });
      // Also notify the doctor room if doctorId is present
      if (io) io.to(`doctor_${doctorId}`).emit('doctorNewAppointment', { appointment });
    } catch (emitErr) {
      console.error('Socket emit error (appointment):', emitErr);
    }
    
    res.json({ success: true, appointment });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/patients/:id/prescriptions
// @desc    Get patient prescriptions
router.get('/:id/prescriptions', auth, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.id })
      .populate('doctor', 'name specialty')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(prescriptions);
  } catch (err) {
    console.error('Error fetching prescriptions:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/patients/:id/timeline
// @desc    Add timeline event
router.post('/:id/timeline', auth, async (req, res) => {
  try {
    const { type, title, description, icon } = req.body;
    
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    
    patient.timeline.push({
      date: new Date(),
      type,
      title,
      description,
      icon
    });
    
    await patient.save();

    // Emit timeline update
    try {
      const io = req.app.get('io');
      if (io) io.to(`patient_${req.params.id}`).emit('patientTimelineUpdated', { timeline: patient.timeline });
    } catch (emitErr) {
      console.error('Socket emit error (timeline):', emitErr);
    }
    
    res.json({ success: true, timeline: patient.timeline });
  } catch (err) {
    console.error('Error adding timeline event:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/patients/:id/dashboard-stats
// @desc    Get patient dashboard statistics
router.get('/:id/dashboard-stats', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    
    const appointments = await Appointment.find({ patient: req.params.id });
    const prescriptions = await Prescription.find({ patient: req.params.id });
    
    const upcomingAppointments = appointments.filter(
      a => a.status === 'scheduled' && new Date(a.appointmentDate) > new Date()
    ).length;
    
    const activePrescriptions = prescriptions.filter(
      p => p.status === 'pending' || p.status === 'active'
    ).length;
    
    const completedAppointments = appointments.filter(
      a => a.status === 'completed'
    ).length;
    
    res.json({
      upcomingAppointments,
      activePrescriptions,
      completedAppointments,
      totalAppointments: appointments.length,
      totalPrescriptions: prescriptions.length,
      lastVisit: appointments.length > 0 ? appointments[0].appointmentDate : null,
      profileComplete: patient.profileComplete
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
