function verifyStudyPlanSafety(plannedSessions, studentProfile) {
  const now = new Date();
  const maxDaily = studentProfile.maxDailyMinutes > 0 ? studentProfile.maxDailyMinutes : 480;
  const breakInterval = studentProfile.preferredBreakInterval > 0 ? studentProfile.preferredBreakInterval : 90;
  const examDate = new Date(studentProfile.examDate);
  const examPassed = examDate < now;
  const warnings = [];
  if (examPassed) warnings.push('exam passed');
  const filtered = plannedSessions.filter(s => {
    const d = new Date(s.date);
    return d >= now && s.durationMinutes > 0;
  });
  if (filtered.length === 0) {
    return { isSafe: true, safetyScore: 1, warnings, adjustedPlan: [] };
  }
  const dateMap = {};
  for (const s of filtered) {
    const key = s.date;
    if (!dateMap[key]) dateMap[key] = [];
    dateMap[key].push(s);
  }
  const adjustedPlan = [];
  let totalOver = 0;
  let totalMinutes = 0;
  for (const date in dateMap) {
    const sessions = dateMap[date];
    let total = 0;
    for (const s of sessions) total += s.durationMinutes;
    totalMinutes += total;
    if (total > maxDaily) {
      totalOver += total - maxDaily;
      const ratio = maxDaily / total;
      let remaining = maxDaily;
      const adjusted = [];
      for (const s of sessions) {
        let dur = Math.round(s.durationMinutes * ratio);
        if (dur > remaining) dur = remaining;
        if (dur > 0) {
          adjusted.push({ date: s.date, topic: s.topic, durationMinutes: dur });
          remaining -= dur;
        }
      }
      const breakCount = Math.floor(maxDaily / breakInterval);
      const breakTotal = breakCount * 15;
      if (breakTotal > 0) {
        let totalAdj = 0;
        for (const a of adjusted) totalAdj += a.durationMinutes;
        if (totalAdj + breakTotal > maxDaily) {
          const reduction = (totalAdj + breakTotal - maxDaily) / adjusted.length;
          for (let i = 0; i < adjusted.length; i++) {
            adjusted[i].durationMinutes = Math.max(0, adjusted[i].durationMinutes - Math.ceil(reduction));
          }
        }
      }
      adjustedPlan.push(...adjusted);
    } else {
      adjustedPlan.push(...sessions);
    }
  }
  const safetyScore = totalMinutes === 0 ? 1 : Math.max(0, 1 - (totalOver / totalMinutes));
  const isSafe = safetyScore >= 0.8;
  return { isSafe, safetyScore, warnings, adjustedPlan };
}
module.exports = { verifyStudyPlanSafety };