const BLOCKS = Object.freeze([
  { number: 1, topic: "recursion", title: "שאלה 1 - רקורסיה", emphasis: "תנאי עצירה, צעד רקורסיבי ומעקב אחר מחסנית הקריאות" },
  { number: 2, topic: "strings", title: "שאלה 2 - מחרוזות", emphasis: "כל פעולות המחרוזת: חיתוך, חיפוש, פיצול, החלפה ובדיקות" },
  { number: 3, topic: "lists", title: "שאלה 3 - רשימות", emphasis: "מעבר, שינוי, חיתוך, מיון ו-list comprehensions" },
  { number: 4, topic: "dictionaries", title: "שאלה 4 - מבני נתונים - מילונים", emphasis: "יצירה, עדכון, מעבר על items וספירת מופעים" }
]);

const examStructure = () => BLOCKS.map((block) => ({ ...block }));
const mulberry32 = (seed) => { let state = seed | 0; return () => { state = (state + 0x6D2B79F5) | 0; let value = Math.imul(state ^ state >>> 15, 1 | state); value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value; return ((value ^ value >>> 14) >>> 0) / 4294967296; }; };

const buildExamSession = (bank, opts = {}) => {
  const source = typeof bank === "function" ? bank() : bank;
  if (!Array.isArray(source)) throw new TypeError("bank must be an array or a function returning an array");
  const countPerBlock = opts.countPerBlock === undefined ? 1 : opts.countPerBlock;
  const seed = opts.seed === undefined ? 10016 : opts.seed;
  if (!Number.isInteger(countPerBlock) || countPerBlock < 1) throw new TypeError("countPerBlock must be a positive integer");
  if (!Number.isInteger(seed)) throw new TypeError("seed must be an integer");
  const rng = mulberry32(seed);
  return examStructure().map((block) => {
    const shuffled = source.filter((question) => question.topic === block.topic);
    if (shuffled.length < countPerBlock) throw new RangeError(`not enough questions for ${block.topic}`);
    for (let i = shuffled.length - 1; i > 0; i -= 1) { const j = Math.floor(rng() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
    return { ...block, questions: shuffled.slice(0, countPerBlock) };
  });
};

module.exports = { examStructure, buildExamSession };

if (require.main === module) {
  const assert = require("node:assert/strict");
  const { questionBank } = require("./questionBank");
  const first = buildExamSession(questionBank, { countPerBlock: 2, seed: 42 });
  const second = buildExamSession(questionBank(), { countPerBlock: 2, seed: 42 });
  assert.deepEqual(first, second);
  assert.deepEqual(first.map((block) => block.topic), ["recursion", "strings", "lists", "dictionaries"]);
  assert(first.every((block) => block.questions.length === 2 && block.questions.every((q) => q.topic === block.topic)));
  console.log("examMode10016 selftest: OK");
}
