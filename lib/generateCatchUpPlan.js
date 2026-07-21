function generateCatchUpPlan(userId, missedDays, currentSchedule, examDate) {
  if (typeof userId !== 'string' || userId.trim() === '') throw new Error('Invalid userId');
  if (!Number.isInteger(missedDays) || missedDays < 0) missedDays = 0;
  if (!Array.isArray(currentSchedule)) throw new Error('Invalid schedule');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exam = new Date(examDate);
  if (!Number.isFinite(exam.getTime())) return { adjustedSchedule: [], canComplete: false };
  exam.setHours(0, 0, 0, 0);
  if (exam <= now) return { adjustedSchedule: [], canComplete: false };
  if (!currentSchedule || currentSchedule.length === 0) return { adjustedSchedule: [], canComplete: true };
  if (missedDays === 0) return { adjustedSchedule: currentSchedule.map(day => ({ ...day, topics: Array.isArray(day.topics) ? day.topics.map(topic => ({ ...topic })) : [] })), canComplete: true };
  const daysRemaining = Math.ceil((exam - now) / (1000 * 60 * 60 * 24));
  if (missedDays > daysRemaining) {
    const allTopics = [];
    for (const day of currentSchedule) {
      for (const topic of Array.isArray(day.topics) ? day.topics : []) {
        allTopics.push(topic);
      }
    }
    allTopics.sort((a, b) => b.timeMinutes - a.timeMinutes);
    const packed = [];
    let dayIndex = 0;
    for (let i = 0; i < allTopics.length; i++) {
      if (!packed[dayIndex]) packed[dayIndex] = { day: dayIndex, topics: [] };
      packed[dayIndex].topics.push(allTopics[i]);
      if (packed[dayIndex].topics.length >= 3) dayIndex++;
    }
    return { adjustedSchedule: packed, canComplete: false };
  }
  const totalDays = currentSchedule.length;
  const totalMinutes = currentSchedule.reduce((sum, d) => sum + (Array.isArray(d.topics) ? d.topics : []).reduce((s, t) => s + (Number.isFinite(t.timeMinutes) && t.timeMinutes > 0 ? t.timeMinutes : 0), 0), 0);
  const newDays = daysRemaining;
  const minutesPerDay = Math.floor(totalMinutes / newDays);
  const allTopics = [];
  for (const day of currentSchedule) {
    for (const topic of Array.isArray(day.topics) ? day.topics : []) {
      if (topic && typeof topic.topicId === 'string' && Number.isFinite(topic.timeMinutes) && topic.timeMinutes > 0) allTopics.push({ ...topic });
    }
  }
  const adjustedSchedule = [];
  let topicIndex = 0;
  for (let d = 0; d < newDays; d++) {
    const dayTopics = [];
    let dayMinutes = 0;
    while (topicIndex < allTopics.length && dayMinutes + allTopics[topicIndex].timeMinutes <= minutesPerDay + 5) {
      const t = allTopics[topicIndex];
      dayTopics.push(t);
      dayMinutes += t.timeMinutes;
      topicIndex++;
    }
    if (topicIndex < allTopics.length && dayTopics.length === 0) {
      dayTopics.push(allTopics[topicIndex]);
      topicIndex++;
    }
    adjustedSchedule.push({ day: d, topics: dayTopics });
  }
  while (topicIndex < allTopics.length) {
    adjustedSchedule[adjustedSchedule.length - 1].topics.push(allTopics[topicIndex]);
    topicIndex++;
  }
  return { adjustedSchedule, canComplete: true };
}
module.exports = { generateCatchUpPlan };
