function matchStudyBuddy(currentUserId, candidateUsers) {
  if (!Array.isArray(candidateUsers) || candidateUsers.length === 0) {
    return { matchedUserId: null, matchScore: 0 };
  }
  const currentUser = candidateUsers.find(u => u.userId === currentUserId);
  if (!currentUser) {
    return { matchedUserId: null, matchScore: 0 };
  }
  const parseDate = value => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const date = new Date(`${value}T00:00:00.000Z`);
    return date.toISOString().slice(0, 10) === value ? date : null;
  };
  const currentDate = parseDate(currentUser.examDate);
  const currentHour = currentUser.activeHour;
  if (!currentDate) throw new Error('Invalid examDate');
  if (!Number.isInteger(currentHour) || currentHour < 0 || currentHour > 23) {
    throw new Error("activeHour out of range");
  }
  const candidates = candidateUsers.filter(u => u.userId !== currentUserId);
  if (candidates.length === 0) {
    return { matchedUserId: null, matchScore: 0 };
  }
  const validCandidates = [];
  for (const c of candidates) {
    if (!Number.isInteger(c.activeHour) || c.activeHour < 0 || c.activeHour > 23) {
      throw new Error("activeHour out of range");
    }
    const cDate = parseDate(c.examDate);
    if (!cDate) throw new Error('Invalid examDate');
    const diffDays = Math.round((cDate - currentDate) / (1000 * 60 * 60 * 24));
    if (Math.abs(diffDays) <= 7) {
      validCandidates.push(c);
    }
  }
  if (validCandidates.length === 0) {
    return { matchedUserId: null, matchScore: 0 };
  }
  const sameDateCandidates = validCandidates.filter(c => c.examDate === currentUser.examDate);
  let bestCandidate;
  if (sameDateCandidates.length > 0) {
    let minDiff = Infinity;
    for (const c of sameDateCandidates) {
      const diff = Math.abs(c.activeHour - currentHour);
      if (diff < minDiff) {
        minDiff = diff;
        bestCandidate = c;
      }
    }
  } else {
    let minDiff = Infinity;
    for (const c of validCandidates) {
      const diff = Math.abs(c.activeHour - currentHour);
      if (diff < minDiff) {
        minDiff = diff;
        bestCandidate = c;
      }
    }
  }
  if (!bestCandidate) {
    return { matchedUserId: null, matchScore: 0 };
  }
  const score = 100 - Math.abs(bestCandidate.activeHour - currentHour) - Math.abs(new Date(bestCandidate.examDate) - currentDate) / (1000 * 60 * 60 * 24);
  return { matchedUserId: bestCandidate.userId, matchScore: Math.max(0, score) };
}
module.exports = { matchStudyBuddy };
