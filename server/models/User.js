const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'pharmacist', 'admin', 'reports'],
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active', // Changed to active by default for doctors and other staff
    validate: {
      validator: function(v) {
        // Skip validation for demo/test accounts
        if (this.email && (this.email.endsWith('@demo.com') || this.email.endsWith('@hospital.com'))) {
          return true;
        }
        // Only patients start as inactive
        if (this.isNew && this.role === 'patient') {
          return v === 'inactive';
        }
        return true;
      },
      message: 'Invalid status for user role'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // For OTP
  otp: String,
  otpExpires: Date,
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
