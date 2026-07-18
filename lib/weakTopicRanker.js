function weakTopicRanker(results) {
  if (!Array.isArray(results)) throw new TypeError("Input must be an array");
  if (results.length === 0) return [];
  const valid = results.filter(r => r && typeof r.topic === 'string' && r.topic !== '' && Number.isFinite(r.secondsSpent) && r.secondsSpent >= 0);
  if (valid.length === 0) return [];
  const topicMap = new Map();
  for (const r of valid) {
    if (!topicMap.has(r.topic)) topicMap.set(r.topic, { total: 0, wrong: 0, totalSeconds: 0 });
    const d = topicMap.get(r.topic);
    d.total++;
    if (!r.correct) d.wrong++;
    d.totalSeconds += r.secondsSpent;
  }
  let maxAvg = 0;
  const topics = [];
  for (const [topic, d] of topicMap) {
    const avgSeconds = d.totalSeconds / d.total;
    if (avgSeconds > maxAvg) maxAvg = avgSeconds;
    topics.push({ topic, total: d.total, wrong: d.wrong, avgSeconds });
  }
  const resultsArr = topics.map(t => {
    const errorRate = t.total === 0 ? 0 : t.wrong / t.total;
    const normalizedAvgSeconds = maxAvg === 0 ? 0 : t.avgSeconds / maxAvg;
    const score = errorRate * 0.7 + normalizedAvgSeconds * 0.3;
    return {
      topic: t.topic,
      score: Math.round(score * 1000) / 1000,
      attempts: t.total,
      errorRate: Math.round(errorRate * 1000) / 1000
    };
  });
  resultsArr.sort((a, b) => b.score - a.score || (a.topic < b.topic ? -1 : 1));
  return resultsArr;
}
module.exports = { weakTopicRanker };
