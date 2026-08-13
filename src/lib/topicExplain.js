// PassPilot — per-topic notes for missed answers. No DOM, no pass-probability.
// Item explanations stay on the question. This layer says why the *topic*
// costs points and what to drill next. Unknown topics get a generic note
// rather than invented content.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const NOTES = Object.freeze({
    python: Object.freeze({
      loops: {
        gist: "בלולאות נופלים על הגבול העליון של range, על צעד שלילי, ועל לולאה פנימית שרצה יותר פעמים ממה שנראה. כל אחד מהם הוא נקודות במבחן כתיבת קוד, לא רק בבוחן רב-ברירה.",
        nextMove: "כתבו ידנית את ערכי i בכל איטרציה, כולל הלולאה הפנימית. אחר כך פתרו פריט אחד עם break או continue.",
      },
      functions: {
        gist: "ברירת מחדל, ארגומנט בשם, ו-None מפונקציה בלי return הם שלוש טעויות נפרדות. במבחן זה מתחפש ל«הקוד רץ» בלי להחזיר את מה שהתבקש.",
        nextMove: "כתבו חתימה עם ברירת מחדל אחת וארגומנט בשם אחד, והדפיסו את ערך החזרה גם כשאין return.",
      },
      strings: {
        gist: "חיתוך כולל את ההתחלה ולא את הסוף, אינדקסים מתחילים ב-0, ו-split בלי ארגומנט מכווץ רווחים. במבחן 10016 זה בלוק שלם של כתיבת קוד.",
        nextMove: "קחו מחרוזת אחת וכתבו עליה slice, [::-1], split ו-replace — בלי לנחש, עם האינדקסים על הדף.",
      },
      lists: {
        gist: "append משנה במקום, pop בלי אינדקס לוקח מהסוף, ו-list comprehension עם תנאי זורק איברים. רשימה מקוננת נקראת קודם שורה ואז עמודה.",
        nextMove: "פתרו פריט אחד שמשנה רשימה במקום ופריט אחד שמחזיר רשימה חדשה. ההבדל הזה חוזר במועד.",
      },
      conditions: {
        gist: "0, מחרוזת ריקה ו-None הם שקר. elif נבדק רק אם מה שמעליו נכשל. and דורש את שני הצדדים.",
        nextMove: "ציירו את עץ if/elif/else של השאלה שפספסתם והעבירו בה ערך שקרי אחד במכוון.",
      },
      recursion: {
        gist: "בלי תנאי עצירה זה לא פתרון. הסדר בין ההדפסה לקריאה משנה את הפלט, ומחסנית הקריאות היא מה שהמועד בודק — לא «הרקורסיה עובדת».",
        nextMove: "כתבו את מחסנית הקריאות של f(3) על דף, כולל מה מוחזר בכל רמה. אחר כך פתרו פריט כתיבה אחד.",
      },
      dictionaries: {
        gist: "get עם ברירת מחדל, items, ו-setdefault הם הכלים של בלוק המילונים. מפתח חסר בלי get זורק KeyError — במבחן זה נראה כ«הקוד לא רץ».",
        nextMove: "כתבו ספירת שכיחויות וקיבוץ לפי מפתח. אין לזה עדיין מספיק רב-ברירה בדמו — לכו למצב מבחן.",
      },
    }),
    arch: Object.freeze({
      datapath: {
        gist: "שאלה 11 לבדה 44 נקודות. ALUSrc, MemWrite/RegWrite ב-sw, ומתי נקבע ה-PC ב-beq — אלה לא פרטי מימוש, אלה רוב הציון.",
        nextMove: "ציירו את מסלול lw המלא (חמישה שלבים) וסמנו איזה אות בקרה דולק בכל פקודה: R-type, lw, sw, beq.",
      },
      pipeline: {
        gist: "data hazard ≠ control hazard. forwarding פותר תלות בנתון חוץ מ-load-use, שדורש stall. חישוב מחזורים בלי תלויות הוא 5+(n-1).",
        nextMove: "קחו זוג lw ואז add שמשתמש בתוצאה, וסמנו איפה forwarding נכשל ולמה נדרש stall.",
      },
      cache: {
        gist: "אינדקס = (כתובת/גודל בלוק) mod מספר בלוקים. הגדלת בלוק עוזרת ל-spatial locality עד שהתחרות והעונש גדלים. write-back ≠ write-through.",
        nextMove: "חשבו אינדקס אחד ביד (כמו 1200 עם בלוק 16 ו-64 שורות) ואז הסבירו לעצמכם dirty bit.",
      },
      formats: {
        gist: "R/I/J בלבד. ב-R-type ה-op הוא 0 והפעולה ב-funct. $zero קבוע בחומרה. אין subi — יש addi שלילי.",
        nextMove: "פרקו פקודת R-type אחת לשדות בסיביות, וכתבו איך blt מתורגם ל-slt+bne.",
      },
      memory: {
        gist: "lw/sw דורשים כתובת שמתחלקת ב-4. ההיסט יכול להיות שלילי. MIPS בתיאוריה Big Endian; MARS מציג Little Endian — הפער הזה מפיל בתרגילים.",
        nextMove: "חשבו כתובת של lw $t0, -8($s1) ואז כתבו מה כל בית מכיל במודל Big Endian מול מה ש-MARS יראה.",
      },
      numbers: {
        gist: "sra משכפל סימן (חלוקה במשלים ל-2); srl מכניס אפסים. slt רגיש לסימן. קבוע 32 סיביות = lui ואז ori.",
        nextMove: "קחו מספר שלילי ב-8 סיביות, בצעו sra 1 ו-srl 1, והשוו. אחר כך טענו קבוע 0x12345678 בשתי פקודות.",
      },
    }),
    hedva1: Object.freeze({
      limits: {
        gist: "לופיטל רק ב-0/0 או ∞/∞. רציפות דורשת הגדרה, גבול, ושוויון. ערך הביניים נותן שורש בקטע סגור כש-f(a)·f(b)<0 — בלי מונוטוניות.",
        nextMove: "פתרו גבול אחד עם זהות sin, אחד עם לופיטל אחרי הבאת הצורה, ובדקו רציפות בנקודה עם שלושת התנאים.",
      },
      deriv: {
        gist: "מכפלה, שרשרת וגזירה סתומה הם רוב הנקודות. f'=0 היא נקודה חשודה, לא קיצון. arctan ו-ln מופיעים גם באינטגרלים.",
        nextMove: "גזרו מכפלה אחת, שרשרת אחת (כמו e^(x²)), וגזירה סתומה אחת. אל תדלגו על בדיקת הסימן אחרי f'=0.",
      },
      analysis: {
        gist: "אסימפטוטה אנכית דורשת מכנה שמתאפס וגבול אינסופי — אם המונה מתאפס זו אולי סליקה. f'' קובעת קמירות. משופעת = שני גבולות.",
        nextMove: "לקחו פונקציה רציונלית אחת: תחום, אנכיות, משופעת, וסימן f'' בקטע.",
      },
      integrals: {
        gist: "∫1/x = ln|x|+C עם הערך המוחלט. x·e^x בחלקים, 1/(x²-1) בשברים חלקיים. שטח בין עקומות דורש נקודות חיתוך.",
        nextMove: "סמנו מראש את השיטה (חלקים / שברים / הצבה) לפני שאתם מתחילים לחשב, ואז בדקו בגזירה.",
      },
    }),
    hedva2: Object.freeze({
      improper: {
        gist: "∫₁^∞ 1/x^p מתכנס רק כש-p>1. בקטע (0,1] זה הפוך: p<1. מלכודת שחוזרת. השוואה ל-1/x^p היא הכלי, לא «נראה שמתכנס».",
        nextMove: "כתבו את שני מבחני ה-p על דף זה ליד זה, ואז טפלו באי-רציפות בקצה כגבול חד-צדדי.",
      },
      series: {
        gist: "גיאומטרי מתכנס ב-|q|<1. האיבר→0 הוא הכרחי ולא מספיק (הרמוני). מנת L<1 מוחלט; L=1 לא מכריע. רדיוס לחוד, קצוות לחוד.",
        nextMove: "בדקו טור אחד במנה, אחד בהשוואה, וטור חזקות אחד כולל שני הקצוות.",
      },
      multivar: {
        gist: "נקודה קריטית: שתי החלקיות מתאפסות. הסיאן מסווג. כופלי לגראנז' לאילוץ. הגרדיאנט הוא כיוון העלייה התלולה.",
        nextMove: "מצאו נקודה קריטית אחת, חשבו D ו-fxx, ואז כתבו את מערכת ∇f=λ∇g לאילוץ פשוט.",
      },
      complex: {
        gist: "פולרי + דה-מואבר. n שורשים על מעגל. הצמוד נותן |z|² במכפלה — כך מחלקים.",
        nextMove: "העבירו z אחד לפולרי, העלו בחזקה, וחלצו את n השורשים עם הפרש 2π/n.",
      },
    }),
  });

  const GENERIC = Object.freeze({
    gist: "אין בדמו הסבר מובנה לנושא הזה. נשארים עם פתרון העבודה של הפריט שפספסתם — בלי להמציא חומר.",
    nextMove: "חזרו על הפריט עם הפתרון הגלוי, ואז פתרו פריט נוסף מאותו נושא אם יש במאגר.",
  });

  function noteFor(courseId, topic, extraNotes) {
    const extras = extraNotes && typeof extraNotes === "object" ? extraNotes : {};
    if (extras[topic] && typeof extras[topic] === "object") {
      const n = extras[topic];
      if ((n.gist && String(n.gist).trim()) || (n.nextMove && String(n.nextMove).trim())) {
        return {
          gist: String(n.gist || GENERIC.gist).trim() || GENERIC.gist,
          nextMove: String(n.nextMove || GENERIC.nextMove).trim() || GENERIC.nextMove,
          source: "pack",
        };
      }
    }
    const course = NOTES[courseId] || null;
    const builtin = course && course[topic];
    if (builtin) {
      return { gist: builtin.gist, nextMove: builtin.nextMove, source: "builtin" };
    }
    return { gist: GENERIC.gist, nextMove: GENERIC.nextMove, source: "generic" };
  }

  function explainMisses(rows, courseId, labels, extraNotes) {
    const acc = {};
    (Array.isArray(rows) ? rows : []).forEach(function (a) {
      if (!a || typeof a.topic !== "string") return;
      const t = acc[a.topic] || (acc[a.topic] = { n: 0, wrong: 0 });
      t.n += 1;
      if (!a.correct) t.wrong += 1;
    });
    const map = labels && typeof labels === "object" ? labels : {};
    return Object.keys(acc)
      .filter(function (topic) { return acc[topic].wrong > 0; })
      .map(function (topic) {
        const note = noteFor(courseId, topic, extraNotes);
        const stat = acc[topic];
        return {
          topic: topic,
          label: map[topic] || topic,
          n: stat.n,
          wrong: stat.wrong,
          gist: note.gist,
          nextMove: note.nextMove,
          source: note.source,
        };
      })
      .sort(function (a, b) { return b.wrong - a.wrong || a.topic.localeCompare(b.topic); });
  }

  return {
    NOTES: NOTES,
    GENERIC: GENERIC,
    noteFor: noteFor,
    explainMisses: explainMisses,
  };
});
