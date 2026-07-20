function optimalReferralReward(referrerId, referralCount_history, avgConversionRate_segment, cost_per_new_user) {
  if (!referrerId || typeof referrerId !== 'string' || referrerId.trim() === '') return null;
  if (!Number.isFinite(cost_per_new_user) || cost_per_new_user <= 0) return null;
  const effectiveConversion = !Number.isFinite(avgConversionRate_segment) || avgConversionRate_segment <= 0 ? 0.05 : avgConversionRate_segment;
  referralCount_history = Number.isFinite(referralCount_history) ? Math.max(0, referralCount_history) : 0;
  let rewardValue = cost_per_new_user * effectiveConversion * 0.3;
  if (referralCount_history >= 10) rewardValue *= 0.8;
  let rewardType = 'credit';
  if (rewardValue < 5) {
    rewardType = 'discountPercent';
    rewardValue = Math.round(rewardValue * 10) / 10;
  } else if (rewardValue < 20) {
    rewardType = 'freeDays';
    rewardValue = Math.round(rewardValue / 2);
  } else {
    rewardType = 'credit';
    rewardValue = Math.round(rewardValue * 100) / 100;
  }
  const estimatedNetRevenueLift = cost_per_new_user * effectiveConversion - rewardValue;
  return { rewardType, rewardValue, estimatedNetRevenueLift };
}
module.exports = { optimalReferralReward };
