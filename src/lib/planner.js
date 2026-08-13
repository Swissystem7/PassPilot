// PassPilot — rank which topics cost the most under exam time pressure.
// Date-aware planning lives in engine.js. There is no pass-probability here.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  // Mostly error rate, partly slowness vs the slowest topic — a correct but
  // painfully slow topic still costs points when the clock is running.
  const ERROR_WEIGHT = 0.7;
  const SLOWNESS_WEIGHT = 0.3;

  const round3 = (n) => Math.round(n * 1000) / 1000;

  function weakTopicRanker(results) {
    if (!Array.isArray(results)) throw new TypeError("Input must be an array");

    // Drop malformed rows rather than poisoning the ranking: timing data from
    // the browser can arrive incomplete.
    const valid = results.filter(
      (r) => r && typeof r.topic === "string" && Number.isFinite(r.secondsSpent) && r.secondsSpent >= 0
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
      .sort((a, b) => b.score - a.score || a.topic.localeCompare(b.topic));
  }

  return {
    weakTopicRanker,
    ERROR_WEIGHT,
    SLOWNESS_WEIGHT,
  };
});
