const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  razorpayPaymentId: {
    type: String,
    default: null
  },
  razorpaySignature: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Amount must be at least 1']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR'] // Add supported currencies
  },
  notes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  donorName: {
    type: String,
    default: null,
    trim: true
  },
  donorEmail: {
    type: String,
    default: null,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  donorPhone: {
    type: String,
    default: null,
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'completed', 'failed'],
      message: 'Status must be pending, completed, or failed'
    },
    default: 'pending'
  },
    cancelledAt: {
    type: Date,
    default: null
    },
  errorDescription: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date,
    default: null
  }
  // Remove updatedAt since timestamps: true already adds it
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Indexes for better performance
donationSchema.index({ status: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ paidAt: -1 });
donationSchema.index({ donorEmail: 1 }); // Added for donor lookup

// Pre-save middleware to ensure data consistency
donationSchema.pre('save', function(next) {
  if (this.status === 'completed' && !this.paidAt) {
    this.paidAt = new Date();
  }
  if (this.status === 'completed' && (!this.razorpayPaymentId || !this.razorpaySignature)) {
    return next(new Error('Payment ID and signature are required for completed donations'));
  }
  next();
});

// Static methods for analytics
donationSchema.statics.getTotalDonations = function() {
  return this.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalCount: { $sum: 1 }
      }
    }
  ]);
};

donationSchema.statics.getMonthlyDonations = function() {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  return this.aggregate([
    {
      $match: {
        status: 'completed',
        paidAt: { $gte: firstDayOfMonth }
      }
    },
    {
      $group: {
        _id: null,
        monthlyAmount: { $sum: '$amount' },
        monthlyCount: { $sum: 1 }
      }
    }
  ]);
};

donationSchema.statics.getDonationStats = async function() {
  try {
    const [totalStats] = await this.getTotalDonations();
    const [monthlyStats] = await this.getMonthlyDonations();
    
    return {
      totalAmount: totalStats?.totalAmount || 0,
      totalDonations: totalStats?.totalCount || 0,
      monthlyAmount: monthlyStats?.monthlyAmount || 0,
      monthlyDonations: monthlyStats?.monthlyCount || 0
    };
  } catch (error) {
    console.error('Error getting donation stats:', error);
    return {
      totalAmount: 0,
      totalDonations: 0,
      monthlyAmount: 0,
      monthlyDonations: 0
    };
  }
};

// Instance method to update payment status
donationSchema.methods.markAsCompleted = function(paymentId, signature) {
  this.razorpayPaymentId = paymentId;
  this.razorpaySignature = signature;
  this.status = 'completed';
  this.paidAt = new Date();
  return this.save();
};

donationSchema.methods.markAsFailed = function(errorDescription) {
  this.status = 'failed';
  this.errorDescription = errorDescription;
  return this.save();
};

module.exports = mongoose.model('Donation', donationSchema);