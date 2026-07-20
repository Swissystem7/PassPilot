function calculateResilienceScore(sectionResults) {
  if (!Array.isArray(sectionResults)) throw new Error("Input must be an array");
  if (sectionResults.length === 0) return { resilienceScore: 0, staminaTrend: "unknown", recommendations: [] };
  for (let i = 0; i < sectionResults.length; i++) {
    const sr = sectionResults[i];
    if (!Number.isFinite(sr.sectionNumber) || !Number.isFinite(sr.score) || !Number.isFinite(sr.maxScore)) throw new Error("Non-numeric input");
    if (sr.maxScore <= 0) throw new Error("maxScore must be positive");
    if (sr.score < 0) throw new Error("score must be non-negative");
    if (sr.sectionNumber < 1 || !Number.isInteger(sr.sectionNumber)) throw new Error("sectionNumber must be positive integer");
  }
  const sorted = [...sectionResults].sort((a, b) => a.sectionNumber - b.sectionNumber);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].sectionNumber !== i + 1) throw new Error("sectionNumber must be sequential starting at 1");
  }
  const normalizedScores = sorted.map(sr => Math.min(1, sr.score / sr.maxScore));
  const avgNormalized = normalizedScores.reduce((a, b) => a + b, 0) / normalizedScores.length;
  let resilienceScore = avgNormalized * 100;
  let staminaTrend = "stable";
  const recommendations = [];
  if (sorted.length === 1) {
    return { resilienceScore: Math.round(resilienceScore * 100) / 100, staminaTrend: "stable", recommendations: ["Practice more sections to assess stamina"] };
  }
  const firstTwoAvg = (normalizedScores[0] + normalizedScores[1]) / 2;
  let penalty = 0;
  let significantDropCount = 0;
  for (let i = 2; i < normalizedScores.length; i++) {
    if (normalizedScores[i] < firstTwoAvg * 0.8) {
      significantDropCount++;
      penalty += 10;
    }
  }
  resilienceScore = Math.max(0, resilienceScore - penalty);
  if (significantDropCount > 0) {
    staminaTrend = "declining";
    recommendations.push("Take a 5-minute break between sections");
    recommendations.push("Practice full-length mock exams");
    recommendations.push("Review time management");
  } else {
    const allIncreasing = normalizedScores.every((val, idx, arr) => idx === 0 || val >= arr[idx - 1]);
    if (allIncreasing && normalizedScores.length > 1) {
      staminaTrend = "increasing";
    }
  }
  if (staminaTrend === "stable" && significantDropCount === 0) {
    if (normalizedScores.length >= 3) {
      const variance = normalizedScores.reduce((sum, val) => sum + Math.pow(val - avgNormalized, 2), 0) / normalizedScores.length;
      if (variance < 0.01) staminaTrend = "stable";
    }
  }
  if (recommendations.length === 0 && staminaTrend === "increasing") {
    recommendations.push("Maintain your current pacing strategy");
  } else if (recommendations.length === 0 && staminaTrend === "stable") {
    recommendations.push("Practice more sections to assess stamina");
  }
  return { resilienceScore: Math.round(resilienceScore * 100) / 100, staminaTrend, recommendations };
}
module.exports = { calculateResilienceScore };
