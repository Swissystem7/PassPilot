function calculateInitialPassProbability(correctCount, totalQuestions, examDifficulty) {
  if (!Number.isInteger(totalQuestions) || totalQuestions <= 0) throw new Error("totalQuestions must be greater than 0");
  if (!Number.isInteger(correctCount)) throw new Error('correctCount must be an integer');
  if (correctCount < 0) throw new Error("correctCount cannot be negative");
  if (correctCount > totalQuestions) throw new Error("correctCount cannot exceed totalQuestions");
  if (!['easy', 'medium', 'hard'].includes(examDifficulty)) {
    console.warn("Invalid examDifficulty, defaulting to 'medium'");
    examDifficulty = 'medium';
  }
  if (correctCount === 0) return 0;
  const difficultyFactor = { easy: 1.0, medium: 0.8, hard: 0.6 }[examDifficulty];
  return (correctCount / totalQuestions) * difficultyFactor;
}
module.exports = { calculateInitialPassProbability };
