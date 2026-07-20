function generateDailyStudyPlan(examDate, weeklyStudyHours, currentTopicRanks) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate);
  if (typeof examDate !== 'string' || Number.isNaN(exam.getTime())) throw new Error('Invalid examDate');
  exam.setHours(0, 0, 0, 0);

  if (exam < today) throw new Error("examDate is in the past");
  if (!Number.isFinite(weeklyStudyHours) || weeklyStudyHours <= 0) throw new Error("weeklyStudyHours must be positive");
  if (!Array.isArray(currentTopicRanks) || currentTopicRanks.length === 0) return [];
  if (currentTopicRanks.some(t => !t || typeof t.topic !== 'string' || !Number.isFinite(t.score))) throw new Error('Invalid topic rank');

  const totalDays = Math.floor((exam - today) / (1000 * 60 * 60 * 24)) + 1;
  const totalMinutesAvailable = Math.round(weeklyStudyHours * 60 * totalDays / 7);

  const totalWeakness = currentTopicRanks.reduce((sum, t) => sum + (1 - t.score), 0);
  const tasksByTopic = currentTopicRanks.map(t => ({
    topic: t.topic,
    durationMinutes: totalWeakness === 0 ? Math.floor(totalMinutesAvailable / currentTopicRanks.length) : Math.round(totalMinutesAvailable * (1 - t.score) / totalWeakness)
  }));

  const totalAllocated = tasksByTopic.reduce((s, t) => s + t.durationMinutes, 0);
  let diff = totalMinutesAvailable - totalAllocated;
  let idx = 0;
  while (diff !== 0) {
    if (diff > 0) {
      tasksByTopic[idx % tasksByTopic.length].durationMinutes++;
      diff--;
    } else {
      if (tasksByTopic[idx % tasksByTopic.length].durationMinutes > 0) {
        tasksByTopic[idx % tasksByTopic.length].durationMinutes--;
        diff++;
      }
    }
    idx++;
  }

  const plan = [];
  for (let d = 0; d < totalDays; d++) {
    const day = new Date(today);
    day.setDate(day.getDate() + d);
    const dayStr = day.toISOString().split('T')[0];
    const tasks = tasksByTopic.map(t => ({
      topic: t.topic,
      durationMinutes: Math.round(t.durationMinutes / totalDays)
    }));
    const dayTotal = tasks.reduce((s, t) => s + t.durationMinutes, 0);
    let dayDiff = Math.round(totalMinutesAvailable / totalDays) - dayTotal;
    let i = 0;
    while (dayDiff !== 0) {
      if (dayDiff > 0) {
        tasks[i % tasks.length].durationMinutes++;
        dayDiff--;
      } else {
        if (tasks[i % tasks.length].durationMinutes > 0) {
          tasks[i % tasks.length].durationMinutes--;
          dayDiff++;
        }
      }
      i++;
    }
    plan.push({ day: dayStr, tasks: tasks.filter(t => t.durationMinutes > 0) });
  }

  return plan;
}

module.exports = { generateDailyStudyPlan };
