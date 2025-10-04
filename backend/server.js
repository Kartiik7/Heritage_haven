// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db.js');
const { initializeModel } = require('./utils/recommendationEngine');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// --- CORS Configuration to handle both URIs ---
const allowedOrigins = [
  'https://heritage-haven.onrender.com', // Your deployed FRONTEND URL
  'http://localhost:5173'                 // Your local development frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());


// Basic root route
app.get('/', (req, res) => {
  res.send('Heritage Haven API is running...');
});

// Register routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sites', require('./routes/siteRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/places', require('./routes/placesRoutes'));


// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');
    
    if (typeof initializeModel === 'function') {
      await initializeModel();
      console.log('✅ Recommendation model initialized');
    }
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();

