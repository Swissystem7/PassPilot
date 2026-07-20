function checkAccountSharing(userId, currentFingerprint, recentFingerprints, config) {
  const requiredFields = ['userAgent', 'screenRes', 'timezone', 'canvasHash'];
  for (const field of requiredFields) {
    if (!currentFingerprint || typeof currentFingerprint !== 'object' || !(field in currentFingerprint)) {
      throw new Error(`Missing field: ${field}`);
    }
  }

  let windowHours = config && config.windowHours;
  if (!Number.isFinite(windowHours) || windowHours <= 0) {
    windowHours = 1;
  }

  const now = Date.now();
  const windowMs = windowHours * 60 * 60 * 1000;

  const currentKey = `${String(currentFingerprint.userAgent).toLowerCase()}|${String(currentFingerprint.screenRes).toLowerCase()}|${String(currentFingerprint.timezone).toLowerCase()}|${String(currentFingerprint.canvasHash).toLowerCase()}`;

  const distinctFingerprints = new Set();

  for (const entry of Array.isArray(recentFingerprints) ? recentFingerprints : []) {
    if (!entry || !Number.isFinite(entry.timestamp) || !entry.fingerprint) continue;
    let ts = entry.timestamp;
    if (ts > now) {
      ts = now;
    }
    if (now - ts > windowMs) {
      continue;
    }

    const fp = entry.fingerprint;
    if (requiredFields.some(field => !(field in fp))) continue;
    const key = `${String(fp.userAgent).toLowerCase()}|${String(fp.screenRes).toLowerCase()}|${String(fp.timezone).toLowerCase()}|${String(fp.canvasHash).toLowerCase()}`;
    if (key !== currentKey) {
      distinctFingerprints.add(key);
    }
  }

  const count = distinctFingerprints.size;
  const maxDistinct = config && Number.isInteger(config.maxDistinctFingerprints) && config.maxDistinctFingerprints >= 0 ? config.maxDistinctFingerprints : 0;
  let riskScore = 0;
  const alerts = [];

  if (count > maxDistinct) {
    riskScore = Math.min(1, count / (maxDistinct + 1));
    alerts.push('Multiple devices detected');
  }

  return { riskScore, alerts };
}

module.exports = { checkAccountSharing };
