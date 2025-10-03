require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const { initializeModel } = require('./utils/recommendationEngine'); // <-- IMPORT

const app = express();
connectDB().then(() => {
  initializeModel(); // <-- INITIALIZE MODEL AFTER DB CONNECTION
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
res.send('Heritage Haven API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sites', require('./routes/siteRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
