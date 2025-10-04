// backend/controllers/quizController.js
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const { evaluateAndAwardBadges } = require('../utils/badges');

exports.getQuestions = async (req, res) => {
  try {
    const { monumentId } = req.params;
    
    const qs = await Question.find({ monumentId }).lean();
    
    if (!qs || qs.length === 0) {
      return res.status(404).json({ 
        error: 'No questions found for this monument',
        monumentId 
      });
    }
    
    const clientQs = qs.map(q => ({ 
      _id: q._id, 
      text: q.text, 
      options: q.options 
    }));
    
    res.json(clientQs);
  } catch (err) {
    console.error('Error fetching quiz questions:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid monument ID format',
        monumentId: req.params.monumentId 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error while fetching questions' 
    });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { monumentId } = req.params;
    const { answers } = req.body; // [{ questionId, chosenIndex }]
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User authentication required' });
    }
    
    const userId = req.user.id;

    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    
    if (questions.length === 0) {
      return res.status(404).json({ 
        error: 'No valid questions found for the provided question IDs',
        providedIds: questionIds 
      });
    }
    
    // Check if all provided question IDs exist
    const foundQuestionIds = questions.map(q => String(q._id));
    const invalidQuestionIds = questionIds.filter(id => !foundQuestionIds.includes(String(id)));
    
    if (invalidQuestionIds.length > 0) {
      return res.status(400).json({
        error: 'Some question IDs are invalid',
        invalidQuestionIds
      });
    }

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

    // Update user with quiz attempt
    const user = await User.findByIdAndUpdate(
      userId, 
      { $push: { quizAttempts: attempt._id } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const awarded = await evaluateAndAwardBadges(userId);
    
    res.json({ 
      attempt: {
        _id: attempt._id,
        score: attempt.score,
        correctCount: attempt.correctCount,
        total: attempt.total,
        passed: attempt.passed,
        monumentId: attempt.monumentId
      }, 
      awarded 
    });
  } catch (err) {
    console.error('Error submitting quiz:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid ID format in request',
        details: err.message 
      });
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: Object.keys(err.errors).map(key => ({
          field: key,
          message: err.errors[key].message
        }))
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error while submitting quiz' 
    });
  }
};
