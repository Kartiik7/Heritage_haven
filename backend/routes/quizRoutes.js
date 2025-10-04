// backend/routes/quizRoutes.js
const express = require('express');
const router = express.Router();

// controller with named exports (object with functions)
const quizCtrl = require('../controllers/quizController');

// require your auth middleware — handle both export patterns below
let authMiddleware = require('../middleware/authMiddleware');
// if authMiddleware was exported as { authMiddleware: fn }, use the property
if (authMiddleware && typeof authMiddleware !== 'function' && authMiddleware.authMiddleware) {
  authMiddleware = authMiddleware.authMiddleware;
}

// If authMiddleware is still not a function, set to a no-op permissive middleware (fallback)
if (typeof authMiddleware !== 'function') {
  console.warn('Warning: authMiddleware is not a function — using permissive middleware for now.');
  authMiddleware = (req, res, next) => { next(); };
}

// Validation middleware for monumentId
const validateMonumentId = (req, res, next) => {
  const { monumentId } = req.params;
  if (!monumentId || monumentId.trim() === '') {
    return res.status(400).json({ error: 'Monument ID is required' });
  }
  next();
};

// Validation middleware for quiz submission
const validateQuizSubmission = (req, res, next) => {
  const { answers } = req.body;
  
  if (!answers) {
    return res.status(400).json({ error: 'Answers are required' });
  }
  
  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'Answers must be an array' });
  }
  
  if (answers.length === 0) {
    return res.status(400).json({ error: 'At least one answer is required' });
  }
  
  // Validate each answer object
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    if (!answer.questionId) {
      return res.status(400).json({ error: `Question ID is required for answer ${i + 1}` });
    }
    if (typeof answer.chosenIndex !== 'number' || answer.chosenIndex < 0) {
      return res.status(400).json({ error: `Valid chosen index is required for answer ${i + 1}` });
    }
  }
  
  next();
};

// routes
router.get('/:monumentId', validateMonumentId, authMiddleware, quizCtrl.getQuestions);
router.post('/:monumentId/submit', validateMonumentId, validateQuizSubmission, authMiddleware, quizCtrl.submitQuiz);

module.exports = router;
