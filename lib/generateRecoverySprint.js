const { randomUUID } = require('node:crypto');

const records = {
  users: {
    "user1": { missedDays: {}, recoveredDays: {} },
    "user2": { missedDays: { "2025-03-20": true }, recoveredDays: {} },
    "user3": { missedDays: { "2025-03-20": true }, recoveredDays: { "2025-03-20": true } }
  },
  sprints: []
};

function generateRecoverySprint(userId, missedDate) {
  const user = records.users[userId];
  if (!user) return { error: 'user_not_found' };
  if (typeof missedDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(missedDate)) return { error: 'invalid_date' };
  const missed = new Date(missedDate + 'T00:00:00Z');
  if (Number.isNaN(missed.getTime()) || missed.toISOString().slice(0, 10) !== missedDate) return { error: 'invalid_date' };
  if (missedDate > new Date().toISOString().slice(0, 10)) return { error: 'future_date' };
  if (!user.missedDays[missedDate]) return { isAlreadyRecovered: true };
  if (user.recoveredDays[missedDate]) return { isAlreadyRecovered: true };
  const sprintId = randomUUID();
  const types = ['quick_quiz', 'mini_exercise', 'watch_video'];
  const type = types[Math.floor(Math.random() * types.length)];
  const durations = { quick_quiz: 5, mini_exercise: 10, watch_video: 15 };
  const estimatedDurationMinutes = durations[type];
  const completionCriteria = 'complete_' + type + '_session';
  records.sprints.push({ sprintId, userId, missedDate, type });
  return {
    sprintId: sprintId,
    type: type,
    estimatedDurationMinutes: estimatedDurationMinutes,
    completionCriteria: completionCriteria,
    isAlreadyRecovered: false
  };
}
module.exports = { generateRecoverySprint };
