function detectStudyAnomaly(sessions, config = {}) {
  const maxDurationMinutes = config.maxDurationMinutes || 600;
  const minGapMinutes = config.minGapMinutes || 1;
  if (!sessions || sessions.length === 0) {
    return { anomalyScore: 0, flaggedIndices: [], reasons: [] };
  }
  const flaggedIndices = [];
  const reasons = [];
  const seenTimestamps = new Map();
  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    const ts = session.timestamp;
    const dur = session.durationMinutes;
    if (seenTimestamps.has(ts)) {
      flaggedIndices.push(i);
      reasons.push(`Duplicate timestamp at index ${i}`);
    } else {
      seenTimestamps.set(ts, i);
    }
    if (dur > maxDurationMinutes) {
      flaggedIndices.push(i);
      reasons.push(`Duration ${dur} exceeds max ${maxDurationMinutes} at index ${i}`);
    }
    if (i > 0) {
      const prevTs = new Date(sessions[i - 1].timestamp).getTime();
      const currTs = new Date(ts).getTime();
      const gapMinutes = (currTs - prevTs) / 60000;
      if (gapMinutes < minGapMinutes && gapMinutes >= 0) {
        flaggedIndices.push(i);
        reasons.push(`Overlapping session at index ${i} (gap ${gapMinutes.toFixed(2)} min < ${minGapMinutes} min)`);
      }
    }
  }
  const uniqueFlagged = [...new Set(flaggedIndices)];
  const anomalyScore = sessions.length > 0 ? Math.min(1, uniqueFlagged.length / sessions.length) : 0;
  return { anomalyScore, flaggedIndices: uniqueFlagged, reasons };
}
module.exports = { detectStudyAnomaly };