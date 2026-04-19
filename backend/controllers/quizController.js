const { askGemini } = require('../service/geminiService');

const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty = 'mixed', numQuestions = 5, questionTypes = ['multiple_choice'] } = req.body;

    const prompt = `Generate a quiz about "${topic}" with ${numQuestions} questions at ${difficulty} difficulty level.

Requirements:
- Each question must be multiple choice with 4 options (A, B, C, D)
- Include the correct answer for each question
- Provide a brief explanation for why the answer is correct
- Format the response as a valid JSON object with this exact structure:

{
  "title": "Quiz about ${topic}",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": "q1",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is the correct answer"
    }
  ]
}

Only return the JSON object, no additional text.`;

    const aiResponse = await askGemini(prompt);
    
    // Parse the JSON response
    let quiz;
    try {
      // Try to extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/) || 
                        aiResponse.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
      quiz = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('Quiz JSON Parse Error:', parseError);
      return res.status(500).json({ message: 'Failed to parse quiz from AI response' });
    }

    res.json({ quiz });
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate quiz' });
  }
};

const evaluateQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    let correct = 0;
    const results = answers.map(answer => {
      const isCorrect = answer.selected === answer.correct;
      if (isCorrect) correct++;
      return {
        questionId: answer.questionId,
        selected: answer.selected,
        correct: answer.correct,
        isCorrect
      };
    });

    const score = Math.round((correct / answers.length) * 100);
    const passed = score >= 70;

    res.json({
      quizId,
      score,
      correct,
      total: answers.length,
      passed,
      results
    });
  } catch (error) {
    console.error('Quiz Evaluation Error:', error);
    res.status(500).json({ message: error.message || 'Failed to evaluate quiz' });
  }
};

module.exports = { generateQuiz, evaluateQuiz };
