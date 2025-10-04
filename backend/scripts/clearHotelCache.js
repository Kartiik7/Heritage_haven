// backend/scripts/clearHotelCache.js
require('dotenv').config();
const mongoose = require('mongoose');
const HotelCache = require('../models/HotelCache');

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to Mongo, removing HotelCache entries...');
  const deleted = await HotelCache.deleteMany({});
  console.log('Deleted documents count:', deleted.deletedCount);
  await mongoose.disconnect();
  console.log('Done.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
