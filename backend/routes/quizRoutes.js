const express = require('express');
const router = express.Router();
const { generateQuiz, evaluateQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateQuiz);
router.post('/evaluate', protect, evaluateQuiz);

module.exports = router;
