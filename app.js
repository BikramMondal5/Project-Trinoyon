const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const paymentRoutes = require("./routes/payment");
// Import the Donation model
const Donation = require('./models/Donation');

// DB Connect with better error handling
mongoose.connect(process.env.MONGO_URI, {
  // Modern connection options
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("🛢️ MongoDB connected successfully");
}).catch((err) => {
  console.error("❌ DB Connection Error:", err);
  process.exit(1); // Exit if DB connection fails
});

// Middleware
app.use(bodyParser.json({ limit: '10mb' })); // Add size limit
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Security headers for production
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    currentRoute: 'index'
  });
});

app.use("/", paymentRoutes);

app.get("/games", (req, res) => {
  res.render("games", {
    currentRoute: 'games'
  });
});

// Game routes - Consider using a loop or route parameter to reduce repetition
const gameRoutes = [
  'First-game', 'Second-game', 'Third-game', 'Fourth-game', 
  'Fifth-game', 'Sixth-game', 'Seventh-game', 'Eighth-game',
  'Ninth-game', 'Tenth-game', 'Eleventh-game', 'Twelveth-game'
];

gameRoutes.forEach(game => {
  app.get(`/${game}`, (req, res) => {
    res.render(game);
  });
});

app.get('/vp', (req, res) => {
  res.render('vp');
});

// Impact route with improved error handling
app.get('/impact', async (req, res) => {
  try {
    console.log('📊 Fetching donations for impact page...');
   
    // Fetch recent donations with donor info
    const donations = await Donation.find({
      status: 'completed'
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('donorName amount message createdAt')
    .lean();
   
    console.log(`✅ Found ${donations.length} donations`);
   
    // Get donation statistics
    const statsResult = await Donation.getDonationStats();
    const baseStats = statsResult.length > 0 ? statsResult[0] : {
      totalAmount: 0,
      totalDonations: 0,
      averageDonation: 0
    };
   
    // Find the top donor
    const topDonorResult = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$donorName',
          totalDonated: { $sum: '$amount' },
          donationCount: { $sum: 1 }
        }
      },
      { $sort: { totalDonated: -1 } },
      { $limit: 1 }
    ]);

    // Create top donor object with proper error handling
    const topDonor = topDonorResult.length > 0 ? {
      name: topDonorResult[0]._id || 'Unknown Donor',
      amount: topDonorResult[0].totalDonated || 0,
      initials: (topDonorResult[0]._id || 'Unknown Donor')
        .split(' ')
        .map(n => n[0] || '')
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'UD'
    } : {
      name: 'No donations yet',
      amount: 0,
      initials: 'NA'
    };

    // Count unique donors
    const uniqueDonors = await Donation.distinct('donorName', { status: 'completed' });
    const uniqueDonorCount = uniqueDonors.length;

    // Define your fundraising goal
    const fundraisingGoal = 200000; // ₹2,00,000
   
    // Calculate progress percentage
    const progressPercentage = Math.min((baseStats.totalAmount / fundraisingGoal) * 100, 100);
   
    // Combine all stats
    const stats = {
      ...baseStats,
      uniqueDonorCount,
      topDonor,
      fundraisingGoal,
      progressPercentage: Math.round(progressPercentage * 10) / 10
    };

    console.log('📈 Final stats:', stats);
   
    // Render the impact page with data
    res.render('impact', {
      donations: donations || [],
      stats: stats,
      title: 'Impact - Our Contributors',
      currentRoute: 'impact'
    });
   
  } catch (error) {
    console.error('❌ Error fetching donations for impact page:', error);
   
    // Render with safe default data if there's an error
    res.render('impact', {
      donations: [],
      stats: {
        totalAmount: 0,
        totalDonations: 0,
        averageDonation: 0,
        uniqueDonorCount: 0,
        topDonor: { 
          name: 'No donations yet', 
          amount: 0, 
          initials: 'NA' 
        },
        fundraisingGoal: 200000,
        progressPercentage: 0
      },
      title: 'Impact - Our Contributors',
      currentRoute: 'impact',
      error: 'Unable to load donation data'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found',
    currentRoute: '404'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('🛢️ MongoDB connection closed');
    process.exit(0);
  });
});

// Start Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  const environment = process.env.NODE_ENV || 'development';
  if (environment === 'production') {
    console.log(`✅ Server running on port ${PORT}`);
  } else {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  }
  console.log(`🌍 Environment: ${environment}`);
});