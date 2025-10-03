// backend/scripts/seedBadges.js
const mongoose = require('mongoose');
const Badge = require('../models/Badge');
const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/heritage';

async function run() {
  await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  const badges = [
    { key: 'history_explorer', name: '🏆 History Explorer', description: 'Score 80%+ on 5 quizzes', icon: '🏆' },
    { key: 'culture_enthusiast', name: '🎭 Culture Enthusiast', description: 'Visit 10 monuments', icon: '🎭' }
  ];
  for (const b of badges) await Badge.updateOne({ key: b.key }, { $set: b }, { upsert: true });
  console.log('Badges seeded'); process.exit(0);
}
run();
