function verifyStudySession(sessionData) {
  const cache = verifyStudySession._cache || (verifyStudySession._cache = new Map());
  const types = new Set(['click', 'scroll', 'keypress', 'focus', 'blur']);
  if (!sessionData || typeof sessionData !== 'object' || typeof sessionData.userId !== 'string' || !sessionData.userId.trim() || typeof sessionData.sessionId !== 'string' || !sessionData.sessionId.trim() || !Array.isArray(sessionData.events) || sessionData.events.some(e => !e || !types.has(e.type) || !Number.isFinite(e.timestamp))) {
    throw new Error('InvalidInput');
  }
  const cacheKey = sessionData.userId + ':' + sessionData.sessionId;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  const { events } = sessionData;
  if (events.length === 0) {
    const result = { valid: false, score: 0, reason: 'No events recorded' };
    cache.set(cacheKey, result);
    return result;
  }
  const nonBlurEvents = events.filter(e => e.type !== 'blur');
  if (nonBlurEvents.length === 0) {
    const result = { valid: false, score: 0.2, reason: 'Tab was never focused' };
    cache.set(cacheKey, result);
    return result;
  }
  const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
  const firstTs = sorted[0].timestamp;
  const lastTs = sorted[sorted.length - 1].timestamp;
  const durationMs = lastTs - firstTs;
  const durationMin = durationMs / 60000;
  if (durationMin < 1 && nonBlurEvents.length >= 100) {
    const result = { valid: false, score: 0.1, reason: 'Suspicious high event rate in short session' };
    cache.set(cacheKey, result);
    return result;
  }
  let totalGapPenalty = 0;
  let gapCount = 0;
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i].timestamp - sorted[i-1].timestamp;
    if (gap > 300000) {
      totalGapPenalty += gap - 300000;
      gapCount++;
    }
  }
  const avgGapPenalty = gapCount > 0 ? totalGapPenalty / gapCount : 0;
  const interactionRate = durationMin > 0 ? nonBlurEvents.length / durationMin : nonBlurEvents.length;
  let score = Math.min(1, interactionRate / 2);
  if (avgGapPenalty > 0) {
    score *= Math.max(0.5, 1 - (avgGapPenalty / 600000));
  }
  score = Math.max(0, Math.min(1, score));
  const valid = score >= 0.3;
  let reason = null;
  if (!valid) {
    if (score < 0.1) reason = 'Very low interaction rate';
    else if (score < 0.2) reason = 'Insufficient engagement';
    else reason = 'Low engagement score';
  }
  const result = { valid, score: Math.round(score * 100) / 100, reason };
  cache.set(cacheKey, result);
  return result;
}
module.exports = { verifyStudySession };
