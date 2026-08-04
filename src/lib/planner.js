// PassPilot — the three rules the product actually rests on.
//
// These were already written as pure functions, but they lived inside
// index.html where nothing could run them. They are the whole thesis of the
// tool, so they belong in one tested place:
//
//   weakTopicRanker                which topic buys the most points per hour
//   calculateInitialPassProbability  how close to passing the student is now
//   generateInitialStudyPlan       what to actually do with the free slots
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  // A topic is ranked mostly by how often it is answered wrong, and partly by
  // how slow it is relative to the slowest topic — a topic answered correctly
  // but painfully slowly still costs points under exam time pressure.
  const ERROR_WEIGHT = 0.7;
  const SLOWNESS_WEIGHT = 0.3;

  const DIFFICULTY_FACTOR = Object.freeze({ easy: 1, medium: 0.8, hard: 0.6 });
  const DEFAULT_DIFFICULTY = 'medium';

  const round3 = (n) => Math.round(n * 1000) / 1000;

  function weakTopicRanker(results) {
    if (!Array.isArray(results)) throw new TypeError('Input must be an array');

    // Silently drop malformed rows rather than poisoning the ranking: this is
    // fed by timing data from the browser, which can arrive incomplete.
    const valid = results.filter(
      (r) => r && typeof r.topic === 'string' && Number.isFinite(r.secondsSpent) && r.secondsSpent >= 0
    );

    const byTopic = new Map();
    for (const r of valid) {
      if (!byTopic.has(r.topic)) byTopic.set(r.topic, { total: 0, wrong: 0, seconds: 0 });
      const d = byTopic.get(r.topic);
      d.total++;
      if (!r.correct) d.wrong++;
      d.seconds += r.secondsSpent;
    }

    const rows = [...byTopic].map(([topic, d]) => ({
      topic,
      total: d.total,
      wrong: d.wrong,
      avgSeconds: d.seconds / d.total,
    }));

    const slowest = Math.max(0, ...rows.map((r) => r.avgSeconds));

    return rows
      .map((r) => ({
        topic: r.topic,
        score: round3(
          (r.wrong / r.total) * ERROR_WEIGHT +
            (slowest ? r.avgSeconds / slowest : 0) * SLOWNESS_WEIGHT
        ),
        attempts: r.total,
        errorRate: round3(r.wrong / r.total),
      }))
      // Ties break alphabetically so the same input always renders the same list.
      .sort((a, b) => b.score - a.score || a.topic.localeCompare(b.topic));
  }

  function calculateInitialPassProbability(correct, total, difficulty = DEFAULT_DIFFICULTY) {
    if (
      !Number.isInteger(total) || total <= 0 ||
      !Number.isInteger(correct) || correct < 0 || correct > total
    ) throw new Error('invalid score');
    if (correct === 0) return 0;
    return (correct / total) * (DIFFICULTY_FACTOR[difficulty] || DIFFICULTY_FACTOR[DEFAULT_DIFFICULTY]);
  }

  function generateInitialStudyPlan(examDate, topics, slots) {
    const plan = [];
    const warnings = [];
    // Heaviest topics first, then round-robin, so no topic is starved when
    // there are fewer slots than topics.
    const ordered = [...topics].sort((a, b) => b.estimatedHoursTotal - a.estimatedHoursTotal);

    let index = 0;
    for (const slot of slots) {
      if (!ordered.length) break;
      const topic = ordered[index % ordered.length];
      plan.push({
        date: slot.day,
        topic: topic.name,
        hours: Math.min(1, slot.endHour - slot.startHour),
        // The first two sessions revisit material; everything after is drilling.
        type: index < 2 ? 'review' : 'practice',
      });
      index++;
    }

    if (!plan.length) warnings.push('No available study slots');
    return { plan, warnings };
  }

  return {
    weakTopicRanker,
    calculateInitialPassProbability,
    generateInitialStudyPlan,
    ERROR_WEIGHT,
    SLOWNESS_WEIGHT,
    DIFFICULTY_FACTOR,
  };
});
