function generateFirstDayPlan(weakTopics, dailyHours, examDate) {
  if (!Number.isFinite(dailyHours) || dailyHours <= 0) dailyHours = 2;
  const wasCapped = dailyHours > 16;
  if (dailyHours > 16) {
    dailyHours = 16;
  }
  const now = new Date();
  const exam = typeof examDate === 'string' ? new Date(examDate + (examDate.length === 10 ? 'T00:00:00Z' : '')) : new Date(NaN);
  const diffTime = exam.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isPast = diffDays < 0;
  const daysLeft = isPast ? 0 : diffDays;
  const isWithin7 = daysLeft <= 7;
  const sessionType = isWithin7 ? 'practice' : 'revision';
  const totalMinutes = Math.floor(dailyHours * 60);
  let sessions = [];
  let note = '';
  if (wasCapped) {
    note = 'Daily hours capped at 16';
  }
  if (isPast) {
    note = (note ? note + '; ' : '') + 'Intensive plan: all practice';
  }
  if (isWithin7 && !isPast) {
    note = (note ? note + '; ' : '') + 'Mock exam recommended';
  }
  const filteredTopics = Array.isArray(weakTopics)
    ? weakTopics.filter(t => typeof t === 'string' && t.trim() !== '').map(t => t.trim())
    : [];
  if (filteredTopics.length === 0) {
    sessions.push({
      topic: 'General review',
      durationMinutes: totalMinutes,
      type: sessionType
    });
  } else {
    const numTopics = filteredTopics.length;
    let baseMinutes = Math.floor(totalMinutes / numTopics);
    let remainder = totalMinutes - baseMinutes * numTopics;
    for (let i = 0; i < numTopics; i++) {
      let duration = baseMinutes;
      if (remainder > 0) {
        duration += 1;
        remainder--;
      }
      sessions.push({
        topic: filteredTopics[i],
        durationMinutes: duration,
        type: sessionType
      });
    }
  }
  let totalSessionsMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  if (totalSessionsMinutes > totalMinutes) {
    const diff = totalSessionsMinutes - totalMinutes;
    sessions[sessions.length - 1].durationMinutes -= diff;
  } else if (totalSessionsMinutes < totalMinutes) {
    const diff = totalMinutes - totalSessionsMinutes;
    sessions[sessions.length - 1].durationMinutes += diff;
  }
  return {
    plan: {
      sessions: sessions,
      totalMinutes: totalMinutes,
      note: note
    }
  };
}
module.exports = { generateFirstDayPlan };
