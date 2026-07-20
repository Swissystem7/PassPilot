function detectSuspiciousBehavior(events, thresholds) {
  if (!Array.isArray(events) || events.length === 0) {
    return { suspicious: false, reasons: [], severity: 'low' };
  }
  const validTypes = new Set(['tabBlur', 'tabFocus', 'copyPaste', 'rightClick']);
  const filtered = events.filter(e => e && validTypes.has(e.eventType) && Number.isFinite(e.timestamp));
  if (filtered.length === 0) {
    return { suspicious: false, reasons: [], severity: 'low' };
  }
  const sorted = filtered.slice().sort((a, b) => a.timestamp - b.timestamp);
  const now = sorted[sorted.length - 1].timestamp;
  const maxBlurs = thresholds && Number.isFinite(thresholds.maxBlurs) ? thresholds.maxBlurs : 0;
  const maxCopies = thresholds && Number.isFinite(thresholds.maxCopies) ? thresholds.maxCopies : 0;
  const windowMs = thresholds && Number.isFinite(thresholds.windowMs) && thresholds.windowMs >= 0 ? thresholds.windowMs : 0;
  const windowStart = now - windowMs;
  const windowEvents = sorted.filter(e => e.timestamp >= windowStart);
  let blurCount = 0;
  let copyCount = 0;
  const reasons = [];
  for (const e of windowEvents) {
    if (e.eventType === 'tabBlur') blurCount++;
    else if (e.eventType === 'copyPaste') copyCount++;
  }
  if (blurCount > maxBlurs) {
    reasons.push(`Tab blur events (${blurCount}) exceed max (${maxBlurs})`);
  }
  if (copyCount > maxCopies) {
    reasons.push(`Copy/paste events (${copyCount}) exceed max (${maxCopies})`);
  }
  const total = windowEvents.length;
  let severity = 'low';
  if (total >= 15) severity = 'high';
  else if (total >= 5) severity = 'medium';
  const suspicious = reasons.length > 0;
  return { suspicious, reasons, severity };
}
module.exports = { detectSuspiciousBehavior };
