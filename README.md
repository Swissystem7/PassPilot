# PassPilot

דמו דפדפן עובד: בוחן + אבחון לפי מבנה מבחן, ומתכנן תרגול לפי תאריך מבחן אמיתי — לא לוח «מרחק מציון עובר» ולא מודל הסתברות מכויל.

> **[דמו חי](https://swissystem7.github.io/PassPilot/)** · בלי שרת, בלי הרשמה. הגבייה המיועדת היא תוספת 20–40 ₪ בקופת אגודת אפקה — אין משתמשים משלמים היום.

## What / For whom / How

**What:** A Hebrew RTL browser demo (`index.html` + `selftest.mjs`) for four Afeka courses, plus any course an instructor pastes as JSON. After a short quiz it ranks weak topics, explains *why that topic fell*, builds a **date-aware** practice plan, a **90-minute tonight card**, and a printable exam-structure report. **מצב מרתון** is a timed walk through every exam-structure block. The union instructor pastes many `PP1` codes into a **classroom briefing**. A coordinator edits the topic×points map in a form, or authors a new course from a paste. Course 10016 also has a four-block code exam in real exam order. A `PPU1` redeem code from the union unlocks the full diagnosis; without it the quiz is capped at 5 questions. It is not a calibrated pass predictor and has no paying users yet.

**For whom:** Afeka students who already buy union marathons or lecturer video (GOOL / Alon Bauman / Danny Bauman) and want a short diagnosis of *which exam blocks they are losing*, not another video course. Instructors who need a room heatmap or a fifth course without touching the repo.

**How:** Open `index.html` or the [live demo](https://swissystem7.github.io/PassPilot/). Three steps: pick a course and exam date, take the short quiz, see where it is expensive to miss. The free path is 5 questions + weak topics + a date-aware plan. **דוח המבנה**, **מסלול 55**, **כרטיס למרתון**, **הלילה**, **מצב מרתון** and the **PP1** share code open after a `PPU1` redeem (mint a staff demo code under «הצעה לאגודה» — that is documented as bypassing the honor-system lock). Instructors paste many `PP1` codes into **תדריך כיתה**, or a course JSON into **מדריך: קורס חדש**. History stays in `localStorage` on this browser only. Run `npm test` (or `node --test` and `node selftest.mjs`) to check the planner contract.

## מה עובד היום

| קורס באפקה | מספר | מה יש |
|---|---|---|
| מבוא לפייתון | 10016 | בוחן רב-ברירה + מצב מבחן + מצב מרתון (4 בלוקי כתיבת קוד מתוזמנים) |
| ארגון המחשב ושפת סף | 10145 | בוחן רב-ברירה + מצב מרתון לפי מפת הנקודות |
| חדו״א 1 | 90901 | בוחן רב-ברירה + מצב מרתון לפי מפת הנקודות |
| חדו״א 2 | 90902 | בוחן רב-ברירה + מצב מרתון לפי מפת הנקודות |

- **מתכנן תלוי-תאריך.** שדה «תאריך המבחן», אופק מ-`parseExamDate`, אזהרת חוסר זמן, חיתוך ל-14 יום. `node selftest.mjs` עובר.
- **דוח מרחק ממבנה המבחן.** עמוד אחד להדפסה: מפת נושא×נקודות, איפה מאבדים, 2–3 הבלוקים היקרים, תוכנית ימים. רק שאלה 11 ב-10145 מתועדת כ-44 נק׳; שאר החלוקות מסומנות כהנחה.
- **מסלול 55.** מסלול חמדן (נקודות לשעת מאמץ) עם חשבון גלוי. ציון עובר רשמי באפקה הוא **60**; 55 הוא רצפת ביניים של הפיצ׳ר, לא הבטחת מעבר.
- **כרטיס למרתון.** פיצול 16 שעות + שלוש שאלות למדריך — הארטיפקט שמיועד לצירוף למרתון אגודה.
- **קוד אבחון לשיתוף (`PP1…`).** אחרי בוחן נוצר קוד להעתקה. האגודה או המדריך מדביקים אותו אצלם ורואים את אותה מפת אובדן-נקודות. בלי שם, בלי תשובות מלאות, בלי שרת. קוד פגום נדחה.
- **מפת מבחן מותאמת לרכז.** רכז מדביק JSON של נושא×נקודות במקום ההנחה השווה המובנית. המפה מסומנת «הודבק על ידי רכז» — לא חתימה של אפקה.
- **תור חזרה לנושאים שפספסת.** מרווח 1→3→7→14 יום אחרי סשן נקי. זה לא Anki ולא FSRS; רק הנושאים שהבוחן כבר בדק.
- **הלילה, 90 דקות ואז עוצרים.** אחרי בוחן מופיע סשן ממוקד לפי אותה נוסחת נקודות-לשעה של מסלול 55, עם תקציב זמן וכלל עצירה. בלילה שלפני המבחן בלוקים לא-נבחנים מתחת ל־40 נק׳ נשארים סגורים; שאלה 11 (44 נק׳) נשארת פתוחה. כפתור «תרגול עכשיו» על הבלוק היקר.
- **תדריך כיתה למרתון.** המדריך מדביק כמה קודי `PP1` מהוואטסאפ ורואה מפת חום לחדר — באיזה בלוק הכיתה מאבדת נקודות — בלי שמות ובלי שרת. יש הודעה מוכנה לקבוצה, וקישור `#PP1…` שפותח אבחון בודד.
- **טופס מפה לרכז, לפי קורס.** נקודות לכל בלוק בטופס, סכום חי, ייצוא JSON. מפה של פייתון לא זולגת לחדו״א. עדיין מתויגת «הודבק על ידי רכז».
- **מדגם דק.** ניסיון אחד בבלוק מסומן כמדגם דק — האובדן המשוער רופף, לא מפתח מועד.
- **מאגר רחב יותר עם פתרון עבודה.** יותר פריטים לכל נושא, וכל פריט חייב הסבר שעובד את הדרך — לא רק את האות הנכונה.
- **מצב מרתון.** שעון אחד על כל בלוקי מפת המבחן. בפייתון 10016 אלה ארבעה בלוקי כתיבת קוד; בשאר הקורסים רב-ברירה לפי משקל הבלוק. זה לא שעון המועד הרשמי. מה שלא הספקתם נשאר לא-נבחן, לא «טעות».
- **הסבר לפי נושא אחרי טעות.** מתחת לפריט, ואז בסיכום: למה הנושא הזה עולה נקודות ומה הצעד הבא. נושא בלי הערה מובנית מקבל הערה כללית — בלי להמציא שיעור.
- **קורס חדש מהדבקה.** מדריך מדביק JSON (נושאים, שאלות עם פתרון עבודה, מפה אופציונלית) ומקבל קורס שרץ בבוחן, במרתון ובאבחון. אי אפשר לדרוס את ארבעת קורסי אפקה.
- **מגמות בין מפגשים.** דיוק מוקדם מול מאוחר לפי נושא, בלוקים שעוד לא נבחנו, ופיצול בוחן/מבחן/מרתון. היסטוריה מקומית עד 40 מפגשים — לא מודל מכויל.
- **בלי מספר «סיכוי מעבר».** הנוסחה הישנה הוסרה.
- **תאריכי תוכנית לפי שעון מקומי.** היסטוריה לפי קורס, כולל מצב מבחן. מעבר קורס לא מחזיר «מילונים» לבוחן הפייתון. תוכנית הימים אחרי בוחן משוקללת לפי אובדן נקודות במבנה, לא לפי סולם שעות שטוח.
- **גבול חינם / תוספת אגודה.** בלי קוד `PPU1`: בוחן עד 5 שאלות, ציון ונושאים חלשים. עם קוד: דוח, כרטיס מרתון, מסלול 55, מצב מרתון, שיתוף, תדריך כיתה. בלי שרת הקוד אינו הוכחת תשלום.
- **דף מחיר כנה + הצעה לאגודה להדפסה.** 20–40 ₪ כניסוי מעל מרתון 270 ₪, תרחישי חלוקה מסומנים כתרחישים, בלי מספרי משתמשים. פירוט: [`MONETIZATION.md`](MONETIZATION.md).

ארכיטקטורה: מאגרים ב-`src/lib/banks.js`, מתכנן תלוי-תאריך+בחירת שאלות ב-`src/lib/engine.js` (גם `selftest.mjs` טוען אותו), מפת מבנה ב-`src/lib/examBlueprint.js`, דירוג חולשות בלבד ב-`src/lib/planner.js` (בלי נוסחת מעבר), קוד שיתוף ב-`src/lib/shareCode.js`, תור חזרה ב-`src/lib/srsQueue.js`, תוכנית לילה ב-`src/lib/tonight.js`, תדריך כיתה ב-`src/lib/cohort.js`, מפות רכז לפי קורס ב-`src/lib/blueprintStore.js`, הסברי נושא ב-`src/lib/topicExplain.js`, סימולציית מרתון ב-`src/lib/marathon.js`, חבילת מדריך ב-`src/lib/coursePack.js`, מגמות בין מפגשים ב-`src/lib/analytics.js`, מימוש אגודה ב-`src/lib/access.js`, כלכלת חבילה ב-`src/lib/offer.js`. `index.html` הוא מכונת מצבים אחת (`start`/`quiz`/`exam`/`results`). מסך הפתיחה הוא מסלול סטודנט; כלי מדריך/רכז/אגודה תחת «למדריכים, רכזים ואגודה». מצב מרתון משתמש באותם מסכים עם שעון גלובלי. אין תיקיית `lib/` ישנה ואין `.github/workflows/`.

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

3. **הגרעין שכן שווה משהו הוא האבחון — כתוספת.** שליפה מגובה ([Roediger & Karpicke 2006](https://doi.org/10.1111/j.1467-9280.2006.01693.x); [Dunlosky et al. 2013](https://doi.org/10.1177/1529100612453266)). אופטימיזציית «וותר עד 55» לא מגובה בניסוי. ניסוי מחיר: **20–40 ₪** מעל מרתון ~270 ₪. פירוט כספי וחלוקת הכנסות (בלי אחוז פומבי): [`MONETIZATION.md`](MONETIZATION.md). הצעד הבא: שיחה עם רמ״ד אקדמיה ב-[דף המרתונים](https://aguda-afeka.org.il/marathon/), לא קורס חמישי בקוד.

## הפעלה

```bash
# דפדפן
start index.html   # Windows; או לחיצה כפולה על הקובץ

# כל הבדיקות: node --test + selftest.mjs
npm test
```

## רישיון

ראו `LICENSE`.
