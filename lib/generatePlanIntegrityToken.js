const crypto = require('crypto');

function generatePlanIntegrityToken(planData, secretKey) {
  if (typeof planData !== 'object' || planData === null) {
    throw new Error('planData must be a non-null object');
  }
  if (typeof secretKey !== 'string' || secretKey.length === 0) {
    throw new Error('secretKey must be a non-empty string');
  }
  const dataString = JSON.stringify(planData);
  if (dataString === undefined) throw new Error('planData must be JSON-serializable');
  return crypto.createHmac('sha256', secretKey).update(dataString).digest('hex');
}

function verifyPlanIntegrity(planData, token, secretKey) {
  if (planData === null || planData === undefined) {
    return false;
  }
  if (typeof secretKey !== 'string' || secretKey.length === 0) {
    return false;
  }
  if (typeof token !== 'string' || !/^[0-9a-fA-F]{64}$/.test(token)) {
    return false;
  }
  try {
    const expectedToken = generatePlanIntegrityToken(planData, secretKey);
    const tokenBuffer = Buffer.from(token, 'hex');
    const expectedBuffer = Buffer.from(expectedToken, 'hex');
    if (tokenBuffer.length !== expectedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(tokenBuffer, expectedBuffer);
  } catch (e) {
    return false;
  }
}

module.exports = { generatePlanIntegrityToken, verifyPlanIntegrity };
