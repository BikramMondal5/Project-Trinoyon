const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const paymentRoutes = require("./routes/payment");

// DB Connect (optional)
mongoose.connect(process.env.MONGO_URI, {
 
}).then(() => console.log("🛢️ MongoDB connected"))
  .catch((err) => console.error("DB Error:", err));



// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
  res.render("index", {
    currentRoute: 'index'
  });
});

app.use("/", paymentRoutes);

app.get("/games", (req, res) => {
  res.render("games", {
    currentRoute: 'games'
  })
});

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
app.get('/impact', (req, res) => {
  res.render('impact',{
    currentRoute:'impact'
  })
});


// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
