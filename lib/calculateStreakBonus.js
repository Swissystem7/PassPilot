function calculateStreakBonus(currentStreak) {
  if (!Number.isInteger(currentStreak) || currentStreak < 0) throw new Error("Streak cannot be negative");
  if (currentStreak === 0) return { bonusMultiplier: 1.0, streakText: "Start your streak today!" };
  if (currentStreak <= 2) return { bonusMultiplier: 1.0, streakText: `🔥 ${currentStreak}-day streak! Keep it up!` };
  if (currentStreak <= 6) return { bonusMultiplier: 1.2, streakText: `🔥 ${currentStreak}-day streak! Keep it up!` };
  if (currentStreak <= 13) return { bonusMultiplier: 1.5, streakText: `🔥 ${currentStreak}-day streak! Keep it up!` };
  return { bonusMultiplier: 2.0, streakText: `🔥 ${currentStreak}-day streak! Keep it up!` };
}
module.exports = { calculateStreakBonus };
