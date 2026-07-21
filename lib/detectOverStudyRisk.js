function detectOverStudyRisk(dailyLogs, maxRecommendedHours = 8, performanceTrend = []) {
  if (!Array.isArray(dailyLogs) || !Array.isArray(performanceTrend) || !Number.isFinite(maxRecommendedHours) || maxRecommendedHours <= 0) {
    throw new TypeError('Invalid input');
  }
  const normalized = dailyLogs.map(log => {
    if (!log || typeof log.date !== 'string' || !Number.isFinite(log.hours) || log.hours < 0 || Number.isNaN(Date.parse(log.date))) throw new TypeError('Invalid daily log');
    return { ...log, time: Date.parse(log.date) };
  }).sort((a,b) => a.time-b.time);
  const recentLogs = normalized.slice(-7);
  const availableDays = recentLogs.length;
  const totalHours = recentLogs.reduce((sum, log) => sum + log.hours, 0);
  const recentAvgHours = availableDays > 0 ? totalHours / availableDays : 0;
  const daysExceedingMax = recentLogs.filter(log => log.hours > maxRecommendedHours).length;
  let performanceChange = null;
  if (performanceTrend.length > 0) {
    const validScores = performanceTrend.filter(p => p && p.score !== null && Number.isFinite(p.score) && !Number.isNaN(Date.parse(p.date)));
    if (validScores.length >= 6) {
      const sorted = [...validScores].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
      const lastThree = sorted.slice(-3).map(p => p.score);
      const prevThree = sorted.slice(-6, -3).map(p => p.score);
      if (lastThree.length === 3 && prevThree.length === 3) {
        performanceChange = (lastThree.reduce((s, v) => s + v, 0) / 3) - (prevThree.reduce((s, v) => s + v, 0) / 3);
      }
    }
  }
  let riskLevel = 'low';
  let suggestion = 'Your study load appears balanced. Keep up the good habits.';
  if (recentAvgHours > 1.2 * maxRecommendedHours || daysExceedingMax > 4) {
    riskLevel = 'high';
    suggestion = 'Warning: Your study hours are significantly exceeding safe limits. Please take immediate steps to reduce workload and prioritize rest to avoid burnout.';
  } else if (recentAvgHours > maxRecommendedHours) {
    riskLevel = 'medium';
    suggestion = 'Caution: Your average study hours are above the recommended maximum. Consider adjusting your schedule to prevent overexertion.';
  }
  if (availableDays < 7) {
    suggestion += ' Note: Analysis based on fewer than 7 days of data; results may be less reliable.';
  }
  return {
    riskLevel,
    suggestion,
    metrics: {
      recentAvgHours: Math.round(recentAvgHours * 100) / 100,
      daysExceedingMax,
      performanceChange: performanceChange !== null ? Math.round(performanceChange * 100) / 100 : null
    }
  };
}
module.exports = { detectOverStudyRisk };
