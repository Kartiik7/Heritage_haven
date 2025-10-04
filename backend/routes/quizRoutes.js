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

// routes
router.get('/:monumentId', authMiddleware, quizCtrl.getQuestions);
router.post('/:monumentId/submit', authMiddleware, quizCtrl.submitQuiz);

module.exports = router;
