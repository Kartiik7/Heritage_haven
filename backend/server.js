// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db.js');
const { initializeModel } = require('./utils/recommendationEngine');

// create app BEFORE using app.use(...)
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// basic root route
app.get('/', (req, res) => {
  res.send('Heritage Haven API is running...');
});

// Register routes (ensure these files exist)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sites', require('./routes/siteRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

// optional routes you added — require them only if files exist
try {
  app.use('/api/quiz', require('./routes/quizRoutes'));
} catch (e) {
  console.warn('quizRoutes not mounted:', e.message);
}
try {
  app.use('/api/user', require('./routes/userRoutes'));
} catch (e) {
  console.warn('userRoutes not mounted:', e.message);
}
try {
  app.use('/api/hotels', require('./routes/hotelRoutes'));
} catch (e) {
  console.warn('hotelsRoutes not mounted:', e.message);
}
try {
  app.use('/api/places', require('./routes/placesRoutes'));
} catch (e) {
  // ok if not present
}

// Start server only after DB connection and model initialization
const PORT = process.env.PORT || 5000;
async function start() {
  try {
    await connectDB();
    // initialize recommendation model (if it exists)
    if (typeof initializeModel === 'function') {
      await initializeModel();
    }
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
