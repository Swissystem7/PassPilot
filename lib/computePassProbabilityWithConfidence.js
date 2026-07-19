function computePassProbabilityWithConfidence(studyHistory, examDate, confidenceLevel) {
  const warnings = [];
  const examDateTime = new Date(examDate).getTime();
  const now = Date.now();
  if (!Number.isFinite(examDateTime) || examDateTime < now) {
    throw new Error('PastDate');
  }
  if (!Array.isArray(studyHistory)) throw new Error('InvalidInput');
  let confidence = Number.isFinite(confidenceLevel) ? confidenceLevel : 0.8;
  if (confidence < 0.8) confidence = 0.8;
  if (confidence > 0.99) confidence = 0.99;
  if (studyHistory.length === 0) {
    return {
      probability: 0,
      lowerBound: 0,
      upperBound: 0.5,
      warnings: ['No study data - probability is a guess']
    };
  }
  const topics = [...new Set(studyHistory.map(s => s.topic))];
  if (topics.length < 3) {
    warnings.push('Too few topics to reliably estimate variance');
  }
  const scores = studyHistory.map(s => s.quizScore);
  if (scores.some(s => !Number.isFinite(s))) throw new Error('InvalidInput');
  const allPerfect = scores.every(s => s === 100);
  if (allPerfect) {
    warnings.push('Perfect scores may indicate overconfidence or cheating');
    return {
      probability: 1,
      lowerBound: 0.99,
      upperBound: 1,
      warnings
    };
  }
  const n = scores.length;
  const mean = scores.reduce((a, b) => a + b, 0) / n;
  const variance = n === 1 ? 0 : scores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / (n - 1);
  const probability = mean / 100;
  if (variance === 0) {
    return {
      probability,
      lowerBound: probability,
      upperBound: probability,
      warnings
    };
  }
  const z = confidence === 0.8 ? 1.2816 : confidence === 0.85 ? 1.4400 : confidence === 0.9 ? 1.6449 : confidence === 0.95 ? 1.9600 : confidence === 0.99 ? 2.5758 : 1.6449;
  const se = Math.sqrt(variance / n) / 100;
  const margin = z * se;
  let lower = probability - margin;
  let upper = probability + margin;
  if (lower < 0) lower = 0;
  if (upper > 1) upper = 1;
  return {
    probability: Math.round(probability * 10000) / 10000,
    lowerBound: Math.round(lower * 10000) / 10000,
    upperBound: Math.round(upper * 10000) / 10000,
    warnings
  };
}
module.exports = { computePassProbabilityWithConfidence };
