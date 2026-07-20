function generateOnboardingPlan({ examDate, subject, selfConfidence } = {}) {
  const now = new Date();
  const exam = new Date(examDate);
  if (!Number.isFinite(exam.getTime()) || exam <= now) {
    return { error: 'Exam date must be in the future' };
  }

  let confidence = Number.isFinite(selfConfidence) ? selfConfidence : 1;
  if (confidence < 1) confidence = 1;
  if (confidence > 5) confidence = 5;

  const subjectDistributions = {
    mathematics: { topics: ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry'], weights: [0.3, 0.2, 0.25, 0.15, 0.1] },
    physics: { topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'], weights: [0.25, 0.2, 0.25, 0.15, 0.15] },
    chemistry: { topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry', 'Biochemistry'], weights: [0.25, 0.2, 0.25, 0.15, 0.15] },
    biology: { topics: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Evolution'], weights: [0.25, 0.2, 0.2, 0.2, 0.15] },
    history: { topics: ['Ancient Civilizations', 'Medieval History', 'Modern History', 'World Wars', 'Contemporary History'], weights: [0.2, 0.2, 0.25, 0.2, 0.15] },
    literature: { topics: ['Poetry Analysis', 'Prose Fiction', 'Drama', 'Literary Theory', 'Comparative Literature'], weights: [0.25, 0.25, 0.2, 0.15, 0.15] }
  };

  const lowerSubject = typeof subject === 'string' ? subject.toLowerCase() : '';
  let distribution = subjectDistributions[lowerSubject];
  if (!distribution) {
    distribution = {
      topics: ['Topic A', 'Topic B', 'Topic C', 'Topic D', 'Topic E'],
      weights: [0.2, 0.2, 0.2, 0.2, 0.2]
    };
  }

  const daysUntilExam = Math.ceil((exam - now) / (1000 * 60 * 60 * 24));
  const totalDays = Math.max(daysUntilExam, 1);
  const baseMinutesPerDay = Math.round(120 * (1 + (5 - confidence) * 0.15));
  const dailyPlan = [];

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(now);
    currentDate.setDate(currentDate.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];

    const dayIndex = i % distribution.topics.length;
    const topicCount = Math.min(2, Math.ceil((confidence + 1) / 3));
    const topics = [];
    for (let j = 0; j < topicCount; j++) {
      const idx = (dayIndex + j) % distribution.topics.length;
      topics.push(distribution.topics[idx]);
    }

    const minutes = Math.round(baseMinutesPerDay * (1 - 0.1 * (i / totalDays)));
    dailyPlan.push({ date: dateStr, topics, minutes });
  }

  const baseProbability = 0.5 + (confidence - 1) * 0.08 + (totalDays >= 30 ? 0.1 : totalDays * 0.003);
  const estimatedPassProbability = Math.min(Math.max(Math.round(baseProbability * 100) / 100, 0), 1);

  const messages = {
    1: "You've got this! Start small, build momentum, and watch your confidence grow.",
    2: "Every expert was once a beginner. Consistent effort will turn doubt into mastery.",
    3: "You have a solid foundation. With focused study, you'll be well-prepared.",
    4: "You're already confident. Channel that energy into targeted review for top results.",
    5: "Your confidence is high! Stay disciplined and you'll ace this exam."
  };
  const motivationMessage = messages[confidence] || "Keep pushing forward, you're doing great!";

  return { dailyPlan, estimatedPassProbability, motivationMessage };
}

module.exports = { generateOnboardingPlan };
