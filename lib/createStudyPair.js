const { randomUUID } = require('crypto');
const activePairs = [];

function createStudyPair(user1Id, user2Id, startDate, endDate, studyMinutesPerDay) {
  const errors = [];
  if (typeof user1Id !== 'string' || !user1Id.trim() || typeof user2Id !== 'string' || !user2Id.trim()) errors.push("Invalid or missing userId");
  if (user1Id === user2Id) errors.push("Cannot pair a user with themselves");
  if (typeof startDate !== 'string' || isNaN(Date.parse(startDate))) errors.push("Invalid or missing startDate");
  if (typeof endDate !== 'string' || isNaN(Date.parse(endDate))) errors.push("Invalid or missing endDate");
  if (errors.length === 0 && new Date(startDate) > new Date(endDate)) errors.push("startDate must be before endDate");
  if (!Number.isFinite(studyMinutesPerDay) || studyMinutesPerDay <= 0) errors.push("studyMinutesPerDay must be a positive number");
  if (errors.length > 0) return { pairId: '', status: 'active', errors };
  const overlapping = activePairs.some(p => 
    (p.user1Id === user1Id || p.user2Id === user1Id || p.user1Id === user2Id || p.user2Id === user2Id) &&
    p.status === 'active' &&
    new Date(p.startDate) <= new Date(endDate) &&
    new Date(p.endDate) >= new Date(startDate)
  );
  if (overlapping) return { pairId: '', status: 'overlap', errors: [] };
  const pairId = randomUUID();
  const now = new Date();
  const status = now > new Date(endDate) ? 'expired' : 'active';
  activePairs.push({ pairId, user1Id, user2Id, startDate, endDate, status });
  return { pairId, status, errors: [] };
}
module.exports = { createStudyPair };
