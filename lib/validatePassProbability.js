function validatePassProbability(probability, mockScores, studyHours) {
  if (typeof probability !== 'number' || !Number.isFinite(probability) || probability < 0 || probability > 1) {
    throw new Error('Invalid probability');
  }
  if (!Array.isArray(mockScores)) {
    throw new Error('Invalid mockScores');
  }
  for (let i = 0; i < mockScores.length; i++) {
    if (typeof mockScores[i] !== 'number' || !Number.isFinite(mockScores[i]) || mockScores[i] < 0 || mockScores[i] > 100) {
      throw new Error('Invalid mockScore element');
    }
  }
  if (typeof studyHours !== 'number' || !Number.isFinite(studyHours) || studyHours < 0) {
    throw new Error('Invalid studyHours');
  }
  const warnings = [];
  if ((probability > 0.95 && studyHours < 10) || (probability > 0.9 && studyHours === 0)) {
    warnings.push('High probability despite low study hours');
  }
  if (probability < 0.1 && studyHours > 100) {
    warnings.push('Low probability despite high study hours');
  }
  if (mockScores.length > 0) {
    const avg = mockScores.reduce((a, b) => a + b, 0) / mockScores.length;
    if (avg < 30 && probability > 0.8) {
      warnings.push('High probability with low mock scores');
    }
  }
  return { isValid: warnings.length === 0, warnings };
}
module.exports = { validatePassProbability };
