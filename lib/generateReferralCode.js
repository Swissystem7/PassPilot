function generateReferralCode(userId, rewardTier) {
  if (typeof userId !== 'string' || userId.length === 0) {
    throw new Error('Invalid userId');
  }
  const validTiers = ['bronze', 'silver', 'gold'];
  if (!validTiers.includes(rewardTier)) {
    throw new Error('Invalid reward tier');
  }
  const maxUsesMap = { bronze: 5, silver: 10, gold: 20 };
  const maxUses = maxUsesMap[rewardTier];
  const storage = globalThis.__passPilotReferralStorage || (globalThis.__passPilotReferralStorage = { codes: new Map(), users: new Map(), usedReferees: new Set() });
  const now = new Date();
  const existing = storage.users.get(userId);
  if (existing && existing.expiration.getTime() >= now.getTime() && existing.currentUses < existing.maxUses) {
    return { code: existing.code, expiration: existing.expiration, maxUses: existing.maxUses, currentUses: existing.currentUses };
  }
  const expiration = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const crypto = require('crypto');
  const code = crypto.randomBytes(4).toString('hex');
  const result = {
    code: code,
    expiration: expiration,
    maxUses: maxUses,
    currentUses: 0
  };
  result.rewardTier = rewardTier;
  storage.codes.set(code, result);
  storage.users.set(userId, result);
  return { code: result.code, expiration: result.expiration, maxUses: result.maxUses, currentUses: result.currentUses };
}
module.exports = { generateReferralCode };
