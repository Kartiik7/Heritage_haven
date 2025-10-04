require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const { initializeModel } = require('./utils/recommendationEngine');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Connect to Database and initialize model
connectDB().then(() => {
  initializeModel();
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Heritage Haven API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sites', require('./routes/siteRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));

// Error handling middleware (must be at the end)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
