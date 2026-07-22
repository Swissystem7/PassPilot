function createMinimalProfile(examDate, weakTopics, dailyHours) {
  const errors = [];
  if (examDate == null || weakTopics == null || dailyHours == null) {
    errors.push('All inputs are required.');
    return { success: false, errors, profile: undefined };
  }
  if (typeof examDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(examDate)) {
    errors.push('Exam date must be in YYYY-MM-DD format.');
    return { success: false, errors, profile: undefined };
  }
  const parsedDate = new Date(examDate + 'T00:00:00Z');
  if (isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== examDate) {
    errors.push('Exam date must be in YYYY-MM-DD format.');
    return { success: false, errors, profile: undefined };
  }
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (parsedDate <= today) {
    errors.push('Exam date must be in the future.');
  }
  if (typeof dailyHours !== 'number' || !Number.isFinite(dailyHours) || dailyHours <= 0 || dailyHours > 24) {
    errors.push('Daily hours must be a positive number between 1 and 24.');
  }
  if (!Array.isArray(weakTopics)) {
    errors.push('Weak topics must be an array.');
    return { success: false, errors, profile: undefined };
  }
  const filteredTopics = weakTopics.filter(t => typeof t === 'string');
  const deduplicated = [...new Set(filteredTopics)];
  if (errors.length > 0) {
    return { success: false, errors, profile: undefined };
  }
  return {
    success: true,
    errors: [],
    profile: {
      examDate: parsedDate,
      weakTopics: deduplicated,
      dailyHours
    }
  };
}
module.exports = { createMinimalProfile };
