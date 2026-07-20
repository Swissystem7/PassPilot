function analyzeWeakTopicsFromQuiz(quizResults, topicMapping) {
  if (topicMapping === null || topicMapping === undefined) {
    throw new Error("topicMapping is null or undefined");
  }
  if (!Array.isArray(quizResults) || quizResults.length === 0) {
    return [];
  }
  const lastCorrectMap = new Map();
  for (const result of quizResults) {
    if (result && Object.prototype.hasOwnProperty.call(topicMapping, result.questionId)) {
      lastCorrectMap.set(result.questionId, result.isCorrect === true);
    }
  }
  const stats = new Map();
  for (const [questionId, correct] of lastCorrectMap) {
    const topic = topicMapping[questionId];
    if (typeof topic !== 'string') continue;
    const value = stats.get(topic) || { correct: 0, total: 0 };
    if (correct) value.correct++;
    value.total++;
    stats.set(topic, value);
  }
  const result = [];
  for (const [topic, value] of stats) {
    result.push({ topic, strength: value.correct / value.total });
  }
  return result;
}
module.exports = { analyzeWeakTopicsFromQuiz };
