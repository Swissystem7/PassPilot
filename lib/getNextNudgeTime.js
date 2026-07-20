function getNextNudgeTime(userId, preferredWindowStart, preferredWindowEnd, historyOfOpenTimes) {
  if (!userId || typeof userId !== 'string') throw new Error('Invalid userId');
  if (!Number.isFinite(preferredWindowStart) || !Number.isFinite(preferredWindowEnd)) throw new Error('Invalid window');
  let start = Math.max(0, Math.min(23, Math.floor(preferredWindowStart)));
  let end = Math.max(0, Math.min(23, Math.floor(preferredWindowEnd)));
  if (start === end) {
    end = (start + 1) % 24;
  }
  const now = Date.now();
  const nowHours = new Date(now).getUTCHours();
  const nowMinutes = new Date(now).getUTCMinutes();
  const nowSeconds = new Date(now).getUTCSeconds();
  const nowMs = new Date(now).getUTCMilliseconds();
  const dayStart = now - (nowHours * 3600000 + nowMinutes * 60000 + nowSeconds * 1000 + nowMs);
  let windowStartMs, windowEndMs;
  if (start < end) {
    windowStartMs = dayStart + start * 3600000;
    windowEndMs = dayStart + end * 3600000;
  } else {
    windowStartMs = dayStart + start * 3600000;
    windowEndMs = dayStart + 86400000 + end * 3600000;
  }
  const minFuture = now + 300000;
  if (windowEndMs <= minFuture) {
    windowStartMs += 86400000;
    windowEndMs += 86400000;
  }
  if (windowStartMs < minFuture && windowEndMs > minFuture) {
    windowStartMs = minFuture;
  } else if (windowStartMs < minFuture) {
    windowStartMs += 86400000;
    windowEndMs += 86400000;
  }
  const windowDuration = windowEndMs - windowStartMs;
  if (windowDuration < 3600000) {
    const mid = windowStartMs + 1800000;
    return Math.max(minFuture, Math.min(mid, windowEndMs));
  }
  historyOfOpenTimes = Array.isArray(historyOfOpenTimes) ? historyOfOpenTimes.filter(Number.isFinite) : [];
  if (historyOfOpenTimes.length === 0) {
    return windowStartMs + Math.floor(Math.random() * windowDuration);
  }
  const dayMs = 86400000;
  const normalized = historyOfOpenTimes.map(t => {
    const d = new Date(t);
    return (d.getUTCHours() * 3600000 + d.getUTCMinutes() * 60000 + d.getUTCSeconds() * 1000 + d.getUTCMilliseconds()) % dayMs;
  });
  const startOffset = start * 3600000;
  const endOffset = end * 3600000;
  let inWindow = normalized.filter(offset => {
    if (start < end) {
      return offset >= startOffset && offset < endOffset;
    } else {
      return offset >= startOffset || offset < endOffset;
    }
  });
  if (inWindow.length === 0) {
    inWindow = normalized;
  }
  if (inWindow.length === 0) {
    return windowStartMs + Math.floor(Math.random() * windowDuration);
  }
  const avgOffset = inWindow.reduce((a, b) => a + b, 0) / inWindow.length;
  let targetMs = windowStartMs + (avgOffset - startOffset + windowDuration) % windowDuration;
  if (targetMs < minFuture) {
    targetMs += windowDuration;
  }
  if (targetMs > windowEndMs) {
    targetMs = windowStartMs + (targetMs - windowStartMs) % windowDuration;
    if (targetMs < minFuture) targetMs += windowDuration;
  }
  return Math.round(Math.max(minFuture, Math.min(targetMs, windowEndMs)));
}
module.exports = { getNextNudgeTime };
