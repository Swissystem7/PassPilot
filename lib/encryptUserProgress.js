const crypto = require('crypto');

function encryptUserProgress(progressData, userKey) {
  if (progressData === null || progressData === undefined) {
    throw new Error('progressData must not be null or undefined');
  }
  if (typeof userKey !== 'string' || userKey.length === 0) {
    throw new Error('userKey must be a non-empty string');
  }
  let jsonString;
  try {
    jsonString = JSON.stringify(progressData);
  } catch (e) {
    throw new Error('progressData must be JSON-serializable and must not contain circular references');
  }
  if (jsonString === undefined) throw new Error('progressData must be JSON-serializable');
  const derivedKey = crypto.createHash('sha256').update(userKey).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);
  let encrypted = cipher.update(jsonString, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return { encrypted, iv: iv.toString('hex'), tag };
}

function decryptUserProgress(encrypted, iv, tag, userKey) {
  if (typeof encrypted !== 'string' || typeof iv !== 'string' || typeof tag !== 'string' || typeof userKey !== 'string') {
    throw new Error('Invalid input types');
  }
  if (userKey.length === 0) {
    throw new Error('userKey must be a non-empty string');
  }
  if (!/^(?:[0-9a-fA-F]{2})*$/.test(encrypted) || !/^[0-9a-fA-F]{32}$/.test(iv) || !/^[0-9a-fA-F]{32}$/.test(tag)) {
    throw new Error('Authentication failed or invalid input');
  }
  const derivedKey = crypto.createHash('sha256').update(userKey).digest();
  const ivBuffer = Buffer.from(iv, 'hex');
  const tagBuffer = Buffer.from(tag, 'hex');
  let decrypted;
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, ivBuffer);
    decipher.setAuthTag(tagBuffer);
    decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
  } catch (e) {
    throw new Error('Authentication failed or invalid input');
  }
  let result;
  try {
    result = JSON.parse(decrypted);
  } catch (e) {
    throw new Error('Decrypted data is not valid JSON');
  }
  return result;
}

module.exports = { encryptUserProgress, decryptUserProgress };
