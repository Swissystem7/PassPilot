const streaks = new Map();

function parseDate(value, field) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid ${field} format`);
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (date.toISOString().slice(0, 10) !== value) throw new Error(`Invalid ${field} format`);
  return date;
}

function trackStudyStreak(userId, activityDate, lastActivityDate) {
  if (typeof userId !== 'string' || !userId.trim()) throw new Error('Invalid userId');
  const activity = parseDate(activityDate, 'activityDate');
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (activity > today) throw new Error('activityDate cannot be in the future');

  const stored = streaks.get(userId);
  if (lastActivityDate === null) {
    const state = { streak: 1, longestStreak: Math.max(1, stored?.longestStreak || 0), lastDate: activityDate };
    streaks.set(userId, state);
    return { streak: state.streak, longestStreak: state.longestStreak, isStreakAlive: true, daysUntilReset: 1 };
  }

  const last = parseDate(lastActivityDate, 'lastActivityDate');
  const diffDays = Math.round((activity - last) / 86400000);
  if (diffDays < 0) throw new Error('activityDate cannot be before lastActivityDate');

  const priorStreak = stored && stored.lastDate === lastActivityDate ? stored.streak : 1;
  const priorLongest = stored?.longestStreak || priorStreak;
  if (diffDays === 0) {
    return { streak: priorStreak, longestStreak: priorLongest, isStreakAlive: true, daysUntilReset: 1 };
  }
  const streak = diffDays === 1 ? priorStreak + 1 : 1;
  const state = { streak, longestStreak: Math.max(priorLongest, streak), lastDate: activityDate };
  streaks.set(userId, state);
  return { streak, longestStreak: state.longestStreak, isStreakAlive: diffDays === 1, daysUntilReset: diffDays === 1 ? 1 : 0 };
}

module.exports = { trackStudyStreak };
