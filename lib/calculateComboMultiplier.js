function calculateComboMultiplier(currentStreak, maxStreak) {
  if (!Number.isInteger(currentStreak) || !Number.isInteger(maxStreak) || currentStreak < 0 || maxStreak < 0) throw new Error("Negative input");
  const multiplier = 1.0 + Math.min(0.5, currentStreak * 0.05);
  const streakForBonus = currentStreak > maxStreak ? maxStreak : currentStreak;
  const bonusPoints = Math.floor(streakForBonus / 7) * 10;
  return { multiplier, bonusPoints };
}
module.exports = { calculateComboMultiplier };
