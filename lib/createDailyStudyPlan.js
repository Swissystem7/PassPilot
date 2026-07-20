function createDailyStudyPlan(availableMinutes, topicScores) {
  if (typeof availableMinutes !== 'number' || availableMinutes < 0 || !Number.isInteger(availableMinutes)) {
    throw new Error('Invalid availableMinutes');
  }
  if (availableMinutes === 0) return [];
  if (!topicScores || typeof topicScores !== 'object' || Array.isArray(topicScores)) throw new Error('Invalid topicScores');
  const topics = Object.keys(topicScores);
  if (topics.length === 0) return [];
  for (const t of topics) {
    if (!Number.isFinite(topicScores[t]) || topicScores[t] < 0 || topicScores[t] > 100) {
      throw new Error('Invalid topic score');
    }
  }
  const allHundred = topics.every(t => topicScores[t] === 100);
  if (allHundred) {
    const equal = Math.floor(availableMinutes / topics.length);
    const remainder = availableMinutes % topics.length;
    return topics.map((topic, i) => ({ topic, minutes: equal + (i < remainder ? 1 : 0) }));
  }
  const inverseScores = topics.map(t => 101 - topicScores[t]);
  const totalInverse = inverseScores.reduce((a, b) => a + b, 0);
  let remaining = availableMinutes;
  const result = topics.map((topic, i) => {
    const raw = (inverseScores[i] / totalInverse) * availableMinutes;
    const minutes = Math.floor(raw);
    remaining -= minutes;
    return { topic, minutes };
  });
  let idx = 0;
  while (remaining > 0) {
    result[idx % result.length].minutes += 1;
    remaining -= 1;
    idx += 1;
  }
  return result;
}
module.exports = { createDailyStudyPlan };
