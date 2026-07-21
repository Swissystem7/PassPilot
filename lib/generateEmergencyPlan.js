function generateEmergencyPlan(userId, daysUntilExam, currentMastery) {
  if (typeof userId !== 'string' || userId.trim().length === 0) {
    throw new Error('Invalid userId');
  }
  const days = Number.isInteger(daysUntilExam) && daysUntilExam > 0 ? daysUntilExam : 0;
  if (days === 0) {
    return { topics: [], totalTimeMinutes: 0 };
  }
  if (!currentMastery || typeof currentMastery !== 'object' || Array.isArray(currentMastery) || Object.keys(currentMastery).length === 0) {
    return { topics: [], totalTimeMinutes: 0 };
  }
  const topicIds = Object.keys(currentMastery).filter(id => id && Number.isFinite(currentMastery[id]) && currentMastery[id] >= 0 && currentMastery[id] <= 1);
  if (topicIds.length === 0) return { topics: [], totalTimeMinutes: 0 };
  const allHigh = topicIds.every(tid => currentMastery[tid] >= 0.9);
  if (allHigh) {
    return { topics: [], totalTimeMinutes: 0 };
  }
  const maxStudyMinutesPerDay = 120;
  const totalAvailableMinutes = days * maxStudyMinutesPerDay;
  const lowMastery = topicIds.filter(tid => currentMastery[tid] < 0.9);
  const sorted = lowMastery.sort((a, b) => currentMastery[a] - currentMastery[b]);
  const topics = [];
  let allocated = 0;
  for (const tid of sorted) {
    const deficit = 1 - currentMastery[tid];
    const baseTime = Math.ceil(deficit * 120);
    const timeMinutes = Math.min(baseTime, totalAvailableMinutes - allocated);
    if (timeMinutes <= 0) break;
    const priority = currentMastery[tid] < 0.5 ? 'high' : currentMastery[tid] < 0.75 ? 'medium' : 'low';
    topics.push({ topicId: tid, timeMinutes, priority });
    allocated += timeMinutes;
    if (allocated >= totalAvailableMinutes) break;
  }
  return { topics, totalTimeMinutes: allocated };
}
module.exports = { generateEmergencyPlan };
