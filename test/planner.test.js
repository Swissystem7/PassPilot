const test = require('node:test');
const assert = require('node:assert/strict');
const {
  weakTopicRanker,
  calculateInitialPassProbability,
  generateInitialStudyPlan,
} = require('../src/lib/planner');

const answer = (topic, correct, secondsSpent) => ({ topic, correct, secondsSpent });

// ── weakTopicRanker ────────────────────────────────────────────────────────

test('the topic answered wrong most often ranks first', () => {
  const ranked = weakTopicRanker([
    answer('algebra', false, 30), answer('algebra', false, 30),
    answer('geometry', true, 30), answer('geometry', true, 30),
  ]);
  assert.equal(ranked[0].topic, 'algebra');
  assert.equal(ranked[0].errorRate, 1);
});

test('a topic answered correctly but very slowly still scores above zero', () => {
  const ranked = weakTopicRanker([
    answer('slow', true, 300),
    answer('fast', true, 5),
  ]);
  const slow = ranked.find((r) => r.topic === 'slow');
  assert.ok(slow.score > 0, 'slowness must carry weight even with no errors');
  assert.ok(slow.score > ranked.find((r) => r.topic === 'fast').score);
});

test('errors outweigh slowness', () => {
  const ranked = weakTopicRanker([
    answer('wrongButFast', false, 1),
    answer('rightButSlow', true, 600),
  ]);
  assert.equal(ranked[0].topic, 'wrongButFast');
});

test('malformed rows are dropped instead of breaking the ranking', () => {
  const ranked = weakTopicRanker([
    answer('algebra', false, 30),
    null,
    { topic: 'algebra', correct: false },            // no secondsSpent
    { topic: 42, correct: false, secondsSpent: 10 }, // topic not a string
    { topic: 'algebra', correct: false, secondsSpent: -5 },
  ]);
  assert.equal(ranked.length, 1);
  assert.equal(ranked[0].attempts, 1);
});

test('an empty result set ranks nothing rather than throwing', () => {
  assert.deepEqual(weakTopicRanker([]), []);
});

test('non-array input is rejected loudly', () => {
  assert.throws(() => weakTopicRanker(null), TypeError);
  assert.throws(() => weakTopicRanker('algebra'), TypeError);
});

test('equal scores break ties alphabetically, so the list is stable', () => {
  const ranked = weakTopicRanker([answer('beta', false, 10), answer('alpha', false, 10)]);
  assert.deepEqual(ranked.map((r) => r.topic), ['alpha', 'beta']);
});

// ── calculateInitialPassProbability ────────────────────────────────────────

test('a perfect score on a medium exam is discounted, not certain', () => {
  assert.equal(calculateInitialPassProbability(10, 10), 0.8);
});

test('difficulty changes the discount', () => {
  assert.equal(calculateInitialPassProbability(10, 10, 'easy'), 1);
  assert.ok(calculateInitialPassProbability(10, 10, 'hard') < calculateInitialPassProbability(10, 10, 'medium'));
});

test('an unknown difficulty falls back to medium instead of producing NaN', () => {
  assert.equal(calculateInitialPassProbability(10, 10, 'impossible'), 0.8);
});

test('answering nothing correctly is zero, not a fraction of zero', () => {
  assert.equal(calculateInitialPassProbability(0, 20, 'easy'), 0);
});

test('impossible scores are rejected', () => {
  assert.throws(() => calculateInitialPassProbability(11, 10), /invalid score/);
  assert.throws(() => calculateInitialPassProbability(-1, 10), /invalid score/);
  assert.throws(() => calculateInitialPassProbability(5, 0), /invalid score/);
  assert.throws(() => calculateInitialPassProbability(2.5, 10), /invalid score/);
});

test('more correct answers never lower the probability', () => {
  let previous = -1;
  for (let correct = 0; correct <= 20; correct++) {
    const p = calculateInitialPassProbability(correct, 20);
    assert.ok(p >= previous, `score ${correct} lowered the probability`);
    previous = p;
  }
});

// ── generateInitialStudyPlan ───────────────────────────────────────────────

const slot = (day, startHour, endHour) => ({ day, startHour, endHour });

test('the heaviest topic gets the first slot', () => {
  const { plan } = generateInitialStudyPlan('2026-09-01', [
    { name: 'light', estimatedHoursTotal: 2 },
    { name: 'heavy', estimatedHoursTotal: 20 },
  ], [slot('2026-08-20', 9, 10)]);
  assert.equal(plan[0].topic, 'heavy');
});

test('topics rotate so none is starved when slots are scarce', () => {
  const { plan } = generateInitialStudyPlan('2026-09-01', [
    { name: 'a', estimatedHoursTotal: 10 },
    { name: 'b', estimatedHoursTotal: 9 },
  ], [slot('d1', 9, 10), slot('d2', 9, 10), slot('d3', 9, 10), slot('d4', 9, 10)]);
  assert.deepEqual(plan.map((p) => p.topic), ['a', 'b', 'a', 'b']);
});

test('the first two sessions are review, the rest are practice', () => {
  const { plan } = generateInitialStudyPlan('2026-09-01',
    [{ name: 'a', estimatedHoursTotal: 5 }],
    [slot('d1', 9, 10), slot('d2', 9, 10), slot('d3', 9, 10)]);
  assert.deepEqual(plan.map((p) => p.type), ['review', 'review', 'practice']);
});

test('a session is capped at one hour even when the slot is longer', () => {
  const { plan } = generateInitialStudyPlan('2026-09-01',
    [{ name: 'a', estimatedHoursTotal: 5 }], [slot('d1', 8, 14)]);
  assert.equal(plan[0].hours, 1);
});

test('a slot shorter than an hour keeps its real length', () => {
  const { plan } = generateInitialStudyPlan('2026-09-01',
    [{ name: 'a', estimatedHoursTotal: 5 }], [slot('d1', 9, 9.5)]);
  assert.equal(plan[0].hours, 0.5);
});

test('no free slots produces a warning instead of an empty silent plan', () => {
  const { plan, warnings } = generateInitialStudyPlan('2026-09-01',
    [{ name: 'a', estimatedHoursTotal: 5 }], []);
  assert.equal(plan.length, 0);
  assert.deepEqual(warnings, ['No available study slots']);
});

test('no topics also warns rather than planning empty sessions', () => {
  const { plan, warnings } = generateInitialStudyPlan('2026-09-01', [], [slot('d1', 9, 10)]);
  assert.equal(plan.length, 0);
  assert.equal(warnings.length, 1);
});

test('the caller\'s topic list is not reordered underneath them', () => {
  const topics = [{ name: 'light', estimatedHoursTotal: 2 }, { name: 'heavy', estimatedHoursTotal: 20 }];
  generateInitialStudyPlan('2026-09-01', topics, [slot('d1', 9, 10)]);
  assert.equal(topics[0].name, 'light', 'input array was mutated');
});
