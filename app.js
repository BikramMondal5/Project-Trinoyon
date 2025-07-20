const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const paymentRoutes = require("./routes/payment");

// Import the Donation model (THIS WAS MISSING!)
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

// Fixed Impact route
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
    const stats = statsResult.length > 0 ? statsResult[0] : {
      totalAmount: 0,
      totalDonations: 0,
      averageDonation: 0
    };
    
    console.log('📈 Stats:', stats);
    
    // Render the impact page with data
    res.render('impact', {
      donations: donations || [], // Ensure it's always an array
      stats: stats || {
        totalAmount: 0,
        totalDonations: 0,
        averageDonation: 0
      },
      title: 'Impact - Our Contributors',
      currentRoute: 'impact' // Add this for navigation consistency
    });
    
  } catch (error) {
    console.error('❌ Error fetching donations for impact page:', error);
   
    // Render with empty data if there's an error
    res.render('impact', {
      donations: [], // Always provide empty array
      stats: {
        totalAmount: 0,
        totalDonations: 0,
        averageDonation: 0
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