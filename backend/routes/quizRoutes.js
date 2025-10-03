// backend/routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const quizCtrl = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:monumentId', authMiddleware, quizCtrl.getQuestions);      // allow only logged users
router.post('/:monumentId/submit', authMiddleware, quizCtrl.submitQuiz);

module.exports = router;
