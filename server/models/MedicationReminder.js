const mongoose = require('mongoose');

const MedicationReminderSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
    required: true
  },
  tracking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrescriptionTracking'
  },
  medication: {
    name: String,
    dosage: String
  },
  reminderTimes: [{
    time: String, // Format: "09:00", "14:00", "21:00"
    enabled: {
      type: Boolean,
      default: true
    }
  }],
  frequency: {
    type: String,
    enum: ['once_daily', 'twice_daily', 'thrice_daily', 'four_times_daily', 'as_needed', 'custom']
  },
  customSchedule: [{
    day: String,
    times: [String]
  }],
  notificationMethods: {
    push: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    email: {
      type: Boolean,
      default: false
    }
  },
  snoozeSettings: {
    enabled: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: 15 // minutes
    },
    maxSnoozes: {
      type: Number,
      default: 3
    }
  },
  adherenceGoal: {
    type: Number,
    default: 90 // percentage
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  active: {
    type: Boolean,
    default: true
  },
  missedDoseAlerts: [{
    date: Date,
    scheduledTime: String,
    alertSentAt: Date,
    acknowledged: Boolean
  }],
  streakData: {
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastTakenDate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to check if reminder is due
MedicationReminderSchema.methods.isDueNow = function() {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  return this.reminderTimes.some(rt => 
    rt.enabled && rt.time === currentTime
  );
};

// Method to update streak
MedicationReminderSchema.methods.updateStreak = function(taken) {
  const today = new Date().toDateString();
  const lastTaken = this.streakData.lastTakenDate ? 
    new Date(this.streakData.lastTakenDate).toDateString() : null;
  
  if (taken) {
    if (lastTaken !== today) {
      this.streakData.currentStreak += 1;
      this.streakData.lastTakenDate = new Date();
      
      if (this.streakData.currentStreak > this.streakData.longestStreak) {
        this.streakData.longestStreak = this.streakData.currentStreak;
      }
    }
  } else {
    this.streakData.currentStreak = 0;
  }
  
  return this.save();
};

module.exports = mongoose.model('MedicationReminder', MedicationReminderSchema);
