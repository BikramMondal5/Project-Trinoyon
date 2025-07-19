const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  donorName: String,
  paymentMethod: String,
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add method to get donation statistics
donationSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    { $match: { status: 'success' } },
    {
      $group: {
        _id: null,
        totalDonors: { $count: {} },
        totalAmount: { $sum: '$amount' },
        recentDonors: { 
          $push: {
            name: '$donorName',
            amount: '$amount',
            createdAt: '$createdAt'
          }
        }
      }
    },
    { $project: {
        _id: 0,
        totalDonors: 1,
        totalAmount: 1,
        recentDonors: { $slice: ['$recentDonors', -5] } // Get last 5 donors
    }}
  ]);
  
  return stats[0] || { totalDonors: 0, totalAmount: 0, recentDonors: [] };
};

module.exports = mongoose.model('Donation', donationSchema);
