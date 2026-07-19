const { createHash } = require('node:crypto');

function getAccountabilityPartnerProgress(userId) {
  const pairingTable = {
    user1: { partnerId: 'user2', active: true },
    user2: { partnerId: 'user1', active: true },
    user3: { partnerId: null, active: true },
    user4: { partnerId: 'user5', active: false },
  };

  const sessionLogs = {
    user1: { completedSessions: 5, totalSessions: 6, lastActiveDate: '2025-03-20' },
    user2: { completedSessions: 2, totalSessions: 5, lastActiveDate: '2025-03-19' },
    user3: { completedSessions: 0, totalSessions: 0, lastActiveDate: '2025-03-18' },
    user5: { completedSessions: 7, totalSessions: 8, lastActiveDate: '2025-03-21' },
  };

  const userPair = pairingTable[userId];
  if (!userPair || !userPair.active) {
    return { partnerFound: false };
  }

  const partnerId = userPair.partnerId;
  if (!partnerId) {
    return { partnerFound: false, matchPending: true, nudgeMessage: 'Finding your study buddy...' };
  }

  if (partnerId === userId) {
    return { error: 'self_match' };
  }

  const partnerPair = pairingTable[partnerId];
  if (!partnerPair || !partnerPair.active) {
    return { partnerFound: false, nudgeMessage: 'Partner left' };
  }

  const partnerData = sessionLogs[partnerId];
  const partnerAnonId = createHash('sha256').update(partnerId).digest('hex').slice(0, 12);
  if (!partnerData) {
    return {
      partnerAnonId,
      partnerWeekProgress: { completedSessions: 0, totalSessions: 0, lastActiveDate: '' },
      nudgeMessage: null,
      partnerFound: true,
    };
  }

  const { completedSessions, totalSessions, lastActiveDate } = partnerData;
  let nudgeMessage = null;
  if (totalSessions > 0) {
    const completionRate = completedSessions / totalSessions;
    if (completionRate < 0.5) {
      nudgeMessage = 'Your partner is falling behind – stay strong!';
    } else if (completionRate > 0.8) {
      nudgeMessage = 'Your partner is crushing it! Keep the momentum!';
    }
  }

  return {
    partnerAnonId,
    partnerWeekProgress: { completedSessions, totalSessions, lastActiveDate },
    nudgeMessage,
    partnerFound: true,
  };
}

module.exports = { getAccountabilityPartnerProgress };
