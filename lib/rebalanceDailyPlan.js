function rebalanceDailyPlan(currentPlan, mockResults, totalStudyMinutes) {
  if (!Array.isArray(currentPlan) || currentPlan.length === 0) return [];
  const resultMap = {};
  if (!Array.isArray(mockResults) || !Number.isFinite(totalStudyMinutes) || totalStudyMinutes < 0) throw new Error('Invalid input');
  for (const r of mockResults) if (r && typeof r.topic === 'string' && Number.isFinite(r.score)) resultMap[r.topic] = r.score;
  const adjusted = [];
  for (const item of currentPlan) {
    if (!item || !Number.isFinite(item.minutes) || item.minutes < 0) throw new Error('Negative minutes');
    const score = resultMap[item.topic];
    let newMinutes = item.minutes;
    let priority = 'medium';
    if (score === undefined) {
      priority = 'medium';
    } else if (score === 100) {
      newMinutes = Math.floor(item.minutes / 2);
      priority = 'low';
    } else if (score < 50) {
      priority = 'high';
    } else if (score < 80) {
      priority = 'medium';
    } else {
      priority = 'low';
    }
    adjusted.push({ topic: item.topic, minutes: newMinutes, priority });
  }
  let total = adjusted.reduce((sum, a) => sum + a.minutes, 0);
  if (total > totalStudyMinutes && total > 0) {
    const scale = totalStudyMinutes / total;
    for (const a of adjusted) {
      a.minutes = Math.floor(a.minutes * scale);
    }
  }
  return adjusted;
}
module.exports = { rebalanceDailyPlan };
