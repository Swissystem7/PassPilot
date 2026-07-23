function analyzeQuickDiagnostic(answers, examConfig) {
  if (!Array.isArray(answers) || answers.length === 0) {
    throw new Error("Answers array cannot be empty");
  }
  if (!examConfig || !Array.isArray(examConfig.topics)) {
    throw new TypeError("examConfig.topics must be an array");
  }
  const topicMap = new Map();
  for (const topic of examConfig.topics) {
    if (!topic || !Number.isFinite(topic.id) || typeof topic.name !== 'string') continue;
    topicMap.set(topic.id, { name: topic.name, correct: 0, total: 0 });
  }
  for (const answer of answers) {
    const data = answer && topicMap.get(answer.questionId);
    if (!data) {
      console.warn(`Warning: QuestionId ${answer.questionId} not found in examConfig.topics, skipping`);
      continue;
    }
    data.total++;
    if (answer.selectedAnswer === "correct") {
      data.correct++;
    }
  }
  const weakTopics = [];
  for (const topic of examConfig.topics) {
    const data = topicMap.get(topic && topic.id);
    if (!data) continue;
    if (data.total === 0) continue;
    const scoreRatio = data.correct / data.total;
    const confidence = 1 - scoreRatio;
    weakTopics.push({ topicId: topic.id, confidence: confidence });
  }
  weakTopics.sort((a, b) => a.confidence - b.confidence);
  let immediateAction;
  if (weakTopics.length === 0) {
    immediateAction = "Great start! Proceed to full mock.";
  } else if (weakTopics.every(w => w.confidence === 1)) {
    immediateAction = `Focus on basics of ${topicMap.get(weakTopics[0].topicId).name}`;
  } else if (weakTopics.every(w => w.confidence === 0)) {
    immediateAction = "Great start! Proceed to full mock.";
  } else {
    const weakest = weakTopics[weakTopics.length - 1];
    immediateAction = `Review ${topicMap.get(weakest.topicId).name}`;
  }
  return { weakTopics, immediateAction };
}
module.exports = { analyzeQuickDiagnostic };
