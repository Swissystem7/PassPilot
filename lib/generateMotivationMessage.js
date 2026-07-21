function generateMotivationMessage(streakDays, passProbability, isMilestone) {
  if (!Number.isInteger(streakDays) || streakDays < 0) streakDays = 0;
  if (!Number.isFinite(passProbability) || passProbability < 0 || passProbability > 1) passProbability = 0.5;
  if (typeof isMilestone !== 'boolean') isMilestone = false;

  if (streakDays === 0 && passProbability < 0.3) {
    return {
      message: 'Start your streak today! Complete one task to boost your chances.',
      challenge: '1 quick topic review',
      reward: ''
    };
  }
  if (passProbability >= 0.8 && isMilestone === true) {
    return {
      message: "Amazing! You're on a streak and passing likely. Unlock a bonus mock exam!",
      challenge: '',
      reward: 'Bonus Mock'
    };
  }
  if (streakDays > 0 && passProbability < 0.4) {
    return {
      message: `Keep going! A ${streakDays}-day streak is building momentum. Review weak areas to raise your odds.`,
      challenge: '3 targeted practice questions',
      reward: ''
    };
  }
  if (streakDays >= 5 && passProbability >= 0.6) {
    return {
      message: `Strong progress! ${streakDays} days strong with ${Math.round(passProbability * 100)}% pass chance.`,
      challenge: 'Timed mini-quiz (10 min)',
      reward: 'Streak Shield'
    };
  }
  if (streakDays >= 3 && passProbability >= 0.5) {
    return {
      message: `Nice streak! ${streakDays} days and climbing. Keep it up to secure your pass.`,
      challenge: 'Review 5 flashcards',
      reward: ''
    };
  }
  return {
    message: `Day ${streakDays} — ${Math.round(passProbability * 100)}% pass probability. Stay consistent!`,
    challenge: 'Complete 1 task',
    reward: ''
  };
}

module.exports = { generateMotivationMessage };
