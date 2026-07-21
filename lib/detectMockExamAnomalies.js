function detectMockExamAnomalies(answerEvents, timeLimitMs, avgResponseMs) {
  if (!Array.isArray(answerEvents) || answerEvents.length === 0) {
    return new Error('NoEvents');
  }
  if (!Number.isInteger(timeLimitMs) || timeLimitMs < 100 || !Number.isInteger(avgResponseMs) || avgResponseMs <= 0) {
    return new Error('InvalidTimeLimit');
  }
  if (answerEvents.some((event, index) => !event || typeof event !== 'object' || typeof event.timestamp !== 'number' || !Number.isFinite(event.timestamp) || (index > 0 && event.timestamp < answerEvents[index - 1].timestamp))) {
    return new Error('InvalidEvents');
  }
  const n = answerEvents.length;
  const responseTimes = [];
  const interArrivals = [];
  let changedCount = 0;
  const startedAt = answerEvents[0].timestamp;
  let lastElapsed = 0;
  for (let i = 0; i < n; i++) {
    const event = answerEvents[i];
    const elapsed = Math.min(Math.max(0, event.timestamp - startedAt), timeLimitMs);
    const responseTime = i === 0 ? avgResponseMs : elapsed - lastElapsed;
    responseTimes.push(responseTime);
    if (i > 0) interArrivals.push(responseTime);
    lastElapsed = elapsed;
    if (event.isChanged) changedCount++;
  }
  const flags = [];
  let tooFastCount = 0;
  const fastThreshold = avgResponseMs * 0.2;
  for (let i = 0; i < n; i++) {
    if (responseTimes[i] < fastThreshold) tooFastCount++;
  }
  if (tooFastCount / n > 0.3) {
    flags.push('too_fast_many');
  }
  const changeRatio = changedCount / n;
  const lateThreshold = timeLimitMs * 0.9;
  let lateChanges = 0;
  for (let i = 0; i < n; i++) {
    const elapsed = Math.min(Math.max(0, answerEvents[i].timestamp - startedAt), timeLimitMs);
    if (answerEvents[i].isChanged && elapsed >= lateThreshold) {
      lateChanges++;
    }
  }
  if (changeRatio > 0.2 && lateChanges > 0) {
    flags.push('late_changes');
  }
  if (interArrivals.length > 1) {
    const mean = interArrivals.reduce((a, b) => a + b, 0) / interArrivals.length;
    const variance = interArrivals.reduce((sum, val) => sum + (val - mean) ** 2, 0) / interArrivals.length;
    const stdDev = Math.sqrt(variance);
    if (stdDev > 3 * mean) {
      flags.push('burst_pattern');
    }
  }
  const riskScore = Math.min(flags.length / 3, 1);
  return { riskScore, flags };
}
module.exports = { detectMockExamAnomalies };
