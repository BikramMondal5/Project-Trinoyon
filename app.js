const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const paymentRoutes = require("./routes/payment");
// Import the Donation model
const Donation = require('./models/Donation'); // Adjust path based on your folder structure

// DB Connect
mongoose.connect(process.env.MONGO_URI, {
  // Add any connection options if needed
}).then(() => console.log("🛢️ MongoDB connected"))
  .catch((err) => console.error("DB Error:", err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

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

// Game routes
app.get('/First-game', (req, res) => {
  res.render('First-game');
});

app.get('/Second-game', (req, res) => {
  res.render('Second-game');
});

app.get('/Third-game', (req, res) => {
  res.render('Third-game');
});

app.get('/Fourth-game', (req, res) => {
  res.render('Fourth-game');
});

app.get('/Fifth-game', (req, res) => {
  res.render('Fifth-game');
});

app.get('/Sixth-game', (req, res) => {
  res.render('Sixth-game');
});

app.get('/Seventh-game', (req, res) => {
  res.render('Seventh-game');
});

app.get('/Eighth-game', (req, res) => {
  res.render('Eighth-game');
});

app.get('/Ninth-game', (req, res) => {
  res.render('Ninth-game');
});

app.get('/Tenth-game', (req, res) => {
  res.render('Tenth-game');
});

app.get('/Eleventh-game', (req, res) => {
  res.render('Eleventh-game');
});

app.get('/Twelveth-game', (req, res) => {
  res.render('Twelveth-game');
});

app.get('/vp', (req, res) => {
  res.render('vp');
});

// SINGLE Impact route - Remove the other duplicate ones
app.get('/impact', async (req, res) => {
  try {
    console.log('📊 Fetching donations for impact page...');
   
    // Fetch recent donations with donor info
    const donations = await Donation.find({
      status: 'completed'
    })
    .sort({ createdAt: -1 }) // Most recent first
    .limit(20) // Limit to 20 recent donations
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
      progressPercentage: Math.round(progressPercentage * 10) / 10 ,// Round to 1 decimal place
    };

    console.log('📈 Final stats:', stats);
   
    // Render the impact page with data
    res.render('impact', {
      donations: donations || [], // Ensure it's always an array
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

// Start Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));