function trackReferralRedemption(referralCode, refereeId, signupStatus) {
  const validStatuses = ['pending', 'completed', 'expired'];
  if (!validStatuses.includes(signupStatus)) {
    throw new Error('Invalid signup status');
  }
  if (typeof refereeId !== 'string' || !refereeId.trim()) throw new Error('Invalid refereeId');
  const storage = globalThis.__passPilotReferralStorage || (globalThis.__passPilotReferralStorage = { codes: new Map(), users: new Map(), usedReferees: new Set() });
  const referral = storage.codes.get(referralCode);
  if (!referral) {
    return { rewardGranted: false, rewardAmount: 0, message: 'Invalid referral code' };
  }
  if (referral.expiration.getTime() < Date.now()) {
    return { rewardGranted: false, rewardAmount: 0, message: 'Referral code expired' };
  }
  if (referral.currentUses >= referral.maxUses) {
    return { rewardGranted: false, rewardAmount: 0, message: 'Referral code already fully used' };
  }
  if (storage.usedReferees.has(refereeId)) {
    return { rewardGranted: false, rewardAmount: 0, message: 'Referee already used a referral' };
  }
  if (signupStatus === 'pending' || signupStatus === 'expired') {
    return { rewardGranted: false, rewardAmount: 0, message: 'Referral not completed' };
  }
  const rewardMap = { bronze: 3, silver: 7, gold: 14 };
  const rewardAmount = rewardMap[referral.rewardTier] || 0;
  referral.currentUses += 1;
  storage.usedReferees.add(refereeId);
  return { rewardGranted: true, rewardAmount: rewardAmount, message: 'Reward granted' };
}

module.exports = { trackReferralRedemption };
