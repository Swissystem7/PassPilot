function quickPassProbability(confidence, daysUntilExam) {
  if (!Number.isFinite(confidence) || !Number.isFinite(daysUntilExam) ||
      confidence < 0 || confidence > 1 || daysUntilExam < 0) return null;
  const days = Math.trunc(daysUntilExam);
  const baseProb = 0.2 + 0.6 * confidence;
  const dayFactor = Math.min(days / 30, 1) * 0.1;
  const probability = Math.min(Math.max(baseProb + dayFactor, 0), 1);
  let message;
  if (probability < 0.4) message = 'You need more work';
  else if (probability < 0.7) message = 'Keep going!';
  else message = 'You are on track!';
  return { probability, message };
}
module.exports = { quickPassProbability };
