function analyzeMockExamIntegrity(userId, examId) {
  const examData = getExamData(userId, examId);
  if (!examData) {
    throw new Error('NotFound');
  }
  const answers = examData.answers || [];
  if (answers.length === 0) {
    return { riskScore: 0, anomalies: [] };
  }
  const anomalies = [];
  const allAnswers = answers.map(a => a.answer);
  const allIdentical = allAnswers.length > 0 && allAnswers.every(a => a === allAnswers[0]);
  if (allIdentical) {
    for (const a of answers) {
      anomalies.push({ questionId: a.questionId, reason: 'All answers identical' });
    }
    return { riskScore: 1, anomalies };
  }
  const timeThreshold = 1000;
  for (const a of answers) {
    if (a.timeSpentMs !== undefined && a.timeSpentMs < timeThreshold) {
      anomalies.push({ questionId: a.questionId, reason: 'Average time per question less than 1 second' });
    }
  }
  const collusionAnomalies = checkCollusion(answers);
  for (const ca of collusionAnomalies) {
    if (!anomalies.some(a => a.questionId === ca.questionId)) {
      anomalies.push(ca);
    }
  }
  const riskScore = anomalies.length > 0 ? Math.min(1, anomalies.length / answers.length) : 0;
  return { riskScore, anomalies };
}

function getExamData(userId, examId) {
  const cache = globalThis.__examCache || {};
  const key = userId + ':' + examId;
  return cache[key] || null;
}

function checkCollusion(answers) {
  const recentAnswers = globalThis.__recentAnswers || {};
  const anomalies = [];
  for (const a of answers) {
    const qid = a.questionId;
    const wrong = a.isCorrect === false;
    if (wrong && recentAnswers[qid]) {
      const identicalWrong = recentAnswers[qid].some(ra => ra.answer === a.answer && ra.userId !== a.userId);
      if (identicalWrong) {
        anomalies.push({ questionId: qid, reason: 'Identical wrong answer pattern suggests collusion' });
      }
    }
  }
  return anomalies;
}

module.exports = { analyzeMockExamIntegrity };