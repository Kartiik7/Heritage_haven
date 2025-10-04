// backend/routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const quizCtrl = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

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

router.get('/:monumentId', validateMonumentId, authMiddleware.protect, quizCtrl.getQuestions);
router.post('/:monumentId/submit', validateMonumentId, validateQuizSubmission, authMiddleware.protect, quizCtrl.submitQuiz);

module.exports = router;
