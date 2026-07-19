function calculateStreakWithGrace(dailyLog, graceDays, periodDays) {
  if (!Array.isArray(dailyLog) || !dailyLog.every(v => v === 0 || v === 1)) throw new TypeError('dailyLog must contain only 0 or 1');
  if (!Number.isInteger(graceDays) || graceDays < 0 || !Number.isInteger(periodDays) || periodDays < 0) throw new TypeError('invalid period or grace days');
  graceDays = Math.min(graceDays, periodDays);
  const log = dailyLog.slice(-periodDays);
  while (log.length < periodDays) log.unshift(0);
  const n = log.length;
  let currentStreak = 0, longestStreak = 0, graceUsed = 0, daysSinceLastMiss = -1;
  let left = 0, zeros = 0;
  for (let right = 0; right < n; right++) {
    if (log[right] === 0) zeros++;
    while (zeros > graceDays) {
      if (log[left] === 0) zeros--;
      left++;
    }
    longestStreak = Math.max(longestStreak, right - left + 1);
  }
  let curGrace = 0;
  for (let i = n - 1; i >= 0; i--) {
    if (log[i] === 1) {
      currentStreak++;
    } else if (curGrace < graceDays) {
      currentStreak++;
      curGrace++;
    } else {
      break;
    }
  }
  graceUsed = curGrace;
  let seenGrace = 0;
  for (let i = n - 1; i >= 0; i--) if (log[i] === 0 && seenGrace++ >= graceDays) {
    daysSinceLastMiss = n - 1 - i;
    break;
  }
  return { currentStreak, longestStreak, graceUsed, daysSinceLastMiss };
}
module.exports = { calculateStreakWithGrace };
