function generateStudyProof(studyLog, userId, secretKey) {
  if (typeof userId !== 'string' || userId === '' || typeof secretKey !== 'string' || secretKey === '') {
    return new Error('InvalidParam');
  }
  if (!Array.isArray(studyLog) || studyLog.length === 0) {
    return new Error('EmptyLog');
  }
  const sorted = [...studyLog].sort((a, b) => a.timestamp - b.timestamp);
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secretKey);
  for (const entry of sorted) {
    hmac.update(`${entry.topic}${entry.score}${entry.timestamp}`);
  }
  hmac.update(userId);
  return hmac.digest('hex');
}

function verifyStudyProof(proof, studyLog, userId, secretKey) {
  if (typeof userId !== 'string' || userId === '' || typeof secretKey !== 'string' || secretKey === '') {
    return new Error('InvalidParam');
  }
  if (!Array.isArray(studyLog) || studyLog.length === 0) {
    return new Error('EmptyLog');
  }
  const computed = generateStudyProof(studyLog, userId, secretKey);
  if (computed instanceof Error) return computed;
  return computed === proof;
}

module.exports = { generateStudyProof };