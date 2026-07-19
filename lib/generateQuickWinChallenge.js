function generateQuickWinChallenge(userProfile) {
  userProfile = userProfile && typeof userProfile === 'object' ? userProfile : {};
  let weakTopics = Array.isArray(userProfile.weakTopics) ? userProfile.weakTopics : [];
  let examDate = new Date(userProfile.examDate);
  let currentPassProbability = Number.isFinite(userProfile.currentPassProbability) ? Math.max(0, Math.min(1, userProfile.currentPassProbability)) : 0;
  let studyHoursCompleted = userProfile.studyHoursCompleted;

  if (studyHoursCompleted < 0 || isNaN(studyHoursCompleted)) {
    studyHoursCompleted = 0;
  }

  let now = new Date();
  let isPastExam = examDate < now;

  if (isPastExam) {
    return {
      challenge: {
        description: 'Quick review of general concepts (5 min)',
        expectedMinutes: 5,
        topic: 'general concepts',
        reward: { type: 'message', content: 'Keep going despite the date!' }
      },
      motivationBoost: 0.01
    };
  }

  if (currentPassProbability >= 0.9) {
    return {
      challenge: {
        description: 'Review and recite 5 key formulas for ' + (weakTopics.length > 0 ? weakTopics[0] : 'general concepts') + ' in 10 minutes',
        expectedMinutes: 10,
        topic: weakTopics.length > 0 ? weakTopics[0] : 'general concepts',
        reward: { type: 'badge', content: 'High Flyer' }
      },
      motivationBoost: 0.005
    };
  }

  let topic = weakTopics.length > 0 ? weakTopics[0] : 'general concepts';
  let expectedMinutes;
  if (currentPassProbability < 0.3) {
    expectedMinutes = 5;
  } else if (currentPassProbability < 0.6) {
    expectedMinutes = 7;
  } else {
    expectedMinutes = 10;
  }

  let reward;
  if (currentPassProbability < 0.3) {
    reward = { type: 'badge', content: 'First Step' };
  } else if (currentPassProbability < 0.6) {
    reward = { type: 'message', content: 'You are making progress!' };
  } else {
    reward = { type: 'message', content: 'Maintain your edge!' };
  }

  let motivationBoost;
  if (currentPassProbability < 0.3) {
    motivationBoost = 0.02;
  } else if (currentPassProbability < 0.6) {
    motivationBoost = 0.015;
  } else {
    motivationBoost = 0.01;
  }

  return {
    challenge: {
      description: 'Review and recite 5 key formulas for ' + topic + ' in ' + expectedMinutes + ' minutes',
      expectedMinutes: expectedMinutes,
      topic: topic,
      reward: reward
    },
    motivationBoost: motivationBoost
  };
}

module.exports = { generateQuickWinChallenge };
