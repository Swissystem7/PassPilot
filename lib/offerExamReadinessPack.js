function offerExamReadinessPack(mockExamScore, maxScore, currentPassProb, userTier) {
  if (userTier === 'premium') return null;
  if (!Number.isFinite(mockExamScore)) return null;
  if (!Number.isFinite(maxScore) || maxScore <= 0) return null;
  if (!Number.isFinite(currentPassProb)) return null;
  if (userTier !== 'free' && userTier !== 'basic') return null;
  if (mockExamScore < 0 || mockExamScore > 100) return null;
  if (currentPassProb < 0 || currentPassProb > 1) return null;
  if (currentPassProb >= 0.7) return null;
  let price = 29.99;
  if (currentPassProb < 0.3) {
    price = price * 0.8;
  }
  return {
    offerValid: true,
    packageName: "Exam Readiness Pack",
    price: Math.round(price * 100) / 100,
    features: [
      "Detailed weak-area breakdown",
      "Personalized study plan",
      "Priority support"
    ]
  };
}
module.exports = { offerExamReadinessPack };
