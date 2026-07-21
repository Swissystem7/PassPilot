function calculateReferralReward(referrerId, refereeId, refereeAction) {
  if (referrerId === null || refereeId === null) return null;
  if (typeof referrerId !== 'string' || typeof refereeId !== 'string') return null;
  if (referrerId.trim() === '' || refereeId.trim() === '') return null;
  if (referrerId === refereeId) return null;
  const validActions = ['signup', 'first_mock', 'first_payment'];
  if (!validActions.includes(refereeAction)) return null;
  const state = calculateReferralReward._state || (calculateReferralReward._state = new Map());
  const key = refereeId + ':' + refereeAction;
  if (state.has(key)) return null;
  state.set(key, true);
  if (refereeAction === 'signup') return { rewardCents: 100, rewardType: 'credit' };
  if (refereeAction === 'first_mock') return { rewardCents: 200, rewardType: 'credit' };
  if (refereeAction === 'first_payment') return { rewardCents: 500, rewardType: 'discount' };
  return null;
}
module.exports = { calculateReferralReward };
