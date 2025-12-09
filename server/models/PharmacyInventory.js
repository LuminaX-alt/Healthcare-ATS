const mongoose = require('mongoose');

const PharmacyInventorySchema = new mongoose.Schema({
  medication: {
    name: {
      type: String,
      required: true
    },
    genericName: String,
    brandName: String,
    manufacturer: String,
    ndc: String, // National Drug Code
    strength: String,
    form: {
      type: String,
      enum: ['tablet', 'capsule', 'liquid', 'injection', 'cream', 'inhaler', 'patch', 'other']
    }
  },
  inventory: {
    currentStock: {
      type: Number,
      required: true,
      default: 0
    },
    reorderLevel: {
      type: Number,
      default: 50
    },
    reorderQuantity: {
      type: Number,
      default: 200
    },
    maxStock: Number,
    unit: String // 'tablets', 'ml', 'units', etc.
  },
  pricing: {
    costPrice: Number,
    sellingPrice: Number,
    insurancePrice: Number,
    discountPercentage: Number
  },
  storage: {
    location: String,
    section: String,
    shelf: String,
    requiresRefrigeration: Boolean,
    requiresControlledAccess: Boolean
  },
  batches: [{
    batchNumber: String,
    quantity: Number,
    manufacturingDate: Date,
    expiryDate: Date,
    supplier: String,
    receivedDate: Date,
    status: {
      type: String,
      enum: ['available', 'expired', 'recalled', 'quarantined'],
      default: 'available'
    }
  }],
  dispensingHistory: [{
    date: Date,
    quantity: Number,
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription'
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    },
    pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacist'
    },
    batchUsed: String
  }],
  alerts: [{
    type: {
      type: String,
      enum: ['low_stock', 'expiring_soon', 'expired', 'out_of_stock', 'recalled']
    },
    severity: String,
    message: String,
    createdAt: Date,
    resolved: Boolean
  }],
  restrictions: {
    controlled: Boolean,
    schedule: String, // DEA schedule if controlled substance
    requiresPrescription: Boolean,
    ageRestricted: Boolean,
    quantityLimit: Number
  },
  alternatives: [{
    medicationName: String,
    reason: String,
    costComparison: String
  }],
  lastRestocked: Date,
  lastDispensed: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if reorder is needed
PharmacyInventorySchema.methods.needsReorder = function() {
  return this.inventory.currentStock <= this.inventory.reorderLevel;
};

// Check for expiring batches
PharmacyInventorySchema.methods.getExpiringBatches = function(daysThreshold = 30) {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  
  return this.batches.filter(batch => 
    batch.status === 'available' && 
    new Date(batch.expiryDate) <= thresholdDate
  );
};

// Dispense medication
PharmacyInventorySchema.methods.dispense = function(quantity, prescriptionId, patientId, pharmacistId, batchNumber) {
  if (this.inventory.currentStock < quantity) {
    throw new Error('Insufficient stock');
  }
  
  this.inventory.currentStock -= quantity;
  this.lastDispensed = new Date();
  
  this.dispensingHistory.push({
    date: new Date(),
    quantity,
    prescription: prescriptionId,
    patient: patientId,
    pharmacist: pharmacistId,
    batchUsed: batchNumber
  });
  
  // Create alert if stock is low
  if (this.needsReorder() && !this.alerts.some(a => a.type === 'low_stock' && !a.resolved)) {
    this.alerts.push({
      type: 'low_stock',
      severity: 'high',
      message: `Stock level (${this.inventory.currentStock}) is below reorder level (${this.inventory.reorderLevel})`,
      createdAt: new Date(),
      resolved: false
    });
  }
  
  return this.save();
};

// Add stock
PharmacyInventorySchema.methods.restock = function(quantity, batchInfo) {
  this.inventory.currentStock += quantity;
  this.lastRestocked = new Date();
  
  if (batchInfo) {
    this.batches.push({
      ...batchInfo,
      quantity,
      receivedDate: new Date(),
      status: 'available'
    });
  }
  
  return this.save();
};

module.exports = mongoose.model('PharmacyInventory', PharmacyInventorySchema);
