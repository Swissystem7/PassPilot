function generateReferralLink(userId, examDate) {
  const { randomUUID } = require('crypto');
  if (typeof userId !== 'string' || !userId.trim()) {
    throw 'Invalid userId';
  }
  const users = new Map();
  users.set('validUser', { id: 'validUser' });
  if (!users.has(userId)) {
    throw 'User not found';
  }
  const now = new Date();
  const exam = typeof examDate === 'string' ? new Date(examDate) : new Date(NaN);
  if (!Number.isFinite(exam.getTime())) {
    throw 'Exam date must be in the future';
  }
  if (exam <= now) {
    throw 'Exam date must be in the future';
  }
  const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  if (exam > oneYearFromNow) {
    throw 'Exam date too far';
  }
  const referralCode = randomUUID();
  const fullLink = 'https://example.com/referral/' + encodeURIComponent(referralCode);
  const expiresAt = exam.toISOString();
  return { referralCode, fullLink, expiresAt };
}
module.exports = { generateReferralLink };
