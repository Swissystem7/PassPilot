function computeRetentionDiscount(student) {
  if (!student) return null;
  const daysSinceSignup = Number.isFinite(student.daysSinceSignup) ? Math.max(0, student.daysSinceSignup) : 0;
  if (daysSinceSignup <= 0) return null;
  const daysUntilExam = Number.isFinite(student.daysUntilExam) ? Math.max(0, student.daysUntilExam) : 0;
  if (daysUntilExam < 7) return null;
  if (student.subscriptionTier === 'annual') return null;
  const avgStudySessionsPerWeek = Number.isFinite(student.avgStudySessionsPerWeek) ? Math.max(0, student.avgStudySessionsPerWeek) : 0;
  const passProbability = Number.isFinite(student.passProbability) ? Math.max(0, Math.min(1, student.passProbability)) : 0;
  const lastActiveDate = new Date(student.lastActiveDate);
  const now = new Date();
  const daysSinceLastActive = Math.floor((now - lastActiveDate) / (1000 * 60 * 60 * 24));
  let discountPercent = 0;
  let shouldOffer = false;
  if (daysSinceLastActive > 30) {
    discountPercent = 20;
    shouldOffer = true;
  } else if (avgStudySessionsPerWeek < 1) {
    discountPercent = 15;
    shouldOffer = true;
  } else if (passProbability > 0.9) {
    discountPercent = 5;
    shouldOffer = true;
  } else {
    discountPercent = 10;
    shouldOffer = true;
  }
  const offerExpiryDays = 7;
  return { shouldOffer, discountPercent, offerExpiryDays };
}
module.exports = { computeRetentionDiscount };
