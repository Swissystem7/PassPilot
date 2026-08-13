// PassPilot — instructor course packs from pasted JSON. No DOM.
// A pack is a new course: topics, MCQ with worked solutions, optional
// exam items and a point map. Builtin Afeka ids cannot be overwritten.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const PACK_STORE = "passpilot.packs.v1";
  const BUILTIN_IDS = Object.freeze(["python", "arch", "hedva1", "hedva2"]);
  const ID_RE = /^[a-z][a-z0-9_-]{1,31}$/;

  function sibling(name, exportName, options, optionKey) {
    if (options && typeof options[optionKey] === "function") return options[optionKey];
    if (typeof globalThis !== "undefined" && typeof globalThis[exportName] === "function") {
      return globalThis[exportName];
    }
    if (typeof require === "function") return require("./" + name)[exportName];
    throw new Error(exportName + " missing");
  }

  function isBuiltinId(id) {
    return BUILTIN_IDS.indexOf(id) > -1;
  }

  function asObject(raw) {
    if (raw == null || String(raw).trim() === "") return { ok: false, error: "חסר JSON" };
    if (typeof raw === "object" && !Array.isArray(raw)) return { ok: true, data: raw };
    try {
      const data = JSON.parse(String(raw));
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        return { ok: false, error: "השורש חייב להיות אובייקט" };
      }
      return { ok: true, data: data };
    } catch (e) {
      return { ok: false, error: "JSON לא תקין" };
    }
  }

  function parseTopics(raw) {
    const out = {};
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
    Object.keys(raw).forEach(function (k) {
      const key = String(k).trim();
      const label = typeof raw[k] === "string" ? raw[k].trim() : "";
      if (key && label) out[key] = label;
    });
    return out;
  }

  function parseQuestion(q, i, topics) {
    if (!q || typeof q !== "object") return { error: "שאלה " + (i + 1) + " אינה אובייקט" };
    const topic = typeof q.topic === "string" ? q.topic.trim() : "";
    if (!topic) return { error: "שאלה " + (i + 1) + " חסרה topic" };
    if (!Object.prototype.hasOwnProperty.call(topics, topic)) {
      return { error: "שאלה " + (i + 1) + " בנושא לא מוכר: " + topic };
    }
    const question = typeof q.question === "string" ? q.question.trim() : "";
    if (!question) return { error: "שאלה " + (i + 1) + " חסרה question" };
    const options = Array.isArray(q.options) ? q.options.map(function (o) { return String(o); }) : [];
    if (options.length < 2) return { error: "שאלה " + (i + 1) + " צריכה לפחות שתי אפשרויות" };
    const answerIdx = Number(q.answerIdx);
    if (!Number.isInteger(answerIdx) || answerIdx < 0 || answerIdx >= options.length) {
      return { error: "שאלה " + (i + 1) + " עם answerIdx לא תקין" };
    }
    const explanation = typeof q.explanation === "string" ? q.explanation.trim() : "";
    if (explanation.length < 8) {
      return { error: "שאלה " + (i + 1) + " חייבת פתרון עבודה (explanation) — לא רק את האות הנכונה" };
    }
    let difficulty = Number(q.difficulty);
    if (difficulty !== 1 && difficulty !== 2 && difficulty !== 3) difficulty = 2;
    const id = q.id == null ? (90000 + i) : q.id;
    return {
      question: {
        id: id,
        topic: topic,
        difficulty: difficulty,
        question: question,
        options: options,
        answerIdx: answerIdx,
        explanation: explanation,
      },
    };
  }

  function parseExamItem(item, i) {
    if (!item || typeof item !== "object") return { error: "פריט כתיבה " + (i + 1) + " אינו אובייקט" };
    const topic = typeof item.topic === "string" ? item.topic.trim() : "";
    const prompt = typeof item.prompt === "string" ? item.prompt.trim() : "";
    const referenceSolution = typeof item.referenceSolution === "string" ? item.referenceSolution.trim() : "";
    const explanation = typeof item.explanation === "string" ? item.explanation.trim() : "";
    if (!topic || !prompt || !referenceSolution || explanation.length < 8) {
      return { error: "פריט כתיבה " + (i + 1) + " חייב topic, prompt, referenceSolution ופתרון עבודה" };
    }
    return {
      item: {
        topic: topic,
        prompt: prompt,
        referenceSolution: referenceSolution,
        explanation: explanation,
      },
    };
  }

  function equalBlueprint(courseId, title, topics) {
    const keys = Object.keys(topics);
    if (!keys.length) return null;
    const each = Math.floor(100 / keys.length);
    const blocks = keys.map(function (k, i) {
      return {
        id: k,
        topic: k,
        label: topics[k],
        points: i === 0 ? 100 - each * (keys.length - 1) : each,
        source: "coordinator",
      };
    });
    return {
      courseId: courseId,
      title: title,
      examLabel: "מפה שווה שנבנתה מחבילת המדריך — לא מפתח רשמי",
      totalPoints: 100,
      passOfficial: 60,
      pointMapNote: "מפה שווה לפי נושאי החבילה. זו לא חתימה של אפקה.",
      blocks: blocks,
    };
  }

  function parseCoursePack(raw, options) {
    const parsed = asObject(raw);
    if (!parsed.ok) return { ok: false, errors: [parsed.error], warnings: [], pack: null };
    const data = parsed.data;
    const errors = [];
    const warnings = [];
    const id = typeof data.id === "string" ? data.id.trim() : "";
    if (!ID_RE.test(id)) errors.push("id חייב להיות slug באנגלית (אות קטנה, ספרות, מקף), 2–32 תווים");
    if (isBuiltinId(id)) errors.push("אי אפשר לדרוס קורס מובנה («" + id + "»). בחרו id חדש.");
    const title = typeof data.title === "string" ? data.title.trim() : "";
    if (!title) errors.push("חסר title");
    const quizTopics = parseTopics(data.quizTopics || data.topics);
    if (!Object.keys(quizTopics).length) errors.push("חסרה מפת quizTopics (נושא ← כותרת עברית)");
    const incoming = Array.isArray(data.questions) ? data.questions : [];
    if (!incoming.length) errors.push("חסרה רשימת questions");
    const questions = [];
    incoming.forEach(function (q, i) {
      const one = parseQuestion(q, i, quizTopics);
      if (one.error) errors.push(one.error);
      else questions.push(one.question);
    });
    const examItems = [];
    if (Array.isArray(data.examItems)) {
      data.examItems.forEach(function (item, i) {
        const one = parseExamItem(item, i);
        if (one.error) errors.push(one.error);
        else examItems.push(one.item);
      });
    }
    const examBlocks = Array.isArray(data.examBlocks) ? data.examBlocks.map(function (b, i) {
      return {
        number: Number(b && b.number) || (i + 1),
        topic: b && b.topic,
        title: (b && b.title) || (b && b.topic) || ("שאלה " + (i + 1)),
        emphasis: (b && b.emphasis) || "",
      };
    }).filter(function (b) { return b.topic; }) : [];
    const hasExam = !!(data.hasExam && examItems.length && examBlocks.length);
    if (data.hasExam && !hasExam) {
      warnings.push("hasExam סומן אבל חסרים examBlocks/examItems — הסימולציה תהיה רב-ברירה");
    }

    let blueprint = null;
    if (data.blueprint) {
      const parseBp = sibling("examBlueprint", "parseCoordinatorBlueprint", options, "parse");
      const bp = parseBp(data.blueprint, id);
      if (!bp.ok) {
        errors.push("מפת המבנה בחבילה נדחתה: " + bp.errors.join(" · "));
      } else {
        blueprint = bp.blueprint;
        blueprint.courseId = id;
        warnings.push.apply(warnings, bp.warnings || []);
      }
    } else if (Object.keys(quizTopics).length) {
      blueprint = equalBlueprint(id, title, quizTopics);
      warnings.push("לא צורפה מפת נקודות — נבנתה חלוקה שווה לשקיפות, לא מפתח מועד");
    }

    const topicNotes = {};
    if (data.topicNotes && typeof data.topicNotes === "object" && !Array.isArray(data.topicNotes)) {
      Object.keys(data.topicNotes).forEach(function (k) {
        const n = data.topicNotes[k];
        if (!n || typeof n !== "object") return;
        topicNotes[k] = {
          gist: typeof n.gist === "string" ? n.gist.trim() : "",
          nextMove: typeof n.nextMove === "string" ? n.nextMove.trim() : "",
        };
      });
    }

    if (errors.length) return { ok: false, errors: errors, warnings: warnings, pack: null };

    const labelTopics = parseTopics(data.labelTopics);
    const labels = Object.assign({}, quizTopics, labelTopics);
    const note = typeof data.note === "string" ? data.note.trim() : "";

    const pack = {
      id: id,
      title: title,
      note: note || "קורס שהודבק במצב מדריך — לא קורס מובנה של אפקה.",
      quizTopics: quizTopics,
      labelTopics: labels,
      questions: questions,
      examBlocks: examBlocks,
      examItems: examItems,
      hasExam: hasExam,
      blueprint: blueprint,
      topicNotes: topicNotes,
      custom: true,
    };
    return { ok: true, errors: [], warnings: warnings, pack: pack };
  }

  function packToCourse(pack) {
    if (!pack) return null;
    return {
      id: pack.id,
      title: pack.title,
      note: pack.note,
      quizTopics: pack.quizTopics,
      labelTopics: pack.labelTopics || pack.quizTopics,
      questions: pack.questions || [],
      examBlocks: pack.examBlocks || [],
      examItems: pack.examItems || [],
      hasExam: !!pack.hasExam,
      custom: true,
      topicNotes: pack.topicNotes || {},
    };
  }

  function emptyStore() {
    return {};
  }

  function parseStore(raw) {
    if (raw == null || raw === "") return emptyStore();
    try {
      const v = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!v || typeof v !== "object" || Array.isArray(v)) return emptyStore();
      const out = {};
      Object.keys(v).forEach(function (k) {
        if (isBuiltinId(k)) return;
        if (v[k] && v[k].id && Array.isArray(v[k].questions)) out[k] = v[k];
      });
      return out;
    } catch (e) {
      return emptyStore();
    }
  }

  function putPack(store, pack) {
    const next = Object.assign({}, store || {});
    if (!pack || !pack.id || isBuiltinId(pack.id)) return next;
    next[pack.id] = pack;
    return next;
  }

  function dropPack(store, id) {
    const next = Object.assign({}, store || {});
    delete next[id];
    return next;
  }

  function loadPacks(storage) {
    if (!storage || typeof storage.getItem !== "function") return emptyStore();
    return parseStore(storage.getItem(PACK_STORE));
  }

  function savePacks(storage, store) {
    if (!storage || typeof storage.setItem !== "function") return false;
    try {
      storage.setItem(PACK_STORE, JSON.stringify(store || {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  const EXAMPLE_PACK = {
    id: "logic-demo",
    title: "לוגיקה קצרה · דמו מדריך",
    note: "חבילת דוגמה. לא קורס אפקה.",
    quizTopics: { tautology: "טאוטולוגיות", sets: "קבוצות" },
    questions: [
      {
        topic: "tautology",
        difficulty: 1,
        question: "איזו נוסחה היא טאוטולוגיה?",
        options: ["p ∧ ¬p", "p ∨ ¬p", "p → ¬p", "¬(p ∨ ¬p)"],
        answerIdx: 1,
        explanation: "p או לא-p מכסה את כל העולמות. זו הגדרת טאוטולוגיה הקלאסית; השאר ניתנות להפרכה בהשמה אחת.",
      },
      {
        topic: "tautology",
        difficulty: 2,
        question: "אם p→q שקר, מה בהכרח נכון?",
        options: ["p שקר", "q אמת", "p אמת ו-q שקר", "שניהם שקר"],
        answerIdx: 2,
        explanation: "גרירה נכשלת רק בשורה אחת של טבלת האמת: המקור אמת והתוצאה שקר.",
      },
      {
        topic: "sets",
        difficulty: 1,
        question: "מהו A ∩ ∅?",
        options: ["A", "∅", "U", "A ∪ ∅"],
        answerIdx: 1,
        explanation: "אין איבר ששייך לקבוצה הריקה, ולכן החיתוך ריק תמיד.",
      },
      {
        topic: "sets",
        difficulty: 2,
        question: "מתי A ⊆ B?",
        options: ["כל איבר של B שייך ל-A", "כל איבר של A שייך ל-B", "A ו-B זרות", "A = ∅ בהכרח"],
        answerIdx: 1,
        explanation: "הכלה: אין איבר ב-A שיושב מחוץ ל-B. הקבוצה הריקה מוכלת בכל קבוצה, אבל זה מקרה פרטי — לא התנאי.",
      },
    ],
    blueprint: {
      courseId: "logic-demo",
      title: "לוגיקה קצרה",
      examLabel: "מפה לדוגמה",
      blocks: [
        { id: "t", topic: "tautology", label: "טאוטולוגיות", points: 50 },
        { id: "s", topic: "sets", label: "קבוצות", points: 50 },
      ],
    },
    topicNotes: {
      tautology: {
        gist: "טאוטולוגיה נכונה בכל השמה. הפרכה אחת מספיקה כדי לפסול.",
        nextMove: "בנו טבלת אמת קצרה לשורה שנכשלה.",
      },
      sets: {
        gist: "חיתוך, איחוד והכלה נבדלים. ריקה בחיתוך תמיד ריקה.",
        nextMove: "ציירו שני מעגלי ון ובדקו הכלה מול חיתוך.",
      },
    },
  };

  return {
    PACK_STORE: PACK_STORE,
    BUILTIN_IDS: BUILTIN_IDS,
    EXAMPLE_PACK: EXAMPLE_PACK,
    isBuiltinId: isBuiltinId,
    parseCoursePack: parseCoursePack,
    packToCourse: packToCourse,
    parseStore: parseStore,
    putPack: putPack,
    dropPack: dropPack,
    loadPacks: loadPacks,
    savePacks: savePacks,
  };
});
