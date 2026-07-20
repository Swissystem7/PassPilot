function computeImprovementTrend(scores) {
  if (!Array.isArray(scores) || scores.length === 0 || scores.some(s => !Number.isFinite(s))) {
    throw new Error('Invalid input');
  }
  if (scores.length === 1) {
    return { trend: 'stable', avgDelta: 0, encouragement: 'Just starting – keep it up!' };
  }
  let totalDelta = 0;
  for (let i = 1; i < scores.length; i++) {
    totalDelta += scores[i] - scores[i - 1];
  }
  const avgDelta = totalDelta / (scores.length - 1);
  let trend;
  if (avgDelta > 2) {
    trend = 'improving';
  } else if (avgDelta < -2) {
    trend = 'declining';
  } else {
    trend = 'stable';
  }
  let encouragement;
  if (trend === 'improving') {
    encouragement = 'Great progress – keep pushing!';
  } else if (trend === 'declining') {
    encouragement = 'Don’t give up – review and try again!';
  } else {
    encouragement = 'You’re on track – stay consistent!';
  }
  return { trend, avgDelta, encouragement };
}
module.exports = { computeImprovementTrend };
