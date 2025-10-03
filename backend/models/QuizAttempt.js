// backend/models/QuizAttempt.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizAttemptSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  monumentId: { type: String, required: true },
  score: { type: Number, required: true },
  correctCount: Number,
  total: Number,
  passed: Boolean,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
