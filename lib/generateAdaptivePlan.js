function generateAdaptivePlan(userHistory, examDate, today) {
  if (typeof examDate !== 'string' || typeof today !== 'string') throw new Error("Invalid input types");
  const exam = new Date(examDate);
  const todayDate = new Date(today);
  if (isNaN(exam.getTime()) || isNaN(todayDate.getTime())) throw new Error("Invalid date format");
  if (exam <= todayDate) return [];
  if (!Array.isArray(userHistory)) throw new Error("userHistory must be an array");
  for (const entry of userHistory) {
    if (typeof entry.date !== 'string' || typeof entry.completedTopics !== 'number' || typeof entry.totalTimeMinutes !== 'number') throw new Error("Invalid entry types");
    if (!Number.isInteger(entry.completedTopics) || entry.completedTopics < 0) throw new Error("completedTopics must be non-negative integer");
    if (!Number.isInteger(entry.totalTimeMinutes) || entry.totalTimeMinutes < 0) throw new Error("totalTimeMinutes must be non-negative integer");
  }
  if (userHistory.length === 0) {
    return [
      { topicId: 'topic_1', estimatedMinutes: 30 },
      { topicId: 'topic_2', estimatedMinutes: 30 },
      { topicId: 'topic_3', estimatedMinutes: 30 }
    ];
  }
  const totalCompleted = userHistory.reduce((sum, e) => sum + e.completedTopics, 0);
  const totalTime = userHistory.reduce((sum, e) => sum + e.totalTimeMinutes, 0);
  const days = userHistory.length;
  const avgCompletionRate = totalCompleted / days;
  const avgTimePerTopic = totalCompleted > 0 ? totalTime / totalCompleted : 30;
  const daysUntilExam = Math.ceil((exam - todayDate) / (1000 * 60 * 60 * 24));
  let targetCount = Math.round(avgCompletionRate);
  if (daysUntilExam <= 30) {
    targetCount = Math.round(targetCount * 1.2);
  }
  targetCount = Math.max(1, Math.min(20, targetCount));
  const result = [];
  for (let i = 0; i < targetCount; i++) {
    result.push({
      topicId: `topic_${i + 1}`,
      estimatedMinutes: Math.round(avgTimePerTopic)
    });
  }
  return result;
}
module.exports = { generateAdaptivePlan };
