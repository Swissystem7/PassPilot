function calculateRescuePackOffer(streakDays, passProb, daysSinceLastStudy, userTier) {
  if (!Number.isFinite(streakDays) || !Number.isFinite(passProb) || !Number.isFinite(daysSinceLastStudy) || typeof userTier !== 'string') return null;
  if (streakDays < 0 || passProb < 0 || passProb > 1 || daysSinceLastStudy < 0) return null;
  if (!['free', 'basic', 'premium'].includes(userTier)) return null;
  if (streakDays === 0 || daysSinceLastStudy === 0 || userTier === 'premium') return null;
  let discountPercent = 20;
  if (passProb > 0.8) discountPercent = 10;
  if (streakDays >= 30) discountPercent = Math.min(discountPercent + 20, 100);
  else if (streakDays >= 7) discountPercent = Math.min(discountPercent + 10, 100);
  let itemType = 'mockExam';
  let basePrice = 9.99;
  if (userTier === 'basic') {
    itemType = 'topicDeepDive';
    basePrice = 4.99;
  } else if (userTier === 'free') {
    itemType = 'premiumDay';
    basePrice = 2.99;
  }
  const priceDiscounted = Math.round(basePrice * (1 - discountPercent / 100) * 100) / 100;
  return { offerValid: true, discountPercent, itemType, priceDiscounted };
}
module.exports = { calculateRescuePackOffer };
