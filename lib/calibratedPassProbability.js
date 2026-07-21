function calibratedPassProbability(studentData, confidenceLevel = 0.95) {
  if (!studentData || !Array.isArray(studentData.mockExamScores) ||
      !Array.isArray(studentData.studyHours) || !Number.isFinite(confidenceLevel) ||
      confidenceLevel <= 0 || confidenceLevel >= 1) {
    throw new TypeError('Invalid student data or confidence level');
  }
  let { mockExamScores, studyHours, selfReportedConfidence } = studentData;
  if (!mockExamScores || mockExamScores.length === 0) {
    return { prob: 0.5, lowerBound: 0.5 - 0.4, upperBound: 0.5 + 0.4 };
  }
  if (!mockExamScores.every(Number.isFinite) || !studyHours.every(Number.isFinite) ||
      (selfReportedConfidence !== null && (!Number.isFinite(selfReportedConfidence) || selfReportedConfidence < 0 || selfReportedConfidence > 100))) {
    throw new TypeError('Student values must be finite numbers');
  }
  const clampedScores = mockExamScores.map(s => Math.min(100, Math.max(0, s)));
  const n = clampedScores.length;
  const meanScore = clampedScores.reduce((a, b) => a + b, 0) / n;
  const totalStudyHours = (studyHours && studyHours.length > 0) ? studyHours.reduce((a, b) => a + b, 0) : 0;
  const studyFactor = Math.min(1, totalStudyHours / 100) * 0.1;
  const confidenceFactor = (selfReportedConfidence !== null && selfReportedConfidence !== undefined) ? (selfReportedConfidence / 100) * 0.05 : 0;
  const rawProb = (meanScore / 100) + studyFactor + confidenceFactor;
  const prob = Math.min(1, Math.max(0, rawProb));
  // Acklam's inverse-normal approximation, sufficient for confidence bounds.
  const inverseNormal = (p) => {
    const a=[-39.6968302866538,220.946098424521,-275.928510446969,138.357751867269,-30.6647980661472,2.50662827745924];
    const b=[-54.4760987982241,161.585836858041,-155.698979859887,66.8013118877197,-13.2806815528857];
    const c=[-0.00778489400243029,-0.322396458041136,-2.40075827716184,-2.54973253934373,4.37466414146497,2.93816398269878];
    const d=[0.00778469570904146,0.32246712907004,2.445134137143,3.75440866190742];
    const q=p-0.5;
    if (Math.abs(q)<=0.425) { const r=0.180625-q*q; return q*((((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)); }
    const r=Math.sqrt(-Math.log(q<0?p:1-p));
    const x=(((((c[0]*r+c[1])*r+c[2])*r+c[3])*r+c[4])*r+c[5])/((((d[0]*r+d[1])*r+d[2])*r+d[3])*r+1);
    return q<0?-x:x;
  };
  const z = inverseNormal((1 + confidenceLevel) / 2);
  const se = n === 1 ? 0.3 : Math.sqrt((prob * (1 - prob)) / n);
  const margin = z * se;
  let lowerBound = Math.max(0, prob - margin);
  let upperBound = Math.min(1, prob + margin);
  if (n === 1) {
    lowerBound = Math.max(0, prob - 0.3);
    upperBound = Math.min(1, prob + 0.3);
  }
  return { prob, lowerBound, upperBound };
}
module.exports = { calibratedPassProbability };
