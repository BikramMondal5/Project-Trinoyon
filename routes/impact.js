// Add this to your main server file (app.js or server.js)
// Make sure to import Donation model at the top of your file
const Donation = require('./models/Donation'); // Adjust path as needed

app.get('/impact', async (req, res) => {
  try {
    // Fetch recent donations with donor info
    const donations = await Donation.find({ 
      status: 'completed' 
    })
    .sort({ createdAt: -1 }) // Most recent first
    .limit(20) // Limit to 20 recent donations
    .select('donorName amount message createdAt')
    .lean();

    // Get donation statistics
    const statsResult = await Donation.getDonationStats();
    const stats = statsResult.length > 0 ? statsResult[0] : {
      totalAmount: 0,
      totalDonations: 0,
      averageDonation: 0
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
        averageDonation: 0
      },
      title: 'Impact - Our Contributors',
      error: 'Unable to load donation data'
    });
  }
});