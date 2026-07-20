function predictReturnProbability(userId, missedDays, priorStreakLength, avgSessionMinutes) {
  if (typeof userId !== 'string' || userId.length === 0) {
    throw new Error('userId must be a non-empty string');
  }
  if (![missedDays, priorStreakLength, avgSessionMinutes].every(Number.isFinite)) throw new Error('Invalid numeric input');
  missedDays = Math.floor(missedDays);
  priorStreakLength = Math.floor(priorStreakLength);
  if (missedDays < 0) missedDays = 0;
  if (priorStreakLength < 0) priorStreakLength = 0;
  if (avgSessionMinutes < 0) avgSessionMinutes = 0;
  const decay = Math.exp(-0.3 * missedDays);
  const streakBoost = Math.min(priorStreakLength / 30, 1) * 0.3;
  const engagementBoost = Math.min(avgSessionMinutes / 20, 1) * 0.2;
  let prob = 0.5 * decay + streakBoost + engagementBoost;
  if (prob > 1) prob = 1;
  if (prob < 0) prob = 0;
  return prob;
}
module.exports = { predictReturnProbability };
