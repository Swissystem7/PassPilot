function calibratePassProbability(examHistory, targetProb, confidenceLevel = 0.95) {
  const warnings = [];
  if (!examHistory || examHistory.length === 0) {
    return { calibratedProb: 0, ciLower: 0, ciUpper: 0, calibrationError: 1, warnings: ['No data'] };
  }
  let clampedTarget = Number.isFinite(targetProb) ? Math.max(0, Math.min(1, targetProb)) : 0;
  let cl = confidenceLevel;
  if (!Number.isFinite(cl) || cl <= 0 || cl >= 1) cl = 0.95;
  const filtered = [];
  for (let i = 0; i < examHistory.length; i++) {
    const entry = examHistory[i];
    if (typeof entry !== 'object' || entry === null) continue;
    let { topic, score, timeSpent } = entry;
    if (typeof score !== 'number' || isNaN(score)) continue;
    if (typeof timeSpent !== 'number' || isNaN(timeSpent) || timeSpent < 0) continue;
    if (score < 0) score = 0;
    if (score > 100) score = 100;
    filtered.push({ topic: String(topic), score: score / 100, timeSpent });
  }
  if (filtered.length === 0) {
    return { calibratedProb: 0, ciLower: 0, ciUpper: 0, calibrationError: 1, warnings: ['No valid data after filtering'] };
  }
  const n = filtered.length;
  const scores = filtered.map(e => e.score);
  const meanScore = scores.reduce((a, b) => a + b, 0) / n;
  const variance = scores.reduce((sum, s) => sum + (s - meanScore) ** 2, 0) / (n - 1 || 1);
  const std = Math.sqrt(variance);
  const z = cl === 0.95 ? 1.96 : cl === 0.99 ? 2.576 : cl === 0.9 ? 1.645 : 1.96;
  const se = std / Math.sqrt(n);
  const calibratedProb = Math.max(0, Math.min(1, meanScore));
  let ciLower = Math.max(0, meanScore - z * se);
  let ciUpper = Math.min(1, meanScore + z * se);
  const calibrationError = Math.abs(meanScore - clampedTarget);
  if (calibrationError > 0.1) warnings.push('Calibration error exceeds 0.1');
  if (n < 30) warnings.push('Small sample size may affect reliability');
  return { calibratedProb, ciLower, ciUpper, calibrationError, warnings };
}
module.exports = { calibratePassProbability };
