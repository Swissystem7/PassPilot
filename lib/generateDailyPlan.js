function generateDailyPlan(params) {
  if (!params || typeof params !== 'object') return null;
  const { examDate, targetScore, currentConfidence, availableHoursPerWeek } = params;
  if (typeof examDate !== 'string' ||
      !Number.isFinite(targetScore) ||
      !Number.isFinite(currentConfidence) ||
      !Number.isFinite(availableHoursPerWeek)) return null;
  const exam = new Date(examDate);
  if (Number.isNaN(exam.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  exam.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((exam - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 7 || isNaN(diffDays)) return null;
  if (targetScore < 0 || targetScore > 100) return null;
  if (currentConfidence < 0 || currentConfidence > 1) return null;
  if (availableHoursPerWeek <= 0) return null;

  const topics = ["Math", "Science", "History", "English", "Geography", "Logic", "Vocabulary"];
  const totalMinutes = Math.round(availableHoursPerWeek * 60);
  const sessionsPerDay = Math.max(1, Math.floor(totalMinutes / (7 * 30)));
  const minutesPerSession = Math.max(1, Math.floor(totalMinutes / (7 * sessionsPerDay)));

  const result = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(now);
    day.setDate(day.getDate() + i);
    const sessions = [];
    for (let j = 0; j < sessionsPerDay; j++) {
      const topic = topics[(i * sessionsPerDay + j) % topics.length];
      sessions.push({ topic, durationMinutes: minutesPerSession });
    }
    result.push({ day: day.toISOString().split('T')[0], sessions });
  }
  return result;
}

module.exports = { generateDailyPlan };
