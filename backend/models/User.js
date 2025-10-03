const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  searchHistory: { type: [String], default: [] },
  visitedSites: [{
    site: { type: Schema.Types.ObjectId, ref: 'HeritageSite', required: true },
    visitedAt: { type: Date, default: Date.now }
  }],
  badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
  quizAttempts: [{ type: Schema.Types.ObjectId, ref: 'QuizAttempt' }],
  visitedMonuments: [{ type: String }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  refreshTokens: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
