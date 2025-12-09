const mongoose = require('mongoose');

const CommunicationThreadSchema = new mongoose.Schema({
  participants: {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    }
  },
  relatedTo: {
    type: {
      type: String,
      enum: ['prescription', 'appointment', 'lab_test', 'general', 'side_effect', 'refill']
    },
    referenceId: mongoose.Schema.Types.ObjectId
  },
  subject: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['open', 'awaiting_patient', 'awaiting_doctor', 'resolved', 'closed'],
    default: 'open'
  },
  messages: [{
    sender: {
      id: mongoose.Schema.Types.ObjectId,
      type: String, // 'patient' or 'doctor'
      name: String
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    },
    readAt: Date,
    attachments: [{
      fileName: String,
      fileUrl: String,
      fileType: String,
      uploadedAt: Date
    }],
    systemGenerated: {
      type: Boolean,
      default: false
    }
  }],
  tags: [String],
  quickActions: [{
    action: String,
    label: String,
    completed: Boolean,
    completedAt: Date
  }],
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    patient: {
      type: Number,
      default: 0
    },
    doctor: {
      type: Number,
      default: 0
    }
  },
  autoClose: {
    enabled: Boolean,
    afterDays: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update last message timestamp
CommunicationThreadSchema.methods.addMessage = function(messageData) {
  this.messages.push(messageData);
  this.lastMessageAt = new Date();
  
  // Update unread count
  if (messageData.sender.type === 'doctor') {
    this.unreadCount.patient += 1;
  } else {
    this.unreadCount.doctor += 1;
  }
  
  return this.save();
};

// Mark messages as read
CommunicationThreadSchema.methods.markAsRead = function(readerType) {
  const now = new Date();
  this.messages.forEach(msg => {
    if (!msg.read && msg.sender.type !== readerType) {
      msg.read = true;
      msg.readAt = now;
    }
  });
  
  if (readerType === 'patient') {
    this.unreadCount.patient = 0;
  } else {
    this.unreadCount.doctor = 0;
  }
  
  return this.save();
};

module.exports = mongoose.model('CommunicationThread', CommunicationThreadSchema);
