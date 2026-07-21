const crypto = require('crypto');
function canonicalStringify(value) {
  if (Array.isArray(value)) return '[' + value.map(canonicalStringify).join(',') + ']';
  if (value && typeof value === 'object') {
    return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonicalStringify(value[key])).join(',') + '}';
  }
  return JSON.stringify(value);
}
function signPassProbability(userData, prediction, privateKeyPem) {
  if (!userData || typeof userData !== 'object' || !Array.isArray(userData.topics) || typeof userData.totalStudyHours !== 'number' || typeof userData.mockAvgScore !== 'number') {
    throw new Error('InvalidUserData');
  }
  for (const t of userData.topics) {
    if (typeof t.name !== 'string' || typeof t.mastery !== 'number' || t.mastery < 0 || t.mastery > 1) {
      throw new Error('InvalidUserData');
    }
  }
  if (userData.totalStudyHours < 0 || userData.mockAvgScore < 0 || userData.mockAvgScore > 100) {
    throw new Error('InvalidUserData');
  }
  if (!prediction || typeof prediction !== 'object' || typeof prediction.probability !== 'number' || !Array.isArray(prediction.confidenceInterval) || prediction.confidenceInterval.length !== 2) {
    throw new Error('InvalidPrediction');
  }
  if (prediction.probability < 0 || prediction.probability > 1) {
    throw new Error('InvalidPrediction');
  }
  if (typeof prediction.confidenceInterval[0] !== 'number' || typeof prediction.confidenceInterval[1] !== 'number') {
    throw new Error('InvalidPrediction');
  }
  let key;
  try {
    key = crypto.createPrivateKey(privateKeyPem);
  } catch (e) {
    throw new Error('InvalidKey');
  }
  const data = { userData, prediction };
  const sorted = canonicalStringify(data);
  const buffer = Buffer.from(sorted, 'utf8');
  const signature = crypto.sign('sha256', buffer, key);
  return signature.toString('base64');
}
function verifyPassProbability(signature, userData, prediction, publicKeyPem) {
  if (!userData || typeof userData !== 'object' || !Array.isArray(userData.topics) || typeof userData.totalStudyHours !== 'number' || typeof userData.mockAvgScore !== 'number') {
    throw new Error('InvalidUserData');
  }
  for (const t of userData.topics) {
    if (typeof t.name !== 'string' || typeof t.mastery !== 'number' || t.mastery < 0 || t.mastery > 1) {
      throw new Error('InvalidUserData');
    }
  }
  if (userData.totalStudyHours < 0 || userData.mockAvgScore < 0 || userData.mockAvgScore > 100) {
    throw new Error('InvalidUserData');
  }
  if (!prediction || typeof prediction !== 'object' || typeof prediction.probability !== 'number' || !Array.isArray(prediction.confidenceInterval) || prediction.confidenceInterval.length !== 2) {
    throw new Error('InvalidPrediction');
  }
  if (prediction.probability < 0 || prediction.probability > 1) {
    throw new Error('InvalidPrediction');
  }
  if (typeof prediction.confidenceInterval[0] !== 'number' || typeof prediction.confidenceInterval[1] !== 'number') {
    throw new Error('InvalidPrediction');
  }
  let key;
  try {
    key = crypto.createPublicKey(publicKeyPem);
  } catch (e) {
    throw new Error('InvalidKey');
  }
  const data = { userData, prediction };
  const sorted = canonicalStringify(data);
  const buffer = Buffer.from(sorted, 'utf8');
  const sigBuffer = Buffer.from(signature, 'base64');
  return crypto.verify('sha256', buffer, key, sigBuffer);
}
module.exports = { signPassProbability };
