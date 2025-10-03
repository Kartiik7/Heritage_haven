// backend/controllers/quizController.js
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const { evaluateAndAwardBadges } = require('../utils/badges');

exports.getQuestions = async (req, res) => {
  try {
    const { monumentId } = req.params;
    const qs = await Question.find({ monumentId }).lean();
    const clientQs = qs.map(q => ({ _id: q._id, text: q.text, options: q.options }));
    res.json(clientQs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server' });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { monumentId } = req.params;
    const { answers } = req.body; // [{ questionId, chosenIndex }]
    if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });
    const userId = req.user.id;

    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    let correct = 0;
    questions.forEach(q => {
      const ans = answers.find(a => String(a.questionId) === String(q._id));
      if (!ans) return;
      if (ans.chosenIndex === q.correctIndex) correct++;
    });

    const total = questions.length || 1;
    const score = Math.round((correct / total) * 100);
    const passed = score >= 60;

    const attempt = await QuizAttempt.create({
      user: userId,
      monumentId,
      score,
      correctCount: correct,
      total,
      passed
    });

    await User.findByIdAndUpdate(userId, { $push: { quizAttempts: attempt._id } });

    const awarded = await evaluateAndAwardBadges(userId);
    res.json({ attempt, awarded });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server' });
  }
};
