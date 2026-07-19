function inferWeakTopicsFromMinimalQuiz(questions, answers) {
  if (!questions || questions.length === 0) return [];
  const topicMap = new Map();
  const order = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q || !q.topic || q.topic.trim() === '') continue;
    const topic = q.topic.trim();
    if (!topicMap.has(topic)) {
      topicMap.set(topic, { totalScore: 0, count: 0, correctCount: 0, wrongCount: 0, unansweredCount: 0 });
      order.push(topic);
    }
    const entry = topicMap.get(topic);
    entry.count++;
    const ans = Array.isArray(answers) ? answers[i] : null;
    if (ans === null || ans === undefined) {
      entry.totalScore += 1;
      entry.unansweredCount++;
    } else if (ans === q.correctAnswer) {
      entry.totalScore += 0;
      entry.correctCount++;
    } else {
      entry.totalScore += 1;
      entry.wrongCount++;
    }
  }
  if (order.length === 0) return [];
  const result = order.map(topic => {
    const entry = topicMap.get(topic);
    const weaknessScore = entry.count > 0 ? entry.totalScore / entry.count : 0;
    let confidence;
    if (entry.count === 0) {
      confidence = 0;
    } else if (entry.correctCount === entry.count) {
      confidence = 1;
    } else if (entry.unansweredCount === entry.count || entry.wrongCount === entry.count) {
      confidence = 0.5;
    } else {
      const consistency = entry.correctCount / entry.count;
      const countFactor = Math.min(entry.count / 5, 1);
      confidence = 0.5 + 0.5 * consistency * countFactor;
    }
    return { topic, weaknessScore, confidence };
  });
  result.sort((a, b) => b.weaknessScore - a.weaknessScore);
  return result;
}
module.exports = { inferWeakTopicsFromMinimalQuiz };
