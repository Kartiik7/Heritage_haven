// backend/utils/badges.js
const User = require('../models/User');
const Badge = require('../models/Badge');
const QuizAttempt = require('../models/QuizAttempt');

async function evaluateAndAwardBadges(userId) {
  const user = await User.findById(userId).populate('badges');
  if (!user) return [];

  const currentKeys = (user.badges || []).map(b => b.key);
  const newlyAwarded = [];

  // History Explorer: score >= 80% on 5 quizzes
  if (!currentKeys.includes('history_explorer')) {
    const highCount = await QuizAttempt.countDocuments({ user: userId, score: { $gte: 80 } });
    if (highCount >= 5) {
      const badge = await Badge.findOne({ key: 'history_explorer' });
      if (badge) { user.badges.push(badge._id); newlyAwarded.push(badge); }
    }
  }

  // Culture Enthusiast: visited 10 monuments
  if (!currentKeys.includes('culture_enthusiast')) {
    const visited = (user.visitedMonuments || []).length;
    if (visited >= 10) {
      const badge = await Badge.findOne({ key: 'culture_enthusiast' });
      if (badge) { user.badges.push(badge._id); newlyAwarded.push(badge); }
    }
  }

  if (newlyAwarded.length) await user.save();
  return newlyAwarded;
}

module.exports = { evaluateAndAwardBadges };
