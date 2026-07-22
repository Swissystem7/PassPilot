function generateWeakTopicUpsell(weakTopicScores, userTier, purchaseHistory) {
  if (!Array.isArray(weakTopicScores) || !Array.isArray(purchaseHistory) || !['free', 'basic', 'premium'].includes(userTier)) return [];
  if (weakTopicScores.length === 0) return [];
  if (userTier === 'premium') return [];
  const upsells = {
    'free': [
      { itemName: 'Deep Dive Module', price: 19.99, expectedImprovement: 25 },
      { itemName: 'Advanced Practice Pack', price: 29.99, expectedImprovement: 35 },
      { itemName: 'Mastery Bundle', price: 49.99, expectedImprovement: 50 }
    ],
    'basic': [
      { itemName: 'Premium Deep Dive', price: 14.99, expectedImprovement: 20 },
      { itemName: 'Expert Coaching Session', price: 24.99, expectedImprovement: 30 }
    ]
  };
  const available = upsells[userTier] || [];
  if (available.length === 0) return [];
  const purchaseSet = new Set(purchaseHistory.filter(id => typeof id === 'string'));
  const sorted = weakTopicScores
    .filter(t => t && typeof t.topicId === 'string' && Number.isFinite(t.score) && t.score >= 0 && t.score <= 100 && !purchaseSet.has(t.topicId))
    .slice()
    .sort((a, b) => a.score - b.score);
  if (sorted.length === 0) return [];
  const result = [];
  for (let i = 0; i < Math.min(sorted.length, available.length); i++) {
    const topic = sorted[i];
    const upsell = available[i % available.length];
    result.push({
      topicId: topic.topicId,
      itemName: upsell.itemName,
      price: upsell.price,
      expectedImprovement: upsell.expectedImprovement
    });
  }
  return result;
}
module.exports = { generateWeakTopicUpsell };
