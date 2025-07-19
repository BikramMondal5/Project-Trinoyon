const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const router = express.Router();

// Validate environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('❌ Missing Razorpay credentials in environment variables');
  console.log('Required: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET');
}

// Initialize Razorpay with error handling
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('✅ Razorpay initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Razorpay:', error.message);
}

// Create order endpoint - Only creates Razorpay order, NO database entry
router.post('/api/create-order', async (req, res) => {
  try {
    console.log('📝 Create order request received:', req.body);

    const { amount, currency = 'INR', receipt, notes, donor_name, donor_email, donor_phone } = req.body;

    // Validate amount
    if (!amount || amount < 1) {
      console.log('❌ Invalid amount:', amount);
      return res.status(400).json({ 
        success: false,
        message: 'Valid amount is required (minimum 1)'
      });
    }

    // Validate Razorpay instance
    if (!razorpay) {
      console.error('❌ Razorpay not initialized');
      return res.status(500).json({
        success: false,
        message: 'Payment service not available'
      });
    }

    // Create unique receipt ID
    const uniqueReceipt = `receipt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    const options = {
      amount: Math.round(amount * 100),
      currency: currency,
      receipt: uniqueReceipt,
      notes: {
        ...notes,
        // Store user data in notes for later use
        donor_name: donor_name,
        donor_email: donor_email,
        donor_phone: donor_phone
      }
    };

    console.log('🔄 Creating Razorpay order with options:', options);

    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created:', order.id);

    // Return order details WITHOUT saving to database
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      // Include user data for frontend to use
      userData: {
        donor_name,
        donor_email,
        donor_phone
      }
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);

    if (error.statusCode) {
      console.error('Razorpay API Error:', {
        statusCode: error.statusCode,
        error: error.error
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Verify payment endpoint - ONLY save to database on successful verification
router.post('/api/verify-payment', async (req, res) => {
  try {
    console.log('🔍 Payment verification request:', req.body);

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      // Additional data from frontend
      donor_name,
      donor_email, 
      donor_phone,
      amount,
      currency,
      notes
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      console.log('❌ Missing payment verification data');
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification data'
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;
    console.log('🔐 Signature verification:', isAuthentic ? '✅ Valid' : '❌ Invalid');

    if (isAuthentic) {
      // Check if donation already exists (prevent duplicates)
      const existingDonation = await Donation.findOne({ 
        razorpayOrderId: razorpay_order_id 
      });

      if (existingDonation) {
        console.log('⚠️ Donation already exists for order:', razorpay_order_id);
        return res.json({
          success: true,
          message: 'Payment already verified',
          donation: existingDonation
        });
      }

      // Create donation record ONLY on successful payment verification
      const donationData = {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        amount: amount,
        currency: currency || 'INR',
        status: 'completed',
        paidAt: new Date(),
        notes: notes,
        donorName: donor_name,
        donorEmail: donor_email,
        donorPhone: donor_phone
      };

      console.log('💾 Saving successful donation to database:', donationData);

      const donation = new Donation(donationData);
      await donation.save();

      console.log('✅ Payment verified and donation saved:', donation._id);

      res.json({ 
        success: true, 
        message: 'Payment verified and donation recorded successfully',
        donation: donation
      });

    } else {
      console.log('❌ Invalid signature for order:', razorpay_order_id);
      
      // Do NOT save to database for invalid signatures
      res.status(400).json({ 
        success: false, 
        message: 'Invalid payment signature' 
      });
    }

  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    
    if (error.name === 'ValidationError') {
      console.error('MongoDB Validation Error:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Invalid donation data',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }

    if (error.code === 11000) {
      console.error('Duplicate key error:', error.keyPattern);
      return res.status(400).json({
        success: false,
        message: 'Donation already exists for this payment'
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to verify payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get all donations
router.get('/api/donations', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const donations = await Donation.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalDonations = await Donation.countDocuments();

    res.json({
      success: true,
      donations,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalDonations / limit),
        totalDonations,
        hasNext: skip + limit < totalDonations,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch donations',
      error: error.message
    });
  }
});

// Get donation statistics
router.get('/api/donation-stats', async (req, res) => {
  try {
    const stats = await Donation.getDonationStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch donation statistics',
      error: error.message
    });
  }
});

// Get single donation by order ID
router.get('/api/donation/:orderId', async (req, res) => {
  try {
    const donation = await Donation.findOne({ 
      razorpayOrderId: req.params.orderId 
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.json({
      success: true,
      donation
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation',
      error: error.message
    });
  }
});

module.exports = router;