const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: String,
  paymentId: String,
  orderId: String,
  amount: Number,
  paymentMethod: String, // "PhonePe", "GooglePay", "Paytm"
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Donor", donorSchema);
