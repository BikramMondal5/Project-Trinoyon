const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

router.get('/', async (req, res) => {
  try {
    // Fetch recent donations with donor info
    const donations = await Donation.find({
      status: 'completed'
    })
    .sort({ createdAt: -1 }) // Most recent first
    .limit(20) // Limit to 20 recent donations
    .select('donorName amount message createdAt')
    .lean();

    // Get real-time donation statistics
    const statsResult = await Donation.getDonationStats();
    const rawStats = statsResult.length > 0 ? statsResult[0] : {
      totalAmount: 0,
      totalDonations: 0,
      averageDonation: 0,
    };

    // Set fundraising goal and calculate progress percentage
    const fundraisingGoal = 50000; // Your goal amount
    const totalRaised = rawStats.totalAmount || 0;
    const progressPercentage = totalRaised > 0 
      ? ((totalRaised / fundraisingGoal) * 100).toFixed(1) 
      : 0;

    const stats = {
      ...rawStats,
      fundraisingGoal: fundraisingGoal,
      progressPercentage: progressPercentage,
    };

    // Render the impact page with data
    res.render('impact', {
      donations,
      stats,
      title: 'Impact - Our Contributors'
    });

  } catch (error) {
    console.error('Error fetching donations for impact page:', error);
   
    // Render with empty data if there's an error
    res.render('impact', {
      donations: [],
      stats: {
        totalAmount: 0,
        totalDonations: 0,
        averageDonation: 0,
        fundraisingGoal: 50000,
        progressPercentage: 0
      },
      title: 'Impact - Our Contributors',
      error: 'Unable to load donation data'
    });
  }
});