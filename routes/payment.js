const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Donor = require("../models/Donor");

router.get("/", (req, res) => {
  res.redirect("/index");
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Home Page
router.get("/index", (req, res) => {
  res.render("index", { razorpayKey: process.env.RAZORPAY_KEY_ID });
});

// Create Razorpay Order
router.post("/create-order", async (req, res) => {
  const options = {
    amount: 5000, // ₹50 in paise
    currency: "INR",
    receipt: "rcpt_" + Date.now(),
    payment_capture: 1,
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).send("Order creation failed");
  }
});

const axios = require("axios");

router.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (hmac === razorpay_signature) {
    try {
      // Fetch payment details from Razorpay
      const response = await axios.get(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET
        }
      });

      const payerName = response.data?.user_name || response.data?.email || "Anonymous";

      await Donor.create({
        name: payerName,
        paymentId: razorpay_payment_id,
        date: new Date()
      });

      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Payment fetch failed:", err.message);
      res.status(500).json({ success: false });
    }
  } else {
    res.status(400).json({ success: false });
  }
});
module.exports=router;