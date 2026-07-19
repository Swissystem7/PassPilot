function computeMockTrend(scores, minDataPoints) {
  if (!Array.isArray(scores) || !scores.every(Number.isFinite) || !Number.isInteger(minDataPoints) || minDataPoints < 1) throw new TypeError('invalid input');
  if (scores.length < minDataPoints) {
    return { trend: 'insufficient_data', slope: null, rSquared: null, predictedNextScore: null };
  }
  const n = scores.length;
  if (n < 2) {
    return { trend: 'insufficient_data', slope: null, rSquared: null, predictedNextScore: null };
  }
  let sumX = 0, sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += scores[i];
  }
  const meanX = sumX / n;
  const meanY = sumY / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    const dx = i - meanX;
    const dy = scores[i] - meanY;
    num += dx * dy;
    den += dx * dx;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    const pred = slope * i + intercept;
    const res = scores[i] - pred;
    ssRes += res * res;
    const totDev = scores[i] - meanY;
    ssTot += totDev * totDev;
  }
  const rSquared = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);
  const predictedNextScore = slope * n + intercept;
  let trend;
  if (slope > 0.01) {
    trend = 'improving';
  } else if (slope < -0.01) {
    trend = 'declining';
  } else {
    trend = 'plateau';
  }
  return { trend, slope, rSquared, predictedNextScore };
}
module.exports = { computeMockTrend };
