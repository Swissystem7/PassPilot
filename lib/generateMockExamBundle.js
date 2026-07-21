const { randomUUID } = require('crypto');

function generateMockExamBundle(student) {
  if (student === null || student === undefined) return null;
  const { id, weakTopics, numPreviousMocks, examDate, subscriptionTier } = student;
  if (subscriptionTier === 'premium') return null;
  const parsedDate = new Date(examDate);
  if (isNaN(parsedDate.getTime())) throw new Error('Invalid date string');
  const now = new Date();
  const diffMs = parsedDate.getTime() - now.getTime();
  if (diffMs <= 0) return null;
  const daysUntilExam = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const prevMocks = (typeof numPreviousMocks === 'number' && Number.isInteger(numPreviousMocks) && numPreviousMocks >= 0) ? numPreviousMocks : 0;
  const maxCount = Math.min(5, Math.floor(daysUntilExam / 3));
  const mockExamCount = Math.max(1, maxCount);
  const topics = (weakTopics && weakTopics.length > 0) ? weakTopics : ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'];
  let basePrice = 1999;
  if (prevMocks > 10) basePrice = Math.floor(basePrice * 0.8);
  const priceCents = Math.max(0, basePrice * mockExamCount);
  const bundleId = `bundle_${id}_${randomUUID()}`;
  return { bundleId, mockExamCount, topics, priceCents };
}
module.exports = { generateMockExamBundle };
