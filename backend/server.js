require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const pool = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure Helmet with custom CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "'unsafe-eval'", 
        "https://accounts.google.com",
        "https://www.gstatic.com",
        "https://cdn.tailwindcss.com",
        "https://cdnjs.cloudflare.com"
      ],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "https://fonts.googleapis.com", 
        "https://cdnjs.cloudflare.com", 
        "https://cdn.jsdelivr.net",
        "https://cdn.tailwindcss.com"
      ],
      fontSrc: [
        "'self'", 
        "https://fonts.gstatic.com", 
        "https://cdnjs.cloudflare.com", 
        "https://cdn.jsdelivr.net"
      ],
      imgSrc: [
        "'self'", 
        "data:", 
        "https:", 
        "blob:", 
        "https://readdy.ai",
        "https://t2.gstatic.com"
      ],
      connectSrc: [
        "'self'", 
        "https://accounts.google.com",
        "ws://localhost:*"
      ],
      frameSrc: ["'self'", "https://accounts.google.com"],
      objectSrc: ["'none'"],
      scriptSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.tailwindcss.com",
        "https://accounts.google.com",
        "https://www.gstatic.com",
        "blob:"
      ]
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Serve static files from frontend with proper MIME types
app.use(express.static(path.join(__dirname, '../frontend'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Track game access - no authentication required
app.post('/api/games/access', async (req, res) => {
  try {
    const { game_id } = req.body;

    // Update game access analytics without user info
    const result = await pool.query(
      `INSERT INTO game_analytics (game_id, access_count)
       VALUES ($1, 1)
       ON CONFLICT (game_id)
       DO UPDATE SET 
         access_count = game_analytics.access_count + 1,
         last_accessed_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [game_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database connected to: ${process.env.DB_NAME}`);
});