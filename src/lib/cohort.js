// PassPilot — classroom roster from many PP1 codes. No DOM, no names, no server.
// The union instructor pastes WhatsApp codes; we build a room heatmap.
// Identical adjacent codes still count as two students (two people, same map).
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const LIVE_URL = "https://swissystem7.github.io/PassPilot/";

  function sibling(name, exportName, options, optionKey) {
    if (options && typeof options[optionKey] === "function") return options[optionKey];
    if (typeof globalThis !== "undefined" && typeof globalThis[exportName] === "function") {
      return globalThis[exportName];
    }
    if (typeof require === "function") return require("./" + name)[exportName];
    throw new Error(exportName + " missing");
  }

  function extractStudentCodes(raw) {
    const s = String(raw == null ? "" : raw);
    const out = [];
    let i = 0;
    while (i < s.length) {
      const start = s.indexOf("PP1", i);
      if (start < 0) break;
      let j = start;
      let compact = "";
      let found = false;
      while (j < s.length && compact.length < 5000) {
        const ch = s.charAt(j);
        if (/\s/.test(ch)) {
          j++;
          continue;
        }
        compact += ch;
        if (/^PP1\.[A-Za-z0-9_-]+\.[0-9a-fA-F]{4}$/.test(compact)) {
          out.push(compact);
          i = j + 1;
          found = true;
          break;
        }
        if (compact.length > 3 && compact.indexOf("PP1", 3) >= 0) break;
        if (compact.length >= 8 && compact.indexOf(".") < 0) break;
        j++;
      }
      if (!found) i = start + 3;
    }
    return out;
  }

  function compactKey(blueprint) {
    if (!blueprint || typeof blueprint !== "object") return "";
    try {
      return JSON.stringify(blueprint);
    } catch (e) {
      return "";
    }
  }

  function pickRoomBlueprint(courseId, payloads, instructorOverlay, expandFn) {
    if (instructorOverlay && (!instructorOverlay.courseId || instructorOverlay.courseId === courseId)) {
      return { blueprint: instructorOverlay, source: "instructor", mixed: false };
    }
    const maps = [];
    (payloads || []).forEach(function (p) {
      if (!p || !p.blueprint) return;
      const expanded = expandFn ? expandFn(p.blueprint, courseId) : p.blueprint;
      if (expanded) maps.push(expanded);
    });
    if (!maps.length) return { blueprint: null, source: "builtin", mixed: false };
    const counts = new Map();
    maps.forEach(function (bp) {
      const k = compactKey(bp);
      counts.set(k, (counts.get(k) || 0) + 1);
    });
    let best = maps[0];
    let bestN = 0;
    counts.forEach(function (n, k) {
      if (n > bestN) {
        bestN = n;
        best = maps.find(function (bp) { return compactKey(bp) === k; }) || best;
      }
    });
    return { blueprint: best, source: "codes", mixed: counts.size > 1 };
  }

  function decodeMany(raw, options) {
    const decode = sibling("shareCode", "decodeDiagnosis", options, "decode");
    const codes = extractStudentCodes(raw);
    const students = [];
    const errors = [];
    codes.forEach(function (code, idx) {
      const decoded = decode(code);
      if (!decoded || !decoded.ok) {
        errors.push("קוד " + (idx + 1) + ": " + ((decoded && decoded.error) || "פענוח נכשל"));
        return;
      }
      students.push({
        index: students.length + 1,
        code: code,
        payload: decoded.payload,
      });
    });
    return { codes: codes, students: students, errors: errors };
  }

  function roomBlocks(diagnoses) {
    const acc = new Map();
    diagnoses.forEach(function (d) {
      (d.blocks || []).forEach(function (b) {
        const key = b.topic || b.id;
        if (!key) return;
        const row = acc.get(key) || {
          topic: b.topic,
          label: b.label,
          points: b.points,
          nAttempted: 0,
          nMissed: 0,
          nUntested: 0,
          nThin: 0,
          sumAccuracy: 0,
          sumLost: 0,
        };
        if (!b.attempts) {
          row.nUntested += 1;
        } else {
          row.nAttempted += 1;
          row.sumAccuracy += b.accuracy || 0;
          if ((b.accuracy || 0) < 1) row.nMissed += 1;
          if (b.sample === "thin") row.nThin += 1;
        }
        if (b.lost != null) row.sumLost += b.lost;
        acc.set(key, row);
      });
    });
    const n = diagnoses.length || 1;
    return Array.from(acc.values()).map(function (r) {
      return {
        topic: r.topic,
        label: r.label,
        points: r.points,
        nAttempted: r.nAttempted,
        nMissed: r.nMissed,
        nUntested: r.nUntested,
        nThin: r.nThin,
        avgAccuracy: r.nAttempted ? Math.round((r.sumAccuracy / r.nAttempted) * 100) : null,
        sumLost: Math.round(r.sumLost * 10) / 10,
        shareMissed: Math.round((r.nMissed / n) * 100),
      };
    }).sort(function (a, b) {
      return b.sumLost - a.sumLost || b.points - a.points || a.topic.localeCompare(b.topic);
    });
  }

  function briefingForCourse(courseId, title, n, openers, mixedMaps) {
    const top = openers[0];
    const second = openers[1];
    let lead = n + " קודים · " + title + ".";
    if (!top) return lead + " אין בלוקים במפה.";
    lead += " " + top.nMissed + " סטודנטים מאבדים נקודות ב«" + top.label + "» (" + top.points + " נק׳).";
    lead += top.nMissed ? " פתחו את המרתון בבלוק הזה." : " אף אחד לא פספס את הבלוק הכבד — בדקו את הבא בתור.";
    if (second && second.nMissed) {
      lead += " אחר כך «" + second.label + "».";
    }
    if (mixedMaps) lead += " בקודים היו מפות שונות — התדריך לפי המפה שנבחרה לחדר.";
    return lead;
  }

  function buildCohort(raw, options) {
    const opts = options || {};
    const diagnose = sibling("examBlueprint", "diagnoseCourse", opts, "diagnose");
    const expand = sibling("examBlueprint", "expandBlueprint", opts, "expand");
    const decoded = decodeMany(raw, opts);
    const byCourse = new Map();
    decoded.students.forEach(function (st) {
      const id = st.payload.courseId || "python";
      if (!byCourse.has(id)) byCourse.set(id, []);
      byCourse.get(id).push(st);
    });
    const overlays = opts.overlays || {};
    const titles = opts.titles || {};
    const courses = [];
    byCourse.forEach(function (students, courseId) {
      const payloads = students.map(function (s) { return s.payload; });
      const picked = pickRoomBlueprint(courseId, payloads, overlays[courseId] || opts.overlay || null, expand);
      const diagnoses = payloads.map(function (p) {
        return diagnose(courseId, p.rows || [], picked.blueprint);
      });
      const blocks = roomBlocks(diagnoses);
      const openers = blocks.filter(function (b) { return b.nMissed > 0 || b.sumLost > 0; }).slice(0, 3);
      const title = titles[courseId] || (diagnoses[0] && diagnoses[0].blueprint && diagnoses[0].blueprint.title) || courseId;
      courses.push({
        courseId: courseId,
        title: title,
        n: students.length,
        mapSource: picked.source,
        mixedMaps: picked.mixed,
        blueprintNote: diagnoses[0] && diagnoses[0].blueprint ? diagnoses[0].blueprint.pointMapNote : "",
        blocks: blocks,
        openers: openers,
        briefing: briefingForCourse(courseId, title, students.length, openers, picked.mixed),
        students: students.map(function (s) {
          return {
            index: s.index,
            courseId: courseId,
            kind: s.payload.kind,
            examDate: s.payload.examDate,
            triples: s.payload.triples,
          };
        }),
      });
    });
    courses.sort(function (a, b) { return b.n - a.n || a.courseId.localeCompare(b.courseId); });
    return {
      ok: decoded.students.length > 0,
      error: decoded.students.length ? null : (decoded.errors[0] || "לא נמצא קוד שמתחיל ב־PP1."),
      nCodes: decoded.codes.length,
      nStudents: decoded.students.length,
      errors: decoded.errors,
      mixedCourses: courses.length > 1,
      courses: courses,
      caveat: "תדריך כיתה לפי בוחן הדמו, לא לפי מועד אפקה. בלי שמות. ציון עובר רשמי הוא 60 — זו לא תחזית ציון.",
    };
  }

  function marathonInvite(courseTitle, url) {
    const link = url || LIVE_URL;
    const course = courseTitle ? " לקורס «" + courseTitle + "»" : "";
    return "לפני המרתון" + course + ": פתחו " + link +
      " עשו בוחן של כ־10 שאלות והדביקו כאן את הקוד שמתחיל ב־PP1. בלי שם ובלי צילום מסך — רק הקוד.";
  }

  function shareLink(code, url) {
    const link = url || LIVE_URL;
    const compact = String(code || "").replace(/\s+/g, "");
    if (compact.indexOf("PP1.") !== 0) return link;
    return link.replace(/#.*$/, "") + "#" + compact;
  }

  return {
    LIVE_URL: LIVE_URL,
    extractStudentCodes: extractStudentCodes,
    decodeMany: decodeMany,
    pickRoomBlueprint: pickRoomBlueprint,
    roomBlocks: roomBlocks,
    briefingForCourse: briefingForCourse,
    buildCohort: buildCohort,
    marathonInvite: marathonInvite,
    shareLink: shareLink,
  };
});
