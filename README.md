# PassPilot

דמו דפדפן עובד: בוחן + אבחון לפי מבנה מבחן, ומתכנן תרגול לפי תאריך מבחן אמיתי — לא לוח «מרחק מציון עובר» ולא מודל הסתברות מכויל.

> **[דמו חי](https://swissystem7.github.io/PassPilot/)** · כלי בלי שרת, בלי הרשמה, בלי תשלום. תיקוני המתכנן והסרת מספר «סיכוי המעבר» נמצאים בריפו; דף ה-Pages החי משקף רק את מה שכבר פורסם לשם.

## What / For whom / How

**What:** A Hebrew RTL browser demo (`index.html` + `selftest.mjs`) for four Afeka courses. After a short quiz it ranks weak topics and builds a **date-aware** practice plan. Course 10016 also has a four-block code exam that follows the real exam order. It is not a paid product and not a calibrated pass predictor.

**For whom:** Afeka students who already buy union marathons or lecturer video (GOOL / Alon Bauman / Danny Bauman) and want a short diagnosis of *which exam blocks they are losing*, not another video course.

**How:** Open `index.html` or the [live demo](https://swissystem7.github.io/PassPilot/). Pick a course, optional exam date, and run a quiz or the 10016 exam mode. History stays in `localStorage` on this browser only. Run `node selftest.mjs` to check the planner contract.

## מה עובד היום (אחרי התיקונים בריפו)

| קורס באפקה | מספר | מה יש |
|---|---|---|
| מבוא לפייתון | 10016 | בוחן רב-ברירה + מצב מבחן: 4 שאלות כתיבת קוד בסדר המועד |
| ארגון המחשב ושפת סף | 10145 | בוחן רב-ברירה בלבד |
| חדו״א 1 | 90901 | בוחן רב-ברירה בלבד |
| חדו״א 2 | 90902 | בוחן רב-ברירה בלבד |

מה שרץ בפועל אחרי הקומיטים האחרונים:

- **מתכנן תלוי-תאריך.** שדה «תאריך המבחן», אופק אמיתי מ-`parseExamDate`, אזהרה כשאין די זמן («נדרשות…»), וחיתוך ל-14 יום. `node selftest.mjs` עובר על החוזה הזה.
- **בלי מספר «סיכוי מעבר».** הנוסחה הישנה הייתה דיוק הבוחן כפול מקדם קושי — לא כיול מול ציוני אפקה — והוסרה מהמסך.
- **תאריכי תוכנית לפי שעון מקומי**, לא חיתוך UTC של `toISOString`.
- **היסטוריה לפי קורס**, כולל מפגשי מצב-מבחן (`courseId` + עטיפה של `showExamResults`).
- **מעבר קורס לא מחזיר את נושא «מילונים»** לבוחן הפייתון (אין לו שאלות רב-ברירה); כותרת הקורס מתעדכנת.
- **מצב מבחן 10016:** שאלות משתנות לפי seed; «פתרתי נכון» דורש טקסט לא ריק בתיבת הקוד.

`src/lib/planner.js` עדיין מכיל את פונקציות הדירוג הישנות לטסטים. מה שהדף מציג לתוכנית מגיע מבלוק `DEFAULT_HORIZON_DAYS` ב-`index.html`.

## מה זה *לא*

- לא לוח בקרת מעבר עם טווחי 45–59 / חלוקת 65/25/10 — אלה היו טקסט README, לא קוד.
- לא מודל «תעבור ב-55». [ציון עובר באפקה הוא 60](https://www.afeka.ac.il/media/m2sba5lj/%D7%A0%D7%95%D7%94%D7%9C-%D7%91%D7%97%D7%99%D7%A0%D7%95%D7%AA-%D7%95%D7%AA%D7%A8%D7%92%D7%99%D7%9C%D7%99%D7%9D-%D7%9C%D7%A1%D7%98%D7%95%D7%93%D7%A0%D7%98%D7%99-%D7%AA%D7%95%D7%90%D7%A8-%D7%A8%D7%90%D7%A9%D7%95%D7%9Fcleaned.pdf) (נוהל בחינות לתואר ראשון, נספח 3).
- לא בנק פריטים מקצועי ולא תחליף למרתון / וידאו מרצה. עשרות שאלות MCQ + 4 בלוקי קוד ב-10016 אינם QBank.
- אין משתמשים משלמים, אין שרת, אין מדידת שיעור מעבר.

## מה המחקר מצא

פסק הדין (13.8.2026): **PIVOT** — לא מוצר עצמאי מול תוכן שכבר משלמים עליו, אלא שכבת אבחון *מעל* אותו תוכן.

1. **השוק כבר משלם על מרתונים ווידאו, לא על לוח עדיפויות.** מרתוני [אגודת אפקה](https://aguda-afeka.org.il/marathon/) בסמסטר ב׳ 2026: **220–270 ₪**. קורס וידאו של [אלון באומן באפקה](https://mechanical-engineering.alonbaumann.co.il/) חוזר ב-**349 ₪** (למשל חדו״א 2, 90902). [דני באומן — עמוד אפקה](https://baumann.co.il/university/27): סמסטר **329 ₪**. מבצעי אגודות ל-[GOOL](https://www.gool.co.il/): סמסטר **299–349 ₪**. הסטודנט קונה הסבר + פתרון מועדים + מרצה.

2. **מסלול MCQ עצמאי מפסיד כי עלות התוכן כבר שולמה אצל היריב.** [GOOL](https://www.gool.co.il/Home/Questions) נבנית על התאמה למוסד/מרצה. אותו אלון באומן מלמד גם את מרתון 90902 של האגודה ב-270 ₪. בלי בנק בסגנון המבחן, מעודכן אחרי המועד האחרון, המתכנן הוא יומן משימות. ארבעה כפתורי קורס ב-GitHub Pages לא מתחרים בזה, ולא מצדיקים מנוי 29 ₪.

3. **הגרעין שכן שווה משהו הוא האבחון — כתוספת, לא כתחליף.** תרגול שליפה מגובה ([Roediger & Karpicke 2006](https://doi.org/10.1111/j.1467-9280.2006.01693.x); [Dunlosky et al. 2013](https://doi.org/10.1177/1529100612453266)). אופטימיזציית «וותר על נושאים קשים עד 55» **לא** מגובה בניסוי. הניסוי המוצע: תוספת **20–40 ₪** מעל מרתון אגודה (~270 ₪) — מחיר ניסוי, לא מחיר שוק מאומת. הצעד הבא הוא **שיחה אחת** עם רמ״ד אקדמיה באגודת אפקה ([דף המרתונים](https://aguda-afeka.org.il/marathon/)), לא קורס חמישי בקוד.

## הפעלה

```bash
# דפדפן
open index.html   # או לחיצה כפולה על הקובץ

# חוזה המתכנן
node selftest.mjs
```

## רישיון

ראו `LICENSE`.
