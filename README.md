# PassPilot

דמו דפדפן עובד: בוחן + אבחון לפי מבנה מבחן, ומתכנן תרגול לפי תאריך מבחן אמיתי — לא לוח «מרחק מציון עובר» ולא מודל הסתברות מכויל.

> **[דמו חי](https://swissystem7.github.io/PassPilot/)** · בלי שרת, בלי הרשמה, בלי תשלום.

## What / For whom / How

**What:** A Hebrew RTL browser demo (`index.html` + `selftest.mjs`) for four Afeka courses. After a short quiz it ranks weak topics, builds a **date-aware** practice plan, and can print a one-page exam-structure report. Course 10016 also has a four-block code exam in real exam order. It is not a paid product and not a calibrated pass predictor.

**For whom:** Afeka students who already buy union marathons or lecturer video (GOOL / Alon Bauman / Danny Bauman) and want a short diagnosis of *which exam blocks they are losing*, not another video course.

**How:** Open `index.html` or the [live demo](https://swissystem7.github.io/PassPilot/). Pick a course, optional exam date, run a quiz or the 10016 exam mode, then open **דוח מרחק ממבנה המבחן**, **מסלול 55**, or **כרטיס למרתון**. Copy the **PP1** diagnosis code for the union instructor, or paste a coordinator JSON map. History stays in `localStorage` on this browser only. Run `npm test` (or `node selftest.mjs`) to check the planner contract.

## מה עובד היום

| קורס באפקה | מספר | מה יש |
|---|---|---|
| מבוא לפייתון | 10016 | בוחן רב-ברירה + מצב מבחן: 4 שאלות כתיבת קוד בסדר המועד |
| ארגון המחשב ושפת סף | 10145 | בוחן רב-ברירה בלבד |
| חדו״א 1 | 90901 | בוחן רב-ברירה בלבד |
| חדו״א 2 | 90902 | בוחן רב-ברירה בלבד |

- **מתכנן תלוי-תאריך.** שדה «תאריך המבחן», אופק מ-`parseExamDate`, אזהרת חוסר זמן, חיתוך ל-14 יום. `node selftest.mjs` עובר.
- **דוח מרחק ממבנה המבחן.** עמוד אחד להדפסה: מפת נושא×נקודות, איפה מאבדים, 2–3 הבלוקים היקרים, תוכנית ימים. רק שאלה 11 ב-10145 מתועדת כ-44 נק׳; שאר החלוקות מסומנות כהנחה.
- **מסלול 55.** מסלול חמדן (נקודות לשעת מאמץ) עם חשבון גלוי. ציון עובר רשמי באפקה הוא **60**; 55 הוא רצפת ביניים של הפיצ׳ר, לא הבטחת מעבר.
- **כרטיס למרתון.** פיצול 16 שעות + שלוש שאלות למדריך — הארטיפקט שמיועד לצירוף למרתון אגודה.
- **קוד אבחון לשיתוף (`PP1…`).** אחרי בוחן נוצר קוד להעתקה. האגודה או המדריך מדביקים אותו אצלם ורואים את אותה מפת אובדן-נקודות. בלי שם, בלי תשובות מלאות, בלי שרת. קוד פגום נדחה.
- **מפת מבחן מותאמת לרכז.** רכז מדביק JSON של נושא×נקודות במקום ההנחה השווה המובנית. המפה מסומנת «הודבק על ידי רכז» — לא חתימה של אפקה.
- **תור חזרה לנושאים שפספסת.** מרווח 1→3→7→14 יום אחרי סשן נקי. זה לא Anki ולא FSRS; רק הנושאים שהבוחן כבר בדק.
- **בלי מספר «סיכוי מעבר».** הנוסחה הישנה הוסרה.
- **תאריכי תוכנית לפי שעון מקומי.** היסטוריה לפי קורס, כולל מצב מבחן. מעבר קורס לא מחזיר «מילונים» לבוחן הפייתון.

ארכיטקטורה: מאגרים ב-`src/lib/banks.js`, מתכנן+בחירת שאלות ב-`src/lib/engine.js` (גם `selftest.mjs` טוען אותו), מפת מבנה ב-`src/lib/examBlueprint.js`, דירוג חולשות ב-`src/lib/planner.js`, קוד שיתוף ב-`src/lib/shareCode.js`, תור חזרה ב-`src/lib/srsQueue.js`. `index.html` הוא מכונת מצבים אחת (`start`/`quiz`/`exam`/`results`) בלי IIFE שמתקנים זה את זה.

## מה זה *לא*

- לא לוח בקרת מעבר עם טווחי 45–59 / חלוקת 65/25/10.
- לא מודל «תעבור ב-55». [ציון עובר באפקה הוא 60](https://www.afeka.ac.il/media/rpiplqrb/1764662116_%D7%A0%D7%95%D7%94%D7%9C_%D7%91%D7%97%D7%99%D7%A0%D7%95%D7%AA_%D7%95%D7%AA%D7%A8%D7%92%D7%99%D7%9C%D7%99%D7%9D_%D7%9C%D7%A1%D7%98%D7%95%D7%93%D7%A0%D7%98%D7%99%D7%9D_ndash_%D7%AA%D7%95%D7%90%D7%A8_%D7%A8%D7%90%D7%A9%D7%95%D7%9F.pdf) ([רשימת הנהלים](https://www.afeka.ac.il/about-afeka/general-information/procedures-and-standards/)).
- לא בנק פריטים מקצועי ולא תחליף למרתון / וידאו מרצה.
- אין משתמשים משלמים, אין שרת, אין מדידת שיעור מעבר.

מסמכים ישנים שסותרים את זה (האקתון, Validation שיווקי) יושבים ב-[`docs/archive/`](docs/archive/INDEX.md).

## מה המחקר מצא

הדוח המלא: [`RESEARCH.md`](RESEARCH.md) (13.8.2026). פסק הדין: **PIVOT**.

1. **השוק כבר משלם על מרתונים ווידאו, לא על לוח עדיפויות.** מרתוני [אגודת אפקה](https://aguda-afeka.org.il/marathon/) בסמסטר ב׳ 2026: **220–270 ₪**. קורס וידאו של [אלון באומן באפקה](https://mechanical-engineering.alonbaumann.co.il/) חוזר ב-**349 ₪**. [דני באומן](https://baumann.co.il/): סמסטר אפקה **329 ₪** (עמוד המוסד נחסם לבוטים; המחיר מהמחקר). מבצעי אגודות ל-[GOOL](https://www.gool.co.il/): סמסטר **299–349 ₪**.

2. **מסלול MCQ עצמאי מפסיד כי עלות התוכן כבר שולמה אצל היריב.** [GOOL — שאלות נפוצות](https://www.gool.co.il/Home/Questions) נבנית על התאמה למוסד/מרצה. בלי בנק בסגנון המבחן המתכנן הוא יומן משימות.

3. **הגרעין שכן שווה משהו הוא האבחון — כתוספת.** שליפה מגובה ([Roediger & Karpicke 2006](https://doi.org/10.1111/j.1467-9280.2006.01693.x); [Dunlosky et al. 2013](https://doi.org/10.1177/1529100612453266)). אופטימיזציית «וותר עד 55» לא מגובה בניסוי. ניסוי מחיר: **20–40 ₪** מעל מרתון ~270 ₪. הצעד הבא: שיחה עם רמ״ד אקדמיה ב-[דף המרתונים](https://aguda-afeka.org.il/marathon/), לא קורס חמישי בקוד.

## הפעלה

```bash
# דפדפן
start index.html   # Windows; או לחיצה כפולה על הקובץ

# כל הבדיקות: node --test + selftest.mjs
npm test
```

## רישיון

ראו `LICENSE`.
