function generateCramSchedule(topicMastery, topicWeight, hoursUntilExam, studyHoursPerDay) {
  if (!Array.isArray(topicMastery) || !Array.isArray(topicWeight) || topicMastery.length !== topicWeight.length || !Number.isFinite(hoursUntilExam) || !Number.isFinite(studyHoursPerDay) || hoursUntilExam <= 0 || studyHoursPerDay <= 0 || !topicMastery.every(Number.isFinite) || !topicWeight.every(Number.isFinite)) {
    return [];
  }
  const n = topicMastery.length;
  if (n === 0) return [];
  let allHundred = true;
  for (let i = 0; i < n; i++) {
    if (topicMastery[i] < 100) { allHundred = false; break; }
  }
  if (allHundred) return [];
  const days = Math.ceil(hoursUntilExam / 24);
  const totalStudyTime = studyHoursPerDay * days;
  let urgencySum = 0;
  const urgencies = [];
  for (let i = 0; i < n; i++) {
    const mastery = Math.max(0, Math.min(100, topicMastery[i]));
    const weight = Math.max(0, topicWeight[i]);
    const urgency = (100 - mastery) * weight;
    urgencies.push(urgency);
    urgencySum += urgency;
  }
  if (urgencySum === 0) return [];
  const result = [];
  let allocatedSum = 0;
  for (let i = 0; i < n; i++) {
    const raw = (urgencies[i] / urgencySum) * totalStudyTime;
    const rounded = Math.round(raw * 10) / 10;
    result.push({ topicIndex: i, hoursToStudyPerDay: rounded });
    allocatedSum += rounded;
  }
  let diff = Math.round((totalStudyTime - allocatedSum) * 10) / 10;
  let idx = 0;
  while (Math.abs(diff) > 0.001 && idx < n) {
    const adjust = Math.round(diff * 10) / 10;
    result[idx].hoursToStudyPerDay = Math.round((result[idx].hoursToStudyPerDay + adjust) * 10) / 10;
    diff = 0;
    idx++;
  }
  result.sort((a, b) => {
    const urgencyA = (100 - Math.max(0, Math.min(100, topicMastery[a.topicIndex]))) * Math.max(0, topicWeight[a.topicIndex]);
    const urgencyB = (100 - Math.max(0, Math.min(100, topicMastery[b.topicIndex]))) * Math.max(0, topicWeight[b.topicIndex]);
    return urgencyB - urgencyA;
  });
  return result;
}
module.exports = { generateCramSchedule };
