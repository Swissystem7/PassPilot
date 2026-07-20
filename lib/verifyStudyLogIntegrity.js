function verifyStudyLogIntegrity(studyLog, storedHash, secretKey) {
  if (typeof secretKey !== 'string' || secretKey.length === 0) {
    throw new Error('Missing secretKey');
  }
  if (!Array.isArray(studyLog)) throw new TypeError('studyLog must be an array');
  const sortedLog = [...studyLog].sort((a, b) => a.timestamp - b.timestamp);
  const logString = JSON.stringify(sortedLog) + secretKey;
  const hash = require('crypto').createHash('sha256').update(logString).digest('hex');
  if (hash !== storedHash) {
    return { valid: false, error: 'Hash mismatch - log may be tampered' };
  }
  return { valid: true, error: null };
}
module.exports = { verifyStudyLogIntegrity };
