function generateMilestoneMessage(userProgress, daysUntilExam, studyStreak, weakTopicImprovement) {
  if (![userProgress, daysUntilExam, studyStreak, weakTopicImprovement].every(Number.isFinite) || !Number.isInteger(daysUntilExam) || !Number.isInteger(studyStreak)) {
    throw new Error("Invalid input: all parameters must be numbers");
  }
  if (daysUntilExam < 0) daysUntilExam = 0;
  if (studyStreak < 0) studyStreak = 0;
  if (weakTopicImprovement < 0) weakTopicImprovement = 0;
  if (daysUntilExam === 0) return "Exam day – you've got this!";
  if (studyStreak === 0) return "Start today – every journey begins with one step!";
  if (userProgress > 1) return "You're ahead of schedule – keep crushing it!";
  if (userProgress >= 0.8) return "Almost there – finish strong!";
  if (weakTopicImprovement >= 20) return "Weak topics improving – great progress!";
  if (studyStreak >= 7) return "Week streak – you're building momentum!";
  if (studyStreak >= 3) return "3-day streak – keep the chain alive!";
  return "Keep going – every bit counts!";
}
module.exports = { generateMilestoneMessage };
