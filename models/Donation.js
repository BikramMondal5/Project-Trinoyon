const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  razorpayOrderId: {
    type: String,
    required: [true, 'Razorpay Order ID is required'],
    index: true
  },
  razorpayPaymentId: {
    type: String,
    required: [true, 'Razorpay Payment ID is required'],
    index: true // NO unique constraint
  },
  razorpaySignature: {
    type: String,
    required: [true, 'Razorpay Signature is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be at least 1']
  },
  currency: {
    type: String,
    required: true,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  paidAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  donorName: {
    type: String,
    required: [true, 'Donor name is required'],
    trim: true,
    maxlength: [100, 'Donor name cannot exceed 100 characters']
  },
  donorEmail: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    maxlength: [100, 'Email cannot exceed 100 characters']
  },
  message:{
     type: String,
     required: [true, 'Please send us a message'],
     trim:true,
     maxlength:[100, 'Message cannot exceed 100 characters']
  },
  notes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  donationSequence: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for performance
donationSchema.index({ createdAt: -1 });
donationSchema.index({ donorEmail: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ donorName: 1 });
donationSchema.index({ donorEmail: 1, createdAt: -1 });
donationSchema.index({ donorName: 1, createdAt: -1 });

// Donation statistics
donationSchema.statics.getDonationStats = function () {
  return this.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalDonations: { $sum: 1 },
        averageDonation: { $avg: '$amount' },
        minDonation: { $min: '$amount' },
        maxDonation: { $max: '$amount' }
      }
    }
  ]);
};

// Donor statistics
donationSchema.statics.getDonorStats = function (donorIdentifier) {
  const matchQuery = donorIdentifier.includes('@')
    ? { donorEmail: donorIdentifier, status: 'completed' }
    : { donorName: donorIdentifier, status: 'completed' };

  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalDonations: { $sum: 1 },
        firstDonation: { $min: '$createdAt' },
        lastDonation: { $max: '$createdAt' }
      }
    }
  ]);
};

// Pre-save logic
donationSchema.pre('save', async function (next) {
  if (this.amount <= 0) return next(new Error('Amount must be greater than 0'));
  if (!this.donorName || this.donorName.trim() === '') return next(new Error('Donor name is required'));

  if (this.isNew && this.donorEmail) {
    try {
      const count = await this.constructor.countDocuments({
        donorEmail: this.donorEmail,
        status: 'completed'
      });
      this.donationSequence = count + 1;
    } catch (error) {
      console.log('Could not set donation sequence:', error.message);
    }
  }
  next();
});

module.exports = mongoose.model('Donation', donationSchema);
