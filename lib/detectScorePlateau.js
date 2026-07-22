function detectScorePlateau(scores) {
  if (!Array.isArray(scores) || scores.length < 3) {
    return { plateauDetected: false, plateauLength: 0, suggestion: "", error: "insufficient data" };
  }
  const n = Math.min(5, scores.length);
  const recent = scores.slice(-n);
  const validDate = /^\d{4}-\d{2}-\d{2}$/;
  const isValidEntry = s => {
    if (!s || !validDate.test(s.date) || !Number.isFinite(s.score)) return false;
    const date = new Date(`${s.date}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === s.date;
  };
  if (recent.some(s => !isValidEntry(s))) {
    return { plateauDetected: false, plateauLength: 0, suggestion: "", error: "invalid data" };
  }
  const dates = recent.map((_, i) => i);
  const values = recent.map(s => s.score);
  const meanX = dates.reduce((a, b) => a + b, 0) / n;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (dates[i] - meanX) * (values[i] - meanY);
    den += (dates[i] - meanX) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  let plateauDetected = false;
  let plateauLength = 0;
  let suggestion = "";
  let error = null;
  if (Math.abs(slope) <= 0.02) {
    let consecutiveCount = 1;
    let runStart = 0;
    let plateauStart = -1;
    let plateauEnd = -1;
    for (let i = 0; i < recent.length; i++) {
      if (i === 0) continue;
      const prevScore = recent[i - 1].score;
      const currScore = recent[i].score;
      const maxVal = Math.max(prevScore, currScore);
      const minVal = Math.min(prevScore, currScore);
      if (maxVal === 0) {
        if (prevScore === currScore) {
          consecutiveCount++;
          plateauEnd = i;
        } else {
          consecutiveCount = 1;
          runStart = i;
        }
      } else {
        if ((maxVal - minVal) / maxVal <= 0.05) {
          consecutiveCount++;
          plateauEnd = i;
        } else {
          consecutiveCount = 1;
          runStart = i;
        }
      }
      if (consecutiveCount >= 3) {
        plateauStart = runStart;
        plateauEnd = i;
      }
    }
    if (plateauEnd - plateauStart + 1 >= 3) {
      plateauDetected = true;
      const firstDate = new Date(`${recent[plateauStart].date}T00:00:00Z`);
      const lastDate = new Date(`${recent[plateauEnd].date}T00:00:00Z`);
      plateauLength = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    }
  }
  if (plateauDetected) {
    if (plateauLength > 30) {
      suggestion = "Consider a new study technique or switch topics.";
    } else if (plateauLength > 14) {
      suggestion = "Increase daily study time by 30 minutes.";
    } else {
      suggestion = "Keep pushing; small improvements expected.";
    }
  }
  return { plateauDetected, plateauLength, suggestion, error };
}
module.exports = { detectScorePlateau };
