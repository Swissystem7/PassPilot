// PassPilot — 90-minute "tonight" plan. No DOM, no pass-probability.
// Caps the same gain/effort ranking as מסלול 55 by a time budget and a
// stop rule. The night before an exam, untested small blocks stay closed.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const TONIGHT_HOURS = 1.5;
  const HEAVY_UNTESTED = 40;

  function sibling(name, exportName, options, optionKey) {
    if (options && typeof options[optionKey] === "function") return options[optionKey];
    if (typeof globalThis !== "undefined" && typeof globalThis[exportName] === "function") {
      return globalThis[exportName];
    }
    if (typeof require === "function") return require("./" + name)[exportName];
    throw new Error(exportName + " missing");
  }

  function headingFor(daysToExam) {
    if (daysToExam === 0) return "המבחן היום — 90 דקות חזרה ואז עוצרים";
    if (daysToExam === 1) return "מחר המבחן — הלילה סוגרים בלוקים, לא חומר חדש";
    if (daysToExam != null && daysToExam <= 2) return "נשארו יומיים — סשן ממוקד ל־90 דקות";
    return "סשן ממוקד ל־90 דקות";
  }

  function filterTonightBlocks(blocks, daysToExam) {
    const list = Array.isArray(blocks) ? blocks : [];
    const close = daysToExam != null && daysToExam <= 1;
    return list.filter(function (b) {
      if (!b) return false;
      if ((b.attempts || 0) > 0) return true;
      if (!close) return true;
      return Number(b.points) >= HEAVY_UNTESTED;
    });
  }

  function minutesOf(hours) {
    return Math.max(1, Math.round(Number(hours) * 60));
  }

  function planTonight(blocks, options) {
    const opts = options || {};
    const score = sibling("examBlueprint", "scoreBlocks", opts, "score");
    const budget = Number(opts.hours) > 0 ? Number(opts.hours) : TONIGHT_HOURS;
    const daysToExam = opts.daysToExam == null ? null : Number(opts.daysToExam);
    const incoming = (Array.isArray(blocks) ? blocks : []).filter(Boolean);
    const kept = filterTonightBlocks(incoming, daysToExam);
    const skipped = incoming.filter(function (b) {
      return kept.indexOf(b) === -1;
    });
    const warnings = [];
    let used = kept;
    if (!kept.length && incoming.length) {
      used = incoming;
      warnings.push("אין בלוק שכבר נבחן ואין בלוק כבד לא-נבחן — חוזרים למפה המלאה, בזהירות.");
    }
    if (skipped.length) {
      warnings.push(
        "נדלגו " + skipped.length + " בלוקים לא-נבחנים מתחת ל־" + HEAVY_UNTESTED +
          " נק׳ — בלילה שלפני המבחן לא פותחים נושא חדש קטן."
      );
    }

    const items = score(used)
      .filter(function (it) { return it.gain > 0.05; })
      .sort(function (a, b) { return b.value - a.value || b.gain - a.gain; });

    const actions = [];
    let hoursLeft = budget;
    for (let i = 0; i < items.length; i++) {
      if (hoursLeft <= 0.05) break;
      const it = items[i];
      const take = Math.min(it.effort, hoursLeft);
      actions.push({
        topic: it.topic,
        label: it.label,
        points: it.points,
        gain: it.gain,
        effort: it.effort,
        hours: Math.round(take * 10) / 10,
        minutes: minutesOf(take),
        sample: it.sample,
        attempts: it.attempts,
        partial: take + 0.05 < it.effort,
        why: it.sample === "thin"
          ? ("מדגם דק (" + it.attempts + ") — האובדן המשוער רופף, אבל הבלוק שווה " + it.points + " נק׳")
          : it.attempts === 0
            ? ("לא נבחן, אבל " + it.points + " נק׳ במבנה — כבד מספיק לפתוח גם בלילה")
            : ("+" + it.gain + " נק׳ משוערות תמורת ~" + it.effort + " שעות לפי אותה נוסחת מאמץ של מסלול 55"),
      });
      hoursLeft = Math.round((hoursLeft - take) * 10) / 10;
    }

    const leftover = items.slice(actions.length);
    if (!actions.length && incoming.length) {
      warnings.push("אין בלוק פתוח במפה — חזרה קצרה על הבלוק הכבד ביותר, בלי נושא חדש.");
      const heaviest = incoming.slice().sort(function (a, b) {
        return (b.points || 0) - (a.points || 0);
      })[0];
      if (heaviest) {
        actions.push({
          topic: heaviest.topic,
          label: heaviest.label,
          points: heaviest.points,
          gain: 0,
          effort: budget,
          hours: budget,
          minutes: minutesOf(budget),
          sample: heaviest.sample || "none",
          attempts: heaviest.attempts || 0,
          partial: false,
          why: "המפה סגורה לפי הדיוק הנוכחי. 90 דקות חזרה על הבלוק הכבד, לא חומר חדש.",
        });
      }
    }

    const usedHours = Math.round(actions.reduce(function (s, a) { return s + a.hours; }, 0) * 10) / 10;
    const stop = "עצרו אחרי " + minutesOf(Math.min(budget, usedHours || budget)) +
      " דקות. אל תפתחו נושא רביעי ואל תתחילו סיכום חדש אחרי חצות.";

    return {
      hours: budget,
      daysToExam: daysToExam,
      heading: headingFor(Number.isFinite(daysToExam) ? daysToExam : null),
      actions: actions,
      leftover: leftover.map(function (it) { return it.label || it.topic; }),
      skipped: skipped.map(function (b) { return b.label || b.topic; }),
      warnings: warnings,
      stop: stop,
      caveat: "זה סדר עבודה ל־90 דקות לפי דיוק הבוחן × משקל בלוק. זה לא תחזית ציון ולא הבטחת מעבר. ציון עובר באפקה הוא 60.",
    };
  }

  function focusFromDiagnosis(diag) {
    const src = diag && Array.isArray(diag.costliest) ? diag.costliest : [];
    return src.map(function (b) {
      const lost = b.lost != null ? b.lost : b.points;
      return {
        name: b.label,
        estimatedHoursTotal: Math.round(Math.max(0.5, Number(lost) / 20) * 10) / 10,
      };
    });
  }

  return {
    TONIGHT_HOURS: TONIGHT_HOURS,
    HEAVY_UNTESTED: HEAVY_UNTESTED,
    headingFor: headingFor,
    filterTonightBlocks: filterTonightBlocks,
    planTonight: planTonight,
    focusFromDiagnosis: focusFromDiagnosis,
  };
});
