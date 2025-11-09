#!/usr/bin/env node

/**
 * FIX: Sync department field with specialty field for all doctors
 * This ensures Lab Reports staff can see doctors in department dropdowns
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_prototype';

async function fixDoctorDepartments() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const Doctor = mongoose.model('Doctor', new mongoose.Schema({}, { strict: false }));

    // Get all doctors
    const doctors = await Doctor.find({});
    console.log(`\n📋 Found ${doctors.length} doctors in database`);

    let updated = 0;
    let skipped = 0;

    for (const doctor of doctors) {
      const currentDept = doctor.department;
      const currentSpecialty = doctor.specialty;

      // If department is missing but specialty exists, use specialty as department
      if (!currentDept && currentSpecialty) {
        await Doctor.updateOne(
          { _id: doctor._id },
          { $set: { department: currentSpecialty } }
        );
        console.log(`✅ ${doctor.name}: Set department to "${currentSpecialty}"`);
        updated++;
      } 
      // If department exists but specialty doesn't, use department as specialty
      else if (currentDept && !currentSpecialty) {
        await Doctor.updateOne(
          { _id: doctor._id },
          { $set: { specialty: currentDept } }
        );
        console.log(`✅ ${doctor.name}: Set specialty to "${currentDept}"`);
        updated++;
      }
      // If both are missing, set to "General Medicine"
      else if (!currentDept && !currentSpecialty) {
        await Doctor.updateOne(
          { _id: doctor._id },
          { $set: { department: 'General Medicine', specialty: 'General Medicine' } }
        );
        console.log(`✅ ${doctor.name}: Set both to "General Medicine"`);
        updated++;
      }
      // If both exist and match, skip
      else {
        console.log(`⏭️  ${doctor.name}: Already has department "${currentDept}"`);
        skipped++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Updated: ${updated} doctors`);
    console.log(`   ⏭️  Skipped: ${skipped} doctors`);
    console.log(`   📋 Total: ${doctors.length} doctors`);

    // Verify the fix
    console.log(`\n🔍 Verification:`);
    const doctorsWithoutDept = await Doctor.countDocuments({ 
      $or: [
        { department: { $exists: false } },
        { department: null },
        { department: '' }
      ]
    });
    
    if (doctorsWithoutDept === 0) {
      console.log(`   ✅ All doctors now have department field!`);
    } else {
      console.log(`   ⚠️  ${doctorsWithoutDept} doctors still missing department`);
    }

    await mongoose.connection.close();
    console.log('\n🎉 Database fix complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the fix
fixDoctorDepartments();
