const mongoose = require('mongoose');
const AuditLog = require('../models/AuditLog');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/healthcare-prototype', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const sampleAuditLogs = [
  {
    eventTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    doctorId: 'DOC001',
    doctorName: 'Dr. John Smith',
    action: 'MEDICATION_ADDED',
    entity: 'Prescription',
    entityId: 'MED-001',
    details: 'Added Amoxicillin 500mg - Dosage: 500mg, Frequency: 3 times daily, Duration: 7 days | Medication: Amoxicillin 500mg | Dosage: 500mg | Frequency: 3 times daily | Duration: 7 days | Diagnosis: Bacterial Infection | Symptoms: Fever and cough',
    entryHash: `MED-001-${Date.now()}`,
    patientName: 'John Doe'
  },
  {
    eventTime: new Date(Date.now() - 55 * 60 * 1000),
    doctorId: 'DOC001',
    doctorName: 'Dr. John Smith',
    action: 'MEDICATION_ADDED',
    entity: 'Prescription',
    entityId: 'MED-002',
    details: 'Added Ciprofloxacin 250mg - Dosage: 250mg, Frequency: 2 times daily, Duration: 10 days | Medication: Ciprofloxacin 250mg | Dosage: 250mg | Frequency: 2 times daily | Duration: 10 days | Diagnosis: Urinary Tract Infection | Symptoms: Dysuria',
    entryHash: `MED-002-${Date.now()}`,
    patientName: 'Jane Smith'
  },
  {
    eventTime: new Date(Date.now() - 50 * 60 * 1000),
    doctorId: 'DOC002',
    doctorName: 'Dr. Sarah Johnson',
    action: 'PRESCRIPTION_SAVED',
    entity: 'Prescription',
    entityId: 'PRES-001',
    details: 'Prescription with 2 medication(s) saved | Diagnosis: Respiratory Infection | Symptoms: Cough and shortness of breath | Medication: Amoxicillin 500mg (500mg), Azithromycin 250mg (250mg)',
    entryHash: `PRES-001-${Date.now()}`,
    patientName: 'Michael Brown'
  },
  {
    eventTime: new Date(Date.now() - 45 * 60 * 1000),
    doctorId: 'DOC001',
    doctorName: 'Dr. John Smith',
    action: 'PATIENT_VITALS_RECORDED',
    entity: 'Patient Vitals',
    entityId: 'VITALS-001',
    details: 'Patient vitals recorded | BP: 120/80, HR: 72 | Temp: 98.6°C, Weight: 70kg, Height: 175cm',
    entryHash: `VITALS-001-${Date.now()}`,
    patientName: 'Emily Davis'
  },
  {
    eventTime: new Date(Date.now() - 40 * 60 * 1000),
    doctorId: 'DOC002',
    doctorName: 'Dr. Sarah Johnson',
    action: 'PATIENT_NOTE_ADDED',
    entity: 'Patient Vitals',
    entityId: 'NOTE-001',
    details: 'Doctor note added | Patient shows signs of recovery. Continue with current medication.',
    entryHash: `NOTE-001-${Date.now()}`,
    patientName: 'Robert Wilson'
  },
  {
    eventTime: new Date(Date.now() - 35 * 60 * 1000),
    doctorId: 'DOC003',
    doctorName: 'Dr. Michael Chen',
    action: 'MEDICATION_ADDED',
    entity: 'Prescription',
    entityId: 'MED-003',
    details: 'Added Metronidazole 400mg - Dosage: 400mg, Frequency: 3 times daily, Duration: 7 days | Medication: Metronidazole 400mg | Dosage: 400mg | Frequency: 3 times daily | Duration: 7 days | Diagnosis: Parasitic Infection | Symptoms: Abdominal pain',
    entryHash: `MED-003-${Date.now()}`,
    patientName: 'Lisa Anderson'
  },
  {
    eventTime: new Date(Date.now() - 30 * 60 * 1000),
    doctorId: 'DOC001',
    doctorName: 'Dr. John Smith',
    action: 'PRESCRIPTION_SAVED',
    entity: 'Prescription',
    entityId: 'PRES-002',
    details: 'Prescription with 1 medication(s) saved | Diagnosis: Urinary Tract Infection | Symptoms: Dysuria and frequency | Medication: Ciprofloxacin 250mg (250mg)',
    entryHash: `PRES-002-${Date.now()}`,
    patientName: 'Jennifer Martinez'
  },
  {
    eventTime: new Date(Date.now() - 25 * 60 * 1000),
    doctorId: 'DOC002',
    doctorName: 'Dr. Sarah Johnson',
    action: 'MEDICATION_ADDED',
    entity: 'Prescription',
    entityId: 'MED-004',
    details: 'Added Ceftriaxone 1g - Dosage: 1g, Frequency: 2 times daily, Duration: 5 days | Medication: Ceftriaxone 1g | Dosage: 1g | Frequency: 2 times daily | Duration: 5 days | Diagnosis: Meningitis | Symptoms: Fever and headache',
    entryHash: `MED-004-${Date.now()}`,
    patientName: 'David Taylor'
  },
  {
    eventTime: new Date(Date.now() - 20 * 60 * 1000),
    doctorId: 'DOC003',
    doctorName: 'Dr. Michael Chen',
    action: 'PATIENT_VITALS_RECORDED',
    entity: 'Patient Vitals',
    entityId: 'VITALS-002',
    details: 'Patient vitals recorded | BP: 125/85, HR: 78 | Temp: 99.2°C, Weight: 72kg, Height: 180cm',
    entryHash: `VITALS-002-${Date.now()}`,
    patientName: 'Sarah Jackson'
  },
  {
    eventTime: new Date(Date.now() - 15 * 60 * 1000),
    doctorId: 'DOC001',
    doctorName: 'Dr. John Smith',
    action: 'MEDICATION_ADDED',
    entity: 'Prescription',
    entityId: 'MED-005',
    details: 'Added Levofloxacin 500mg - Dosage: 500mg, Frequency: 1 time daily, Duration: 14 days | Medication: Levofloxacin 500mg | Dosage: 500mg | Frequency: 1 time daily | Duration: 14 days | Diagnosis: Pneumonia | Symptoms: Chest pain and cough',
    entryHash: `MED-005-${Date.now()}`,
    patientName: 'Christopher White'
  },
  {
    eventTime: new Date(Date.now() - 12 * 60 * 1000),
    doctorId: 'DOC002',
    doctorName: 'Dr. Sarah Johnson',
    action: 'PRESCRIPTION_SAVED',
    entity: 'Prescription',
    entityId: 'PRES-003',
    details: 'Prescription with 3 medication(s) saved | Diagnosis: Severe Infection | Symptoms: Fever, chills and weakness | Medication: Ceftriaxone 1g (1g), Amoxicillin 500mg (500mg), Metronidazole 400mg (400mg)',
    entryHash: `PRES-003-${Date.now()}`,
    patientName: 'Amanda Harris'
  },
  {
    eventTime: new Date(Date.now() - 10 * 60 * 1000),
    doctorId: 'DOC003',
    doctorName: 'Dr. Michael Chen',
    action: 'PATIENT_NOTE_ADDED',
    entity: 'Patient Vitals',
    entityId: 'NOTE-002',
    details: 'Doctor note added | Patient responds well to treatment. Follow-up in 3 days.',
    entryHash: `NOTE-002-${Date.now()}`,
    patientName: 'Kevin Brown'
  },
  {
    eventTime: new Date(Date.now() - 8 * 60 * 1000),
    doctorId: 'DOC001',
    doctorName: 'Dr. John Smith',
    action: 'MEDICATION_ADDED',
    entity: 'Prescription',
    entityId: 'MED-006',
    details: 'Added Azithromycin 250mg - Dosage: 250mg, Frequency: 1 time daily, Duration: 5 days | Medication: Azithromycin 250mg | Dosage: 250mg | Frequency: 1 time daily | Duration: 5 days | Diagnosis: Throat Infection | Symptoms: Sore throat',
    entryHash: `MED-006-${Date.now()}`,
    patientName: 'Jessica Miller'
  },
  {
    eventTime: new Date(Date.now() - 6 * 60 * 1000),
    doctorId: 'DOC002',
    doctorName: 'Dr. Sarah Johnson',
    action: 'PATIENT_VITALS_RECORDED',
    entity: 'Patient Vitals',
    entityId: 'VITALS-003',
    details: 'Patient vitals recorded | BP: 118/78, HR: 70 | Temp: 98.8°C, Weight: 68kg, Height: 172cm',
    entryHash: `VITALS-003-${Date.now()}`,
    patientName: 'Daniel Lee'
  },
  {
    eventTime: new Date(Date.now() - 4 * 60 * 1000),
    doctorId: 'DOC003',
    doctorName: 'Dr. Michael Chen',
    action: 'PRESCRIPTION_SAVED',
    entity: 'Prescription',
    entityId: 'PRES-004',
    details: 'Prescription with 2 medication(s) saved | Diagnosis: Complicated Infection | Symptoms: Fever and pain | Medication: Levofloxacin 500mg (500mg), Azithromycin 250mg (250mg)',
    entryHash: `PRES-004-${Date.now()}`,
    patientName: 'Rebecca Garcia'
  },
  {
    eventTime: new Date(Date.now() - 2 * 60 * 1000),
    doctorId: 'DOC001',
    doctorName: 'Dr. John Smith',
    action: 'PATIENT_NOTE_ADDED',
    entity: 'Patient Vitals',
    entityId: 'NOTE-003',
    details: 'Doctor note added | Recommend bed rest and increased hydration for faster recovery.',
    entryHash: `NOTE-003-${Date.now()}`,
    patientName: 'Thomas Rodriguez'
  },
  {
    eventTime: new Date(Date.now() - 1 * 60 * 1000),
    doctorId: 'DOC002',
    doctorName: 'Dr. Sarah Johnson',
    action: 'MEDICATION_ADDED',
    entity: 'Prescription',
    entityId: 'MED-007',
    details: 'Added Vancomycin 1g - Dosage: 1g, Frequency: 2 times daily, Duration: 10 days | Medication: Vancomycin 1g | Dosage: 1g | Frequency: 2 times daily | Duration: 10 days | Diagnosis: Severe Bacterial Infection | Symptoms: High fever',
    entryHash: `MED-007-${Date.now()}`,
    patientName: 'Maria Lopez'
  },
  {
    eventTime: new Date(Date.now()),
    doctorId: 'DOC003',
    doctorName: 'Dr. Michael Chen',
    action: 'PRESCRIPTION_SAVED',
    entity: 'Prescription',
    entityId: 'PRES-005',
    details: 'Prescription with 1 medication(s) saved | Diagnosis: Antibiotic Resistant Infection | Symptoms: Persistent fever | Medication: Vancomycin 1g (1g)',
    entryHash: `PRES-005-${Date.now()}`,
    patientName: 'Patricia Clark'
  },
  {
    eventTime: new Date(Date.now()),
    doctorId: 'DOC001',
    doctorName: 'Dr. John Smith',
    action: 'PATIENT_VITALS_RECORDED',
    entity: 'Patient Vitals',
    entityId: 'VITALS-004',
    details: 'Patient vitals recorded | BP: 122/82, HR: 75 | Temp: 99.0°C, Weight: 71kg, Height: 178cm',
    entryHash: `VITALS-004-${Date.now()}`,
    patientName: 'Mark Thompson'
  },
  {
    eventTime: new Date(Date.now()),
    doctorId: 'DOC002',
    doctorName: 'Dr. Sarah Johnson',
    action: 'MEDICATION_ADDED',
    entity: 'Prescription',
    entityId: 'MED-008',
    details: 'Added Amoxicillin 500mg - Dosage: 500mg, Frequency: 3 times daily, Duration: 10 days | Medication: Amoxicillin 500mg | Dosage: 500mg | Frequency: 3 times daily | Duration: 10 days | Diagnosis: Recurrent Infection | Symptoms: Mild fever',
    entryHash: `MED-008-${Date.now()}`,
    patientName: 'Susan Phillips'
  },
  {
    eventTime: new Date(Date.now()),
    doctorId: 'DOC003',
    doctorName: 'Dr. Michael Chen',
    action: 'PATIENT_NOTE_ADDED',
    entity: 'Patient Vitals',
    entityId: 'NOTE-004',
    details: 'Doctor note added | Continue antibiotic therapy. Monitor for side effects.',
    entryHash: `NOTE-004-${Date.now()}`,
    patientName: 'James Park'
  },
  {
    eventTime: new Date(Date.now()),
    doctorId: 'DOC001',
    doctorName: 'Dr. John Smith',
    action: 'PRESCRIPTION_SAVED',
    entity: 'Prescription',
    entityId: 'PRES-006',
    details: 'Prescription with 2 medication(s) saved | Diagnosis: Mixed Infection | Symptoms: Fever and cough | Medication: Amoxicillin 500mg (500mg), Azithromycin 250mg (250mg)',
    entryHash: `PRES-006-${Date.now()}`,
    patientName: 'Barbara Young'
  },
  {
    eventTime: new Date(Date.now()),
    doctorId: 'DOC002',
    doctorName: 'Dr. Sarah Johnson',
    action: 'PATIENT_VITALS_RECORDED',
    entity: 'Patient Vitals',
    entityId: 'VITALS-005',
    details: 'Patient vitals recorded | BP: 116/76, HR: 68 | Temp: 98.4°C, Weight: 69kg, Height: 170cm',
    entryHash: `VITALS-005-${Date.now()}`,
    patientName: 'Richard King'
  },
  {
    eventTime: new Date(Date.now()),
    doctorId: 'DOC003',
    doctorName: 'Dr. Michael Chen',
    action: 'MEDICATION_ADDED',
    entity: 'Prescription',
    entityId: 'MED-009',
    details: 'Added Ciprofloxacin 250mg - Dosage: 250mg, Frequency: 2 times daily, Duration: 12 days | Medication: Ciprofloxacin 250mg | Dosage: 250mg | Frequency: 2 times daily | Duration: 12 days | Diagnosis: Gastrointestinal Infection | Symptoms: Diarrhea',
    entryHash: `MED-009-${Date.now()}`,
    patientName: 'Karen Wright'
  },
  {
    eventTime: new Date(Date.now()),
    doctorId: 'DOC001',
    doctorName: 'Dr. John Smith',
    action: 'PATIENT_NOTE_ADDED',
    entity: 'Patient Vitals',
    entityId: 'NOTE-005',
    details: 'Doctor note added | Patient to avoid dairy products during treatment.',
    entryHash: `NOTE-005-${Date.now()}`,
    patientName: 'Joseph Scott'
  }
];

async function seedAuditLogs() {
  try {
    // Clear existing audit logs (optional)
    await AuditLog.deleteMany({});
    console.log('✅ Cleared existing audit logs');

    // Insert sample audit logs
    const result = await AuditLog.insertMany(sampleAuditLogs);
    console.log(`✅ Successfully inserted ${result.length} sample audit logs`);

    // Display sample logs
    const logs = await AuditLog.find().sort({ eventTime: -1 }).limit(5);
    console.log('\n📋 Sample Audit Logs:');
    logs.forEach((log, index) => {
      console.log(`\n${index + 1}. ${log.doctorName} - ${log.patientName}`);
      console.log(`   Action: ${log.action}`);
      console.log(`   Details: ${log.details.substring(0, 100)}...`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding audit logs:', error);
    process.exit(1);
  }
}

seedAuditLogs();
