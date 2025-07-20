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

    const { amount, currency = 'INR', receipt, notes, donor_name, donor_email, message } = req.body;

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
        message:message,
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
        message,
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

// Verify payment endpoint - Use Order ID to prevent duplicates
// Enhanced verify payment endpoint with better debugging and error handling
router.post('/api/verify-payment', async (req, res) => {
  try {
    console.log('🔍 === NEW PAYMENT VERIFICATION REQUEST ===');
    console.log('📥 Raw request body:', JSON.stringify(req.body, null, 2));
    
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      donor_name,
      donor_email, 
      message,
      amount,
      currency,
      notes
    } = req.body;

    // Enhanced validation with detailed logging
    console.log('🔍 Validation check:');
    console.log('  - Payment ID:', razorpay_payment_id ? '✅' : '❌ MISSING');
    console.log('  - Order ID:', razorpay_order_id ? '✅' : '❌ MISSING');
    console.log('  - Signature:', razorpay_signature ? '✅' : '❌ MISSING');
    console.log('  - Amount:', amount ? `✅ ${amount}` : '❌ MISSING');
    console.log('  - Donor Name:', donor_name ? `✅ ${donor_name}` : '❌ MISSING');

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      console.log('❌ Missing required payment verification data');
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification data',
        missing: {
          payment_id: !razorpay_payment_id,
          order_id: !razorpay_order_id,
          signature: !razorpay_signature
        }
      });
    }

    // Enhanced signature verification with debugging
    console.log('🔐 Signature verification process:');
    console.log('  - Order ID:', razorpay_order_id);
    console.log('  - Payment ID:', razorpay_payment_id);
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    console.log('  - Body string:', body);
    console.log('  - Key secret exists:', process.env.RAZORPAY_KEY_SECRET ? '✅' : '❌ MISSING');
    
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ RAZORPAY_KEY_SECRET is missing from environment variables');
      return res.status(500).json({
        success: false,
        message: 'Payment service configuration error'
      });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    console.log('  - Expected signature:', expectedSignature);
    console.log('  - Received signature:', razorpay_signature);
    
    const isAuthentic = expectedSignature === razorpay_signature;
    console.log('  - Signature match:', isAuthentic ? '✅ VALID' : '❌ INVALID');

    if (!isAuthentic) {
      console.log('❌ Invalid signature - Payment verification failed');
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment signature',
        debug: process.env.NODE_ENV === 'development' ? {
          expected: expectedSignature,
          received: razorpay_signature,
          body: body
        } : undefined
      });
    }

    // Signature is valid, proceed with database operations
    console.log('✅ Signature verified successfully, proceeding to save donation');

    // Prepare donation data with validation
    const donationData = {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: Number(amount), // Ensure amount is a number
      currency: currency || 'INR',
      status: 'completed',
      paidAt: new Date(),
      notes: notes || {},
      donorName: donor_name || 'Anonymous',
      donorEmail: donor_email || null,
      message: message || 'Anonymous'
    };

    console.log('💾 Prepared donation data:', JSON.stringify(donationData, null, 2));


      // Create new donation
      console.log('💾 Creating new donation entry...');
      const donation = new Donation(donationData);
      
      // Validate before saving
      const validationError = donation.validateSync();
      if (validationError) {
        console.error('❌ Validation error before save:', validationError.errors);
        return res.status(400).json({
          success: false,
          message: 'Invalid donation data',
          errors: Object.keys(validationError.errors).map(key => ({
            field: key,
            message: validationError.errors[key].message
          }))
        });
      }

      // Save to database
      const savedDonation = await donation.save();
      console.log('✅ NEW donation saved successfully with ID:', savedDonation._id);

      res.json({ 
        success: true, 
        message: 'Payment verified and donation recorded successfully',
        donation: savedDonation,
        isNewDonation: true
      });

    } catch (saveError) {
      console.error('❌ Database save error:', saveError);
      
      if (saveError.name === 'ValidationError') {
        console.error('Validation errors:', saveError.errors);
        return res.status(400).json({
          success: false,
          message: 'Invalid donation data',
          errors: Object.keys(saveError.errors).map(key => ({
            field: key,
            message: saveError.errors[key].message,
            value: saveError.errors[key].value
          }))
        });
      }
  }})
      
     
// Test endpoint to verify Razorpay configuration
router.get('/api/test-razorpay-config', (req, res) => {
  console.log('🔧 Testing Razorpay configuration...');
  
  const config = {
    hasKeyId: !!process.env.RAZORPAY_KEY_ID,
    hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
    razorpayInitialized: !!razorpay,
    keyIdLength: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.length : 0,
    keySecretLength: process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.length : 0
  };
  
  console.log('Configuration status:', config);
  
  res.json({
    success: true,
    config: {
      ...config,
      // Don't expose actual keys in response
      keyId: process.env.RAZORPAY_KEY_ID ? `${process.env.RAZORPAY_KEY_ID.substring(0, 8)}...` : null
    }
  });
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