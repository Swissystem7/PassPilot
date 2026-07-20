function getUpsellRecommendations(userId, weakTopics, mockExamAvgScore, budget) {
  const catalog = [
    { upsellId: "tutoring_math", upsellName: "Math Tutoring", baseLift: 15, cost: 50 },
    { upsellId: "tutoring_science", upsellName: "Science Tutoring", baseLift: 12, cost: 45 },
    { upsellId: "analytics_advanced", upsellName: "Advanced Analytics", baseLift: 20, cost: 80 },
    { upsellId: "writing_lab", upsellName: "Writing Lab", baseLift: 10, cost: 35 },
    { upsellId: "test_strategy", upsellName: "Test Strategy Workshop", baseLift: 18, cost: 60 },
    { upsellId: "flashcards_premium", upsellName: "Premium Flashcards", baseLift: 8, cost: 25 },
    { upsellId: "study_planner", upsellName: "AI Study Planner", baseLift: 14, cost: 40 },
    { upsellId: "group_tutoring", upsellName: "Group Tutoring", baseLift: 11, cost: 30 }
  ];

  if (!Number.isFinite(budget) || budget <= 0) return [];

  const topics = !Array.isArray(weakTopics) || weakTopics.length === 0 ? ["general"] : weakTopics.filter(t => typeof t === 'string');

  const recommendations = [];

  for (const item of catalog) {
    if (item.cost > budget) continue;
    const topicMatch = topics.some(t => item.upsellName.toLowerCase().includes(t.toLowerCase()) || t === "general");
    if (!topicMatch) continue;

    let predictedScoreLift = item.baseLift;
    if (Number.isFinite(mockExamAvgScore) && mockExamAvgScore < 50) predictedScoreLift += 5;
    else if (mockExamAvgScore < 70) predictedScoreLift += 3;

    if (predictedScoreLift > 100) predictedScoreLift = 100;

    const roi = predictedScoreLift / item.cost;

    recommendations.push({
      upsellId: item.upsellId,
      upsellName: item.upsellName,
      predictedScoreLift,
      cost: item.cost,
      roi
    });
  }

  recommendations.sort((a, b) => b.roi - a.roi);
  return recommendations;
}

module.exports = { getUpsellRecommendations };
