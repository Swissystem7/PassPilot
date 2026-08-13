// PassPilot — question banks as data. One schema: {id, topic, difficulty, question, options, answerIdx, explanation}
// Code-exam items: {topic, prompt, referenceSolution, explanation}
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const PYTHON_MCQ = [

  { id: 1, topic: "loops", difficulty: 1, question: "מה יודפס?\nfor i in range(3):\n    print(i)", options: ["1 2 3", "0 1 2", "0 1 2 3", "1 2"], answerIdx: 1, explanation: "range(3) מייצר את המספרים 0, 1, 2; הגבול העליון אינו נכלל." },
  { id: 2, topic: "loops", difficulty: 1, question: "מה יודפס?\nfor i in range(1, 4):\n    print(i)", options: ["1 2 3", "1 2 3 4", "0 1 2 3", "2 3 4"], answerIdx: 0, explanation: "range(1, 4) מתחיל ב־1 ועוצר לפני 4." },
  { id: 3, topic: "loops", difficulty: 2, question: "מה יודפס?\ns = 0\nfor i in range(1, 6):\n    s += i\nprint(s)", options: ["10", "21", "15", "5"], answerIdx: 2, explanation: "הסכום 1+2+3+4+5 הוא 15." },
  { id: 4, topic: "loops", difficulty: 2, question: "מה יודפס?\nfor i in range(5, 0, -1):\n    print(i)", options: ["5 4 3 2 1", "5 4 3 2", "4 3 2 1 0", "5 4 3 2 1 0"], answerIdx: 0, explanation: "צעד של ‎-1 יורד מ־5, והלולאה נעצרת לפני 0." },
  { id: 5, topic: "loops", difficulty: 3, question: "מה יודפס?\nx = 0\nfor i in range(3):\n    for j in range(2):\n        x += 1\nprint(x)", options: ["5", "3", "2", "6"], answerIdx: 3, explanation: "הלולאה הפנימית רצה פעמיים בכל אחת מ־3 האיטרציות: 3×2=6." },
  { id: 6, topic: "functions", difficulty: 1, question: "מה יודפס?\ndef f():\n    return 5\nprint(f())", options: ["None", "5", "f", "שגיאה"], answerIdx: 1, explanation: "הקריאה f() מחזירה 5, ולכן print מדפיס 5." },
  { id: 7, topic: "functions", difficulty: 1, question: "מה יודפס?\ndef add(a, b):\n    return a + b\nprint(add(3, 4))", options: ["34", "12", "7", "שגיאה"], answerIdx: 2, explanation: "הפונקציה מחברת מספרים: 3+4=7." },
  { id: 8, topic: "functions", difficulty: 2, question: "מה יודפס?\ndef f(x=2):\n    return x * 2\nprint(f(3))", options: ["6", "4", "9", "שגיאה"], answerIdx: 0, explanation: "הארגומנט 3 מחליף את ברירת המחדל, ולכן 3×2=6." },
  { id: 9, topic: "functions", difficulty: 2, question: "מה יודפס?\ndef f(a, b):\n    return a - b\nprint(f(b=1, a=5))", options: ["-4", "6", "שגיאה", "4"], answerIdx: 3, explanation: "בארגומנטים בשם הסדר אינו משנה: a=5 ו־b=1, ולכן התוצאה 4." },
  { id: 10, topic: "functions", difficulty: 3, question: "מה יודפס?\ndef f(n):\n    if n == 0:\n        return 1\n    return n * f(n - 1)\nprint(f(4))", options: ["10", "24", "4", "16"], answerIdx: 1, explanation: "זו עצרת: ‎4! = 4×3×2×1 = 24." },
  { id: 11, topic: "strings", difficulty: 1, question: "מה יודפס?\ns = 'hello'\nprint(len(s))", options: ["4", "6", "5", "3"], answerIdx: 2, explanation: "במחרוזת 'hello' יש 5 תווים." },
  { id: 12, topic: "strings", difficulty: 1, question: "מה יודפס?\ns = 'abc'\nprint(s[1])", options: ["b", "a", "c", "שגיאה"], answerIdx: 0, explanation: "האינדקסים מתחילים ב־0, ולכן אינדקס 1 מכיל b." },
  { id: 13, topic: "strings", difficulty: 2, question: "מה יודפס?\ns = 'hello'\nprint(s[1:4])", options: ["hel", "llo", "hell", "ell"], answerIdx: 3, explanation: "החיתוך כולל אינדקסים 1, 2, 3, אך לא את 4: ell." },
  { id: 14, topic: "strings", difficulty: 2, question: "מה יודפס?\ns = 'Python'\nprint(s[::-1])", options: ["Python", "nohtyP", "noth", "P"], answerIdx: 1, explanation: "צעד ‎-1 בחיתוך הופך את סדר התווים." },
  { id: 15, topic: "strings", difficulty: 3, question: "מה יודפס?\ns = 'a b c'\nprint(s.split())", options: ["['a b c']", "['a', 'b', 'c']", "['abc']", "שגיאה"], answerIdx: 1, explanation: "split() ללא ארגומנט מפריד לפי רצפים של רווחים ומחזיר שלוש מחרוזות." },
  { id: 16, topic: "lists", difficulty: 1, question: "מה יודפס?\nlst = [1, 2, 3]\nprint(len(lst))", options: ["2", "4", "1", "3"], answerIdx: 3, explanation: "ברשימה יש שלושה איברים." },
  { id: 17, topic: "lists", difficulty: 1, question: "מה יודפס?\nlst = [10, 20, 30]\nprint(lst[1])", options: ["20", "10", "30", "שגיאה"], answerIdx: 0, explanation: "אינדקס 1 הוא האיבר השני: 20." },
  { id: 18, topic: "lists", difficulty: 2, question: "מה יודפס?\nlst = [1, 2, 3]\nlst.append(4)\nprint(lst)", options: ["[4, 1, 2, 3]", "[1, 2, 3]", "[1, 2, 3, 4]", "שגיאה"], answerIdx: 2, explanation: "append מוסיף את 4 לסוף הרשימה." },
  { id: 19, topic: "lists", difficulty: 2, question: "מה יודפס?\nlst = [3, 1, 2]\nlst.sort()\nprint(lst)", options: ["[3, 1, 2]", "[1, 2, 3]", "[1, 3, 2]", "שגיאה"], answerIdx: 1, explanation: "sort ממיין את הרשימה במקום בסדר עולה." },
  { id: 20, topic: "lists", difficulty: 3, question: "מה יודפס?\nlst = [[1, 2], [3, 4]]\nprint(lst[1][0])", options: ["1", "4", "3", "2"], answerIdx: 2, explanation: "lst[1] היא [3, 4], והאיבר באינדקס 0 בה הוא 3." },
  { id: 21, topic: "conditions", difficulty: 1, question: "מה יודפס?\nx = 5\nif x > 3:\n    print('גדול')", options: ["קטן", "גדול", "שווה", "כלום"], answerIdx: 1, explanation: "התנאי 5>3 אמת, ולכן יודפס 'גדול'." },
  { id: 22, topic: "conditions", difficulty: 1, question: "מה יודפס?\nx = 2\nif x > 5:\n    print('א')\nelse:\n    print('ב')", options: ["א", "שגיאה", "ב", "כלום"], answerIdx: 2, explanation: "2 אינו גדול מ־5, ולכן מתבצע ענף else." },
  { id: 23, topic: "conditions", difficulty: 2, question: "מה יודפס?\nx = 7\nif x % 2 == 0:\n    print('זוגי')\nelse:\n    print('אי-זוגי')", options: ["אי-זוגי", "זוגי", "שגיאה", "כלום"], answerIdx: 0, explanation: "השארית בחלוקת 7 ב־2 היא 1, ולכן המספר אי־זוגי." },
  { id: 24, topic: "conditions", difficulty: 2, question: "מה יודפס?\nx = 10\ny = 5\nif x > y and x < 20:\n    print('כן')", options: ["לא", "שגיאה", "כלום", "כן"], answerIdx: 3, explanation: "שני התנאים אמת: 10>5 וגם 10<20." },
  { id: 25, topic: "conditions", difficulty: 3, question: "מה יודפס?\nx = 15\nif x < 10:\n    print('א')\nelif x < 20:\n    print('ב')\nelse:\n    print('ג')", options: ["א", "ג", "שגיאה", "ב"], answerIdx: 3, explanation: "התנאי הראשון שקר, אך 15<20 אמת, ולכן נבחר ענף elif." },
  { id: 26, topic: "recursion", difficulty: 2, question: "מה יודפס?\ndef f(n):\n    if n == 0:\n        return 0\n    return n + f(n - 1)\nprint(f(3))", options: ["3", "0", "6", "9"], answerIdx: 2, explanation: "הקריאות מחברות 3+2+1+0=6." },
  { id: 27, topic: "recursion", difficulty: 3, question: "מה יודפס?\ndef f(n):\n    if n <= 1:\n        return n\n    return f(n - 1) + f(n - 2)\nprint(f(5))", options: ["8", "3", "13", "5"], answerIdx: 3, explanation: "בסדרת פיבונאצ'י 0,1,1,2,3,5 הערך באינדקס 5 הוא 5." },
  { id: 28, topic: "recursion", difficulty: 3, question: "מה יודפס?\ndef f(n):\n    if n == 0:\n        return 1\n    return 2 * f(n - 1)\nprint(f(3))", options: ["6", "4", "8", "2"], answerIdx: 2, explanation: "כל קריאה מכפילה ב־2, ולכן f(3)=2³=8." },
  { id: 29, topic: "loops", difficulty: 1, question: "מה יודפס?\nfor ch in 'ab':\n    print(ch)", options: ["ab בשורה אחת", "a ואז b בשורות נפרדות", "a בלבד", "b בלבד"], answerIdx: 1, explanation: "הלולאה עוברת על כל תו, ו־print מוסיף ירידת שורה בכל איטרציה." },
  { id: 30, topic: "functions", difficulty: 2, question: "מה יודפס?\ndef f(lst):\n    return sum(lst)\nprint(f([1, 2, 3]))", options: ["3", "1", "שגיאה", "6"], answerIdx: 3, explanation: "sum מחבר את איברי הרשימה: 1+2+3=6." },
  { id: 31, topic: "strings", difficulty: 2, question: "מה יודפס?\ns = 'hello'\nprint(s.upper())", options: ["hello", "Hello", "שגיאה", "HELLO"], answerIdx: 3, explanation: "upper מחזירה מחרוזת חדשה שבה האותיות באנגלית גדולות." },
  { id: 32, topic: "lists", difficulty: 2, question: "מה יודפס?\nlst = [1, 2, 3]\nprint(lst.pop())", options: ["1", "3", "2", "[1, 2]"], answerIdx: 1, explanation: "pop() ללא אינדקס מסיר ומחזיר את האיבר האחרון, 3." },
  { id: 33, topic: "conditions", difficulty: 1, question: "מה יודפס?\nx = 0\nif x:\n    print('אמת')\nelse:\n    print('שקר')", options: ["אמת", "שגיאה", "כלום", "שקר"], answerIdx: 3, explanation: "המספר 0 נחשב ערך שקרי (falsy), ולכן מתבצע else." },
  { id: 34, topic: "recursion", difficulty: 1, question: "מה יודפס?\ndef f(n):\n    if n == 0:\n        return\n    print(n)\n    f(n - 1)\nf(3)", options: ["1 2 3", "3 2 1 0", "3 2 1", "0 1 2 3"], answerIdx: 2, explanation: "ההדפסה מתבצעת לפני הקריאה הרקורסיבית; ב־0 הפונקציה חוזרת בלי להדפיס." },
  { id: 35, topic: "loops", difficulty: 3, question: "מה יודפס?\ns = 0\nfor i in range(1, 10, 2):\n    s += i\nprint(s)", options: ["20", "30", "25", "15"], answerIdx: 2, explanation: "range מייצר 1,3,5,7,9, שסכומם 25." },
  { id: 36, topic: "functions", difficulty: 3, question: "מה יודפס?\ndef f(a, b=2, c=3):\n    return a + b + c\nprint(f(1, c=5))", options: ["6", "8", "9", "שגיאה"], answerIdx: 1, explanation: "a=1,‏ b נשאר 2, ו־c=5; הסכום הוא 8." },
  { id: 37, topic: "strings", difficulty: 3, question: "מה יודפס?\ns = 'abc'\nprint(s.replace('b', 'z'))", options: ["abc", "abz", "שגיאה", "azc"], answerIdx: 3, explanation: "replace מחליפה את b ב־z ומחזירה azc." },
  { id: 38, topic: "lists", difficulty: 3, question: "מה יודפס?\nlst = [1, 2, 3, 4]\nprint([x * 2 for x in lst if x % 2 == 0])", options: ["[2, 4, 6, 8]", "[4, 8]", "[2, 4]", "[4, 6]"], answerIdx: 1, explanation: "רק 2 ו־4 עוברים את התנאי, ואז כל אחד מוכפל ב־2." },
  { id: 39, topic: "conditions", difficulty: 2, question: "מה יודפס?\nx = 3\ny = 3\nif x == y:\n    print('שווה')\nelse:\n    print('לא שווה')", options: ["לא שווה", "שגיאה", "שווה", "כלום"], answerIdx: 2, explanation: "3==3 הוא תנאי אמת." },
  { id: 40, topic: "recursion", difficulty: 2, question: "מה יודפס?\ndef f(n):\n    if n < 2:\n        return n\n    return f(n - 1) + f(n - 2)\nprint(f(4))", options: ["4", "2", "5", "3"], answerIdx: 3, explanation: "ערכי פיבונאצ'י עד אינדקס 4 הם 0,1,1,2,3." },
  { id: 41, topic: "loops", difficulty: 2, question: "מה יודפס?\nfor i in range(2, 5):\n    print(i)", options: ["2 3 4 5", "1 2 3 4", "2 3 4", "3 4 5"], answerIdx: 2, explanation: "range(2, 5) כולל את 2,3,4 ולא את 5." },
  { id: 42, topic: "functions", difficulty: 1, question: "מה יודפס?\ndef f():\n    pass\nprint(f())", options: ["pass", "שגיאה", "None", "0"], answerIdx: 2, explanation: "פונקציה שמסתיימת בלי return מפורש מחזירה None." },
  { id: 43, topic: "strings", difficulty: 1, question: "מה יודפס?\ns = 'shalom'\nprint(s[0])", options: ["h", "a", "s", "l"], answerIdx: 2, explanation: "האינדקס הראשון הוא 0, ובו התו s." },
  { id: 44, topic: "lists", difficulty: 1, question: "מה יודפס?\nlst = [5]\nlst.append(10)\nprint(lst)", options: ["[10, 5]", "[5]", "שגיאה", "[5, 10]"], answerIdx: 3, explanation: "append מוסיף 10 לסוף הרשימה הקיימת." },
  { id: 45, topic: "conditions", difficulty: 3, question: "מה יודפס?\nx = 8\nif x % 3 == 0:\n    print('א')\nelif x % 4 == 0:\n    print('ב')\nelse:\n    print('ג')", options: ["א", "ג", "ב", "שגיאה"], answerIdx: 2, explanation: "8 אינו מתחלק ב־3 אך מתחלק ב־4, ולכן נבחר ענף elif." }

  ];
  [].push.apply(PYTHON_MCQ, [
    { id: 46, topic: "loops", difficulty: 2, question: "מה יודפס?\ni = 0\nwhile i < 3:\n    print(i)\n    i += 1", options: ["0 1 2", "1 2 3", "0 1 2 3", "לולאה אינסופית"], answerIdx: 0, explanation: "שלב 1: i מתחיל ב־0. שלב 2: כל עוד i<3 מדפיסים ואז מגדילים ב־1. שלב 3: אחרי 0,1,2 מתקבל i=3 והתנאי נכשל. לכן 0 1 2 — לא 1 2 3 ולא לולאה אינסופית (יש עדכון)." },
    { id: 47, topic: "loops", difficulty: 2, question: "מה יודפס?\nfor i in range(5):\n    if i == 2:\n        break\n    print(i)", options: ["0 1 2", "0 1", "0 1 2 3 4", "2"], answerIdx: 1, explanation: "שלב 1: i רץ 0,1,2,… שלב 2: כש־i==2 מתבצע break לפני ההדפסה. שלב 3: לכן הודפסו רק 0 ו־1. break יוצא מהלולאה לגמרי — לא מדלג על איטרציה." },
    { id: 48, topic: "loops", difficulty: 2, question: "מה יודפס?\nfor i in range(4):\n    if i % 2 == 0:\n        continue\n    print(i)", options: ["0 2", "1 3", "0 1 2 3", "1 2 3"], answerIdx: 1, explanation: "שלב 1: range(4) = 0,1,2,3. שלב 2: continue מדלג על שאר גוף הלולאה באיטרציה הנוכחית. שלב 3: הזוגיים 0 ו־2 מדולגים, נשארים 1 ו־3." },
    { id: 49, topic: "loops", difficulty: 3, question: "מה יודפס?\nprint(list(range(0, 10, 3)))", options: ["[0, 3, 6, 9]", "[0, 3, 6, 9, 12]", "[3, 6, 9]", "[0, 3, 6]"], answerIdx: 0, explanation: "שלב 1: range(start, stop, step) מתחיל ב־0. שלב 2: מוסיפים 3 כל פעם: 0,3,6,9. שלב 3: 12 אינו קטן מ־10 ולכן נעצרים. הגבול העליון אף פעם לא נכלל." },
    { id: 50, topic: "functions", difficulty: 2, question: "מה יודפס?\ndef f(x):\n    x = x + 1\n    return x\na = 3\nprint(f(a), a)", options: ["4 4", "4 3", "3 3", "3 4"], answerIdx: 1, explanation: "שלב 1: a=3 מועבר ל־f. שלב 2: x הוא שם מקומי; x=x+1 לא משנה את a החיצוני (int אינו mutable בהשמה). שלב 3: f מחזירה 4 ו־a נשאר 3, לכן 4 3." },
    { id: 51, topic: "functions", difficulty: 3, question: "מה יודפס?\ndef f(lst):\n    lst.append(9)\n    return len(lst)\na = [1, 2]\nprint(f(a), a)", options: ["2 [1, 2]", "3 [1, 2, 9]", "3 [1, 2]", "שגיאה"], answerIdx: 1, explanation: "שלב 1: רשימה מועברת לפי הפניה. שלב 2: append משנה את אותו אובייקט. שלב 3: len אחרי ההוספה הוא 3, ו־a בחוץ הוא [1, 2, 9]. זה ההבדל מול מספרים בשאלה הקודמת." },
    { id: 52, topic: "functions", difficulty: 2, question: "מה יודפס?\ndef f():\n    return 1, 2\na, b = f()\nprint(a + b)", options: ["12", "3", "(1, 2)", "שגיאה"], answerIdx: 1, explanation: "שלב 1: return 1, 2 מחזיר tuple. שלב 2: הפריסה a,b=f() שמה 1 ב־a ו־2 ב־b. שלב 3: 1+2=3, לא שרשור מחרוזות." },
    { id: 53, topic: "functions", difficulty: 3, question: "מה יודפס?\ndef f(n, acc=None):\n    if acc is None:\n        acc = []\n    acc.append(n)\n    return acc\nprint(f(1), f(2))", options: ["[1] [1, 2]", "[1] [2]", "[1, 2] [1, 2]", "שגיאה"], answerIdx: 1, explanation: "שלב 1: ברירת מחדל mutable משותפת רק אם כותבים acc=[] בחתימה. שלב 2: כאן acc=None, ובפנים נוצרת רשימה חדשה בכל קריאה. שלב 3: לכן שתי קריאות נפרדות: [1] ואז [2]." },
    { id: 54, topic: "strings", difficulty: 2, question: "מה יודפס?\ns = 'abcdef'\nprint(s[2:5], s[-2])", options: ["cde e", "bcd e", "cde f", "cdef e"], answerIdx: 0, explanation: "שלב 1: אינדקסים 0:a 1:b 2:c 3:d 4:e 5:f. שלב 2: חיתוך [2:5] כולל 2,3,4 ולא את 5 → cde. שלב 3: ‎-2 הוא האיבר הלפני־אחרון, e." },
    { id: 55, topic: "strings", difficulty: 2, question: "מה יודפס?\nprint('aa-bb-cc'.split('-', 1))", options: ["['aa', 'bb', 'cc']", "['aa', 'bb-cc']", "['aa-bb', 'cc']", "שגיאה"], answerIdx: 1, explanation: "שלב 1: split('-') בלי הגבלה היה מפצל לשלוש. שלב 2: הארגומנט השני maxsplit=1 מבצע פיצול אחד בלבד. שלב 3: נשארים 'aa' וכל השאר 'bb-cc'." },
    { id: 56, topic: "strings", difficulty: 3, question: "מה יודפס?\ns = 'abca'\nprint(s.find('a'), s.find('z'), s.count('a'))", options: ["0 -1 2", "0 0 2", "1 -1 2", "0 3 2"], answerIdx: 0, explanation: "שלב 1: find מחזיר את האינדקס הראשון, 0. שלב 2: תו חסר מחזיר ‎-1 ולא זורק — בניגוד ל־index. שלב 3: count סופר שני מופעים של a." },
    { id: 57, topic: "strings", difficulty: 3, question: "מה יודפס?\nprint('x'.join(['a', 'b', 'c']))", options: ["abc", "axbxcx", "axbxc", "['a','b','c']"], answerIdx: 2, explanation: "שלב 1: join שם את המפריד *בין* האיברים, לא אחרי האחרון. שלב 2: a + x + b + x + c. שלב 3: מתקבל axbxc, בלי x בסוף." },
    { id: 58, topic: "lists", difficulty: 2, question: "מה יודפס?\na = [1, 2, 3]\nb = a\nb[0] = 9\nprint(a)", options: ["[1, 2, 3]", "[9, 2, 3]", "[9, 1, 2, 3]", "שגיאה"], answerIdx: 1, explanation: "שלב 1: b = a לא מעתיק — שני השמות מצביעים לאותה רשימה. שלב 2: b[0]=9 משנה את התא הראשון. שלב 3: גם a רואה [9, 2, 3]. להעתקה צריך a.copy() או a[:]." },
    { id: 59, topic: "lists", difficulty: 2, question: "מה יודפס?\nlst = [10, 20, 30, 40]\nprint(lst[1:3], lst[::2])", options: ["[20, 30] [10, 30]", "[20, 30, 40] [10, 30]", "[10, 20] [20, 40]", "[20, 30] [20, 40]"], answerIdx: 0, explanation: "שלב 1: [1:3] אינדקסים 1 ו־2 → 20,30. שלב 2: [::2] צעד 2 מההתחלה → 10 ואז 30. שלב 3: 40 לא נכנס כי אחרי 30 הצעד הבא חורג." },
    { id: 60, topic: "lists", difficulty: 3, question: "מה יודפס?\nlst = [1, 2, 3]\nprint(lst + [4], lst)", options: ["[1, 2, 3, 4] [1, 2, 3, 4]", "[1, 2, 3, 4] [1, 2, 3]", "[1, 2, 3] [1, 2, 3]", "שגיאה"], answerIdx: 1, explanation: "שלב 1: + בין רשימות יוצר רשימה חדשה. שלב 2: lst עצמה לא השתנתה (בניגוד ל־append/extend). שלב 3: לכן מודפס [1,2,3,4] ואז הרשימה המקורית." },
    { id: 61, topic: "lists", difficulty: 3, question: "מה יודפס?\nprint(sorted([3, 1, 2], reverse=True), [3, 1, 2].sort())", options: ["[3, 2, 1] [3, 2, 1]", "[3, 2, 1] None", "[1, 2, 3] None", "[3, 2, 1] [3, 1, 2]"], answerIdx: 1, explanation: "שלב 1: sorted מחזירה רשימה חדשה ממוינת, כאן יורד. שלב 2: sort ממיין במקום ומחזירה None. שלב 3: לכן [3,2,1] ואז None — מלכודת קלאסית." },
    { id: 62, topic: "conditions", difficulty: 2, question: "מה יודפס?\nx = ''\nif not x:\n    print('ריק')\nelse:\n    print('מלא')", options: ["מלא", "ריק", "שגיאה", "כלום"], answerIdx: 1, explanation: "שלב 1: מחרוזת ריקה היא falsy. שלב 2: not x לכן אמת. שלב 3: נכנסים ל־if ומדפיסים 'ריק'. אותו כלל חל על [], {}, 0 ו־None." },
    { id: 63, topic: "conditions", difficulty: 2, question: "מה יודפס?\na, b = 1, 0\nprint(a or b, a and b, not b)", options: ["1 0 True", "1 1 False", "True True True", "1 0 False"], answerIdx: 0, explanation: "שלב 1: or מחזיר את הערך הראשון האמיתי — 1. שלב 2: and מחזיר את הראשון השקרי — 0. שלב 3: not 0 הוא True. פייתון מחזירה את האופרנד, לא בהכרח True/False." },
    { id: 64, topic: "conditions", difficulty: 3, question: "מה יודפס?\nx = 4\nprint('זוגי' if x % 2 == 0 else 'אי-זוגי')", options: ["אי-זוגי", "זוגי", "שגיאה", "None"], answerIdx: 1, explanation: "שלב 1: זה ביטוי תנאי (ternary), לא משפט if. שלב 2: 4 זוגי ולכן נבחר הענף שלפני ה־if. שלב 3: מודפס 'זוגי'." },
    { id: 65, topic: "conditions", difficulty: 3, question: "מה יודפס?\nx = 5\nif 1 < x < 10:\n    print('בפנים')\nelse:\n    print('בחוץ')", options: ["בחוץ", "שגיאה", "בפנים", "כלום"], answerIdx: 2, explanation: "שלב 1: בפייתון 1<x<10 שקול ל־(1<x) and (x<10). שלב 2: 5 מקיים את שניהם. שלב 3: 'בפנים'. אין צורך לפרק לשני תנאים." },
    { id: 66, topic: "recursion", difficulty: 2, question: "כמה קריאות ל־f מתבצעות בסך הכול?\ndef f(n):\n    if n <= 0:\n        return 0\n    return f(n - 1) + 1\nf(3)", options: ["3", "4", "1", "6"], answerIdx: 1, explanation: "שלב 1: f(3) קוראת ל־f(2), וכן הלאה עד f(0). שלב 2: הקריאות הן f(3), f(2), f(1), f(0) — ארבע. שלב 3: תנאי העצירה גם הוא קריאה. סופרים את כולן." },
    { id: 67, topic: "recursion", difficulty: 2, question: "מה יודפס?\ndef f(n):\n    print(n)\n    if n > 0:\n        f(n - 1)\n    print(n)\nf(1)", options: ["1 0 0 1", "1 0 1", "1 1", "0 1 1 0"], answerIdx: 0, explanation: "שלב 1: לפני הקריאה הרקורסיבית מודפס 1, אחר כך 0. שלב 2: ב־0 התנאי נכשל ומיד מודפס 0 שוב (ההדפסה שאחרי). שלב 3: חוזרים ל־f(1) ומדפיסים 1. סדר: 1 0 0 1 — כניסה ואז יציאה." },
    { id: 68, topic: "recursion", difficulty: 3, question: "מה יודפס?\ndef g(n):\n    if n == 0:\n        return 1\n    return n * g(n - 1)\nprint(g(0), g(1), g(3))", options: ["0 1 6", "1 1 6", "1 0 6", "1 1 3"], answerIdx: 1, explanation: "שלב 1: g(0)=1 לפי תנאי העצירה — לא 0. שלב 2: g(1)=1*g(0)=1. שלב 3: g(3)=3*2*1*1=6. עצרת של 0 מוגדרת 1." },
    { id: 69, topic: "recursion", difficulty: 3, question: "מה יודפס?\ndef rev(s):\n    if len(s) <= 1:\n        return s\n    return rev(s[1:]) + s[0]\nprint(rev('ab'))", options: ["ab", "ba", "a", "שגיאה"], answerIdx: 1, explanation: "שלב 1: rev('ab') = rev('b') + 'a'. שלב 2: len('b')==1 ולכן מחזירים 'b'. שלב 3: 'b'+'a'='ba'. התו הראשון מודבק בסוף — זו היפוך רקורסיבי." },
    { id: 70, topic: "recursion", difficulty: 2, question: "מה חסר בפונקציה הזו כדי שתיעצר?\ndef f(n):\n    return n + f(n - 1)", options: ["return n", "תנאי עצירה כש־n קטן מסף", "לולאה for", "print(n)"], answerIdx: 1, explanation: "שלב 1: כל קריאה קוראת שוב בלי לבדוק סף — מחסנית תתפוצץ. שלב 2: רקורסיה דורשת מקרה בסיס, למשל if n<=0: return 0. שלב 3: return n לבדו לא עוזר אם הוא לא עוטף את הקריאה." }
  ]);
  PYTHON_MCQ.forEach(function (q, i) { if (q.id == null) q.id = i + 1; });

  const PYTHON_EXAM_BLOCKS = [{number:1,topic:"recursion",title:"שאלה 1 - רקורסיה",emphasis:"תנאי עצירה, צעד רקורסיבי ומחסנית קריאות"},{number:2,topic:"strings",title:"שאלה 2 - מחרוזות",emphasis:"כל פעולות המחרוזת: חיתוך, חיפוש, פיצול והחלפה"},{number:3,topic:"lists",title:"שאלה 3 - רשימות",emphasis:"מעבר, שינוי, חיתוך, מיון ו-list comprehensions"},{number:4,topic:"dictionaries",title:"שאלה 4 - מבני נתונים - מילונים",emphasis:"יצירה, עדכון, items וספירת מופעים"}];
  const PYTHON_EXAM_ITEMS = [

{topic:"recursion",prompt:"כתבו פונקציה רקורסיבית sum_digits(n) שמחזירה את סכום הספרות.",referenceSolution:"def sum_digits(n):\n    if n < 10:\n        return n\n    return n % 10 + sum_digits(n // 10)",explanation:"תנאי העצירה הוא מספר חד-ספרתי."},{topic:"recursion",prompt:"כתבו count_char(s, ch) רקורסיבית שסופרת מופעים.",referenceSolution:"def count_char(s, ch):\n    if s == '':\n        return 0\n    return (1 if s[0] == ch else 0) + count_char(s[1:], ch)",explanation:"מטפלים בתו הראשון וממשיכים עם השאר."},{topic:"recursion",prompt:"כתבו is_palindrome(s) רקורסיבית.",referenceSolution:"def is_palindrome(s):\n    if len(s) <= 1:\n        return True\n    return s[0] == s[-1] and is_palindrome(s[1:-1])",explanation:"משווים קצוות וממשיכים פנימה."},
{topic:"strings",prompt:"כתבו normalize_words(s): אותיות קטנות ורווח יחיד בין מילים.",referenceSolution:"def normalize_words(s):\n    return ' '.join(s.strip().lower().split())",explanation:"split מכווץ רווחים ו-join מחבר."},{topic:"strings",prompt:"כתבו initials(name) שמחזירה ראשי תיבות גדולים.",referenceSolution:"def initials(name):\n    return ''.join(word[0].upper() for word in name.split() if word)",explanation:"מחברים את האות הראשונה מכל מילה."},{topic:"strings",prompt:"כתבו longest_word(text); בשוויון החזירו את הראשונה.",referenceSolution:"def longest_word(text):\n    words = text.split()\n    return max(words, key=len) if words else ''",explanation:"max עם key=len שומר את הראשונה בשוויון."},
{topic:"lists",prompt:"כתבו unique_in_order(items), ללא כפילויות ובסדר המקורי.",referenceSolution:"def unique_in_order(items):\n    result = []\n    for item in items:\n        if item not in result:\n            result.append(item)\n    return result",explanation:"מוסיפים רק איבר שטרם הופיע."},{topic:"lists",prompt:"כתבו rotate_left(items, k) ללא שינוי הרשימה המקורית.",referenceSolution:"def rotate_left(items, k):\n    if not items:\n        return []\n    k %= len(items)\n    return items[k:] + items[:k]",explanation:"מודולו ושני חיתוכים."},{topic:"lists",prompt:"כתבו flatten(matrix) שמחזירה רשימה שטוחה.",referenceSolution:"def flatten(matrix):\n    return [item for row in matrix for item in row]",explanation:"עוברים על שורות ואז על איברים."},
{topic:"dictionaries",prompt:"כתבו char_frequency(s) שמחזירה מילון שכיחויות.",referenceSolution:"def char_frequency(s):\n    counts = {}\n    for ch in s:\n        counts[ch] = counts.get(ch, 0) + 1\n    return counts",explanation:"get מספק אפס למפתח חדש."},{topic:"dictionaries",prompt:"כתבו invert_unique(d); הניחו שהערכים ייחודיים.",referenceSolution:"def invert_unique(d):\n    return {value: key for key, value in d.items()}",explanation:"מחליפים מפתח וערך בכל זוג."},{topic:"dictionaries",prompt:"כתבו group_by_length(words) שמקבצת מילים לפי אורך.",referenceSolution:"def group_by_length(words):\n    groups = {}\n    for word in words:\n        groups.setdefault(len(word), []).append(word)\n    return groups",explanation:"setdefault יוצר רשימה לכל אורך."},
{topic:"recursion",prompt:"כתבו power(base, exp) רקורסיבית למעריך שלם לא־שלילי.",referenceSolution:"def power(base, exp):\n    if exp == 0:\n        return 1\n    return base * power(base, exp - 1)",explanation:"שלב 1: כל מספר בחזקת 0 הוא 1 — זה תנאי העצירה, כולל 0^0 לפי המוסכמה כאן. שלב 2: מצמצמים את המעריך ב־1 בכל קריאה. שלב 3: מחסנית של exp קריאות; בלי המקרה exp==0 זו רקורסיה אינסופית."},{topic:"recursion",prompt:"כתבו flatten_list(items) רקורסיבית לרשימות מקוננות.",referenceSolution:"def flatten_list(items):\n    out = []\n    for x in items:\n        if isinstance(x, list):\n            out.extend(flatten_list(x))\n        else:\n            out.append(x)\n    return out",explanation:"שלב 1: איבר שאינו רשימה מצורף כמו שהוא. שלב 2: רשימה פנימית נפרסת באותה פונקציה. שלב 3: extend ולא append — אחרת נשארת קינון."},
{topic:"strings",prompt:"כתבו is_anagram(a, b) בלי להתחשב ברישיות וברווחים.",referenceSolution:"def is_anagram(a, b):\n    norm = lambda s: ''.join(ch.lower() for ch in s if not ch.isspace())\n    return sorted(norm(a)) == sorted(norm(b))",explanation:"שלב 1: מנקים רווחים ומורידים רישיות — אחרת 'A'≠'a'. שלב 2: מיון התווים הופך את שתי המחרוזות לאותו רצף אם ורק אם יש אותן שכיחויות. שלב 3: השוואת הרשימות הממוינות."},{topic:"strings",prompt:"כתבו caesar(s, k) שמזיזה אותיות אנגליות ב־k מודולו 26 ומשאירה השאר.",referenceSolution:"def caesar(s, k):\n    out = []\n    for ch in s:\n        if 'a' <= ch <= 'z':\n            out.append(chr((ord(ch) - 97 + k) % 26 + 97))\n        elif 'A' <= ch <= 'Z':\n            out.append(chr((ord(ch) - 65 + k) % 26 + 65))\n        else:\n            out.append(ch)\n    return ''.join(out)",explanation:"שלב 1: ממפים a–z ל־0–25. שלב 2: מוסיפים k מודולו 26 כדי לסגור מעגל. שלב 3: תווים שאינם אות נשארים — רווח ופיסוק לא זזים."},
{topic:"lists",prompt:"כתבו running_sum(nums) שמחזירה סכומים מצטברים בלי לשנות את הקלט.",referenceSolution:"def running_sum(nums):\n    out, s = [], 0\n    for n in nums:\n        s += n\n        out.append(s)\n    return out",explanation:"שלב 1: צוברים במשתנה s. שלב 2: אחרי כל איבר רושמים את הסכום הנוכחי. שלב 3: לא כותבים לתוך nums — המועד מבקש רשימה חדשה."},{topic:"lists",prompt:"כתבו second_largest(nums); אם אין שני ערכים שונים החזירו None.",referenceSolution:"def second_largest(nums):\n    uniq = sorted(set(nums), reverse=True)\n    return uniq[1] if len(uniq) > 1 else None",explanation:"שלב 1: set מסיר כפילויות כדי ש־[5,5,4] ייתן 4 ולא 5. שלב 2: מיון יורד. שלב 3: בלי שני ערכים שונים מחזירים None — לא זורקים."},
{topic:"dictionaries",prompt:"כתבו merge_counts(a, b) שמחברת שני מילוני ספירה.",referenceSolution:"def merge_counts(a, b):\n    out = dict(a)\n    for k, v in b.items():\n        out[k] = out.get(k, 0) + v\n    return out",explanation:"שלב 1: מעתיקים את a כדי לא לשנות את הקלט. שלב 2: לכל מפתח ב־b מוסיפים על הקיים או מתחילים מ־0. שלב 3: get מונע KeyError למפתח חדש."},{topic:"dictionaries",prompt:"כתבו top_key(d) שמחזירה את המפתח עם הערך המספרי הגדול; בשוויון — הראשון לפי סדר המפתחות הממוין.",referenceSolution:"def top_key(d):\n    if not d:\n        return None\n    return min(d, key=lambda k: (-d[k], k))",explanation:"שלב 1: ממיינים לפי ערך יורד ואז שם עולה. שלב 2: min עם המפתח הזה נותן יציבות דטרמיניסטית. שלב 3: מילון ריק מחזיר None."}
  ];

  const ARCH_NAMES = {
    datapath:  "Datapath חד-מחזורי",
    pipeline:  "Pipeline והשהיות",
    cache:     "זיכרון מטמון",
    formats:   "פורמטי פקודות ורגיסטרים",
    memory:    "זיכרון, יישור וסדר בתים",
    numbers:   "ייצוג מספרים ומשלים ל-2"
  };
  const ARCH_MCQ = [

    // ── datapath / pipeline / cache: the 44-point core ──
    {topic:"datapath",difficulty:2,question:"באיזה שלב ב-datapath החד-מחזורי נקבע ערך ה-PC הבא עבור beq?",options:["בשלב ה-Fetch, לפני פענוח","אחרי ה-ALU, כשידוע אם הרגיסטרים שווים","בשלב הכתיבה לרגיסטר","בשלב הגישה לזיכרון"],answerIdx:1,explanation:"ה-ALU מחשב את ההפרש כדי לקבוע Zero; רק אז ידוע אם לקחת PC+4 או את יעד הקפיצה."},
    {topic:"datapath",difficulty:2,question:"מה תפקיד אות הבקרה ALUSrc?",options:["בוחר אם הכניסה השנייה ל-ALU היא רגיסטר או הערך המיידי","בוחר אם לכתוב לזיכרון","בוחר את יעד הכתיבה ברגיסטר","קובע את פעולת ה-ALU"],answerIdx:0,explanation:"ב-R-type הכניסה השנייה היא rt; ב-lw/sw/addi היא ה-immediate אחרי הרחבת סימן."},
    {topic:"datapath",difficulty:3,question:"בפקודת sw, אילו אותות בקרה פעילים?",options:["RegWrite=1, MemWrite=0","RegWrite=0, MemWrite=1, ALUSrc=1","MemRead=1, RegWrite=1","Branch=1, MemWrite=1"],answerIdx:1,explanation:"sw לא כותבת לרגיסטר כלל, כותבת לזיכרון, והכתובת מחושבת עם ההיסט המיידי."},
    {topic:"datapath",difficulty:3,question:"מדוע במחזור יחיד זמן המחזור נקבע לפי lw?",options:["כי היא הפקודה השכיחה ביותר","כי היא עוברת את כל חמשת השלבים ולכן המסלול שלה הארוך ביותר","כי היא ניגשת לשני רגיסטרים","כי היא דורשת הרחבת סימן"],answerIdx:1,explanation:"lw עוברת Fetch, Decode, ALU, Memory ו-WriteBack; במחזור יחיד כל הפקודות משלמות את זמן הארוכה ביותר."},
    {topic:"pipeline",difficulty:2,question:"מהו data hazard?",options:["פקודה זקוקה לתוצאה של פקודה קודמת שטרם נכתבה","שתי פקודות ניגשות לאותו רגיסטר לקריאה","הקפיצה נלקחה בטעות","המטמון החטיא"],answerIdx:0,explanation:"התלות היא בנתון: התוצאה עדיין בצנרת ולא הגיעה לשלב הכתיבה."},
    {topic:"pipeline",difficulty:2,question:"מה פותר forwarding (bypassing)?",options:["הוא מונע control hazards","הוא מעביר תוצאה ישירות משלב EX/MEM לכניסת ה-ALU בלי להמתין ל-WriteBack","הוא מגדיל את המטמון","הוא מבטל את הצורך ב-branch prediction"],answerIdx:1,explanation:"התוצאה קיימת פיזית בצנרת; forwarding מנתב אותה קדימה במקום לעצור."},
    {topic:"pipeline",difficulty:3,question:"איזה מקרה forwarding לבדו לא פותר?",options:["add אחרי add","lw ואחריה מיד פקודה שמשתמשת בערך שנטען","sub אחרי or","and אחרי add"],answerIdx:1,explanation:"load-use hazard: הנתון מגיע רק בסוף שלב MEM, ולכן נדרש stall אחד גם עם forwarding."},
    {topic:"pipeline",difficulty:3,question:"בצנרת 5 שלבים, כמה מחזורים ייקחו 3 פקודות ללא תלויות?",options:["3","5","7","15"],answerIdx:2,explanation:"5 מחזורים לראשונה, ואז אחת נוספת לכל פקודה: 5 + (3-1) = 7."},
    {topic:"pipeline",difficulty:3,question:"מהו control hazard?",options:["תלות בנתון בין פקודות","אי ודאות איזו פקודה תיטען אחרי branch לפני שידוע אם הקפיצה נלקחת","שתי פקודות כותבות לאותו רגיסטר","גישה לזיכרון לא מיושרת"],answerIdx:1,explanation:"הצנרת כבר שולפת פקודות בעוד תוצאת ה-branch לא ידועה."},
    {topic:"cache",difficulty:2,question:"מה ההבדל בין temporal ל-spatial locality?",options:["temporal = אותה כתובת שוב בקרוב; spatial = כתובות סמוכות בקרוב","temporal = כתובות סמוכות; spatial = אותה כתובת","שניהם מתייחסים לגודל הבלוק","שניהם מתייחסים למדיניות הכתיבה"],answerIdx:0,explanation:"לולאה ממחישה את שניהם: המשתנה חוזר (temporal) והמערך נסרק ברצף (spatial)."},
    {topic:"cache",difficulty:3,question:"מטמון direct-mapped עם 64 בלוקים ובלוק של 16 בתים. לאיזה אינדקס תמופה כתובת 1200?",options:["4","11","12","75"],answerIdx:1,explanation:"מספר הבלוק = 1200/16 = 75; האינדקס = 75 mod 64 = 11."},
    {topic:"cache",difficulty:3,question:"מדוע הגדלת גודל הבלוק מקטינה miss rate רק עד גבול מסוים?",options:["כי ה-tag גדל","כי פחות בלוקים נכנסים למטמון ועולה תחרות, וגם עונש ה-miss גדל","כי ה-ALU מאט","כי ה-TLB מתמלא"],answerIdx:1,explanation:"מנצלים spatial locality, אבל מאבדים מספר בלוקים ומשלמים יותר על כל החטאה."},
    {topic:"cache",difficulty:2,question:"מה ההבדל בין write-through ל-write-back?",options:["write-through כותב למטמון ולזיכרון יחד; write-back כותב לזיכרון רק בפינוי הבלוק","הפוך","שניהם זהים","write-back מהיר בקריאה"],answerIdx:0,explanation:"write-back דורש dirty bit ומפחית תעבורה לזיכרון."},

    // ── instruction formats & registers ──
    {topic:"formats",difficulty:1,question:"מהם שלושת פורמטי הפקודה ב-MIPS?",options:["R, I, J","A, B, C","load, store, branch","fixed, variable, hybrid"],answerIdx:0,explanation:"עיקרון \"Good design demands compromises\" — שלושה פורמטים בלבד."},
    {topic:"formats",difficulty:2,question:"מהו מבנה השדות ב-R-type?",options:["op(6) rs(5) rt(5) immediate(16)","op(6) rs(5) rt(5) rd(5) shamt(5) funct(6)","op(6) address(26)","op(8) rs(4) rt(4) rd(4)"],answerIdx:1,explanation:"ב-R-type ה-op תמיד 0 והפקודה נקבעת ב-funct."},
    {topic:"formats",difficulty:2,question:"למה משמש רגיסטר $zero?",options:["לשמירת כתובת חזרה","קבוע 0 בחומרה — לאתחול, להעברה בין רגיסטרים ולמימוש not דרך nor","למצביע מחסנית","לערך מיידי"],answerIdx:1,explanation:"כתיבה אליו לא משנה דבר ולמעשה שקולה ל-nop."},
    {topic:"formats",difficulty:2,question:"מדוע אין פקודת subi ב-MIPS?",options:["כי היא לא נחוצה — addi עם ערך שלילי עושה את אותו דבר","כי אין מספיק opcodes","כי היא גורמת ל-overflow","כי היא לא נתמכת ב-RISC"],answerIdx:0,explanation:"הערך המיידי במשלים ל-2, ולכן חיסור מתקבל מחיבור של שלילי."},
    {topic:"formats",difficulty:2,question:"לאילו פקודות מכונה מתורגמת הפסאודו-פקודה blt $s0,$s1,L?",options:["slt $at,$s0,$s1 ואז bne $at,$zero,L","beq בלבד","sub ואז j","addi ואז beq"],answerIdx:0,explanation:"האסמבלר משתמש ב-$at כרגיסטר עזר, ולכן הוא שמור."},
    {topic:"formats",difficulty:3,question:"מה ההבדל העיקרי בין RISC ל-CISC לפי הגישה של MIPS?",options:["MIPS משתמש בפקודות באורך משתנה","MIPS = סט קטן של פקודות פשוטות באורך קבוע 32 סיביות; 8086 = אורך משתנה 1-17 בתים","CISC מהיר תמיד","ל-RISC יש יותר פורמטים"],answerIdx:1,explanation:"\"פחות זה יותר\": חומרה פשוטה מאפשרת תדר גבוה ושטח סיליקון קטן."},

    // ── memory ──
    {topic:"memory",difficulty:2,question:"מהי דרישת היישור (alignment) ל-lw ו-sw?",options:["הכתובת חייבת להתחלק ב-2","הכתובת חייבת להתחלק ב-4","אין דרישה","הכתובת חייבת להיות זוגית בלבד"],answerIdx:1,explanation:"מילה היא 4 בתים; זו הטעות הקלאסית בתרגילים."},
    {topic:"memory",difficulty:3,question:"MIPS הוא Big Endian — מה זה אומר, ומה עושה סימולטור MARS?",options:["הבית הגבוה בכתובת הנמוכה; MARS דווקא Little Endian","הבית הנמוך בכתובת הנמוכה; MARS זהה","אין הבדל","MARS לא תומך בסדר בתים"],answerIdx:0,explanation:"פער שמפיל בתרגילים: התיאוריה Big Endian אבל הסימולטור מציג Little Endian."},
    {topic:"memory",difficulty:2,question:"מה מבצעת lw $t0, -8($s1)?",options:["טוענת מהכתובת $s1 בלבד","טוענת מהכתובת $s1 מינוס 8","זו שגיאת תחביר — היסט חייב להיות חיובי","כותבת לזיכרון"],answerIdx:1,explanation:"ההיסט במשלים ל-2 ולכן יכול להיות שלילי."},

    // ── number representation ──
    {topic:"numbers",difficulty:2,question:"באילו פקודות באה לידי ביטוי תמיכה במשלים ל-2?",options:["xor, sll, sltiu","sub, addi, mult, sra, slt","and, or, nor","lw, sw, j"],answerIdx:1,explanation:"מהשאלות הקצרות החוזרות: sra משכפל סיבית סימן, slt בוחן overflow xor sign; ב-xor, sll ו-sltiu אין ביטוי לסימן."},
    {topic:"numbers",difficulty:2,question:"מה ידוע כבר בזמן קומפילציה?",options:["ערכי האוגרים","כתובות המשתנים","גודל סגמנט הקוד בלבד","מצביע המחסנית"],answerIdx:2,explanation:"כל השאר נקבע בזמן ריצה — שאלה קצרה שחוזרת."},
    {topic:"numbers",difficulty:3,question:"מה עושה sra לעומת srl על מספר שלילי?",options:["שתיהן מכניסות אפסים","sra משכפלת את סיבית הסימן ולכן שקולה לחלוקה בחזקת 2; srl מכניסה אפסים ומשבשת את הסימן","sra מכניסה אפסים","אין הבדל"],answerIdx:1,explanation:"זו הסיבה שחלוקה במשלים ל-2 נעשית ב-sra."},
    {topic:"numbers",difficulty:2,question:"איך טוענים קבוע של 32 סיביות לרגיסטר?",options:["addi בלבד","lui לחלק העליון ואז ori לחלק התחתון","li בלבד תמיד מספיק","lw מהזיכרון בהכרח"],answerIdx:1,explanation:"הערך המיידי הוא 16 סיביות בלבד, ולכן נדרשות שתי פקודות."}

  ];
  [].push.apply(ARCH_MCQ, [
    {topic:"datapath",difficulty:2,question:"מה תפקיד אות הבקרה RegDst?",options:["בוחר אם לכתוב ל־rt או ל־rd","בוחר את פעולת ה־ALU","מאפשר כתיבה לזיכרון","קובע את ה־PC הבא"],answerIdx:0,explanation:"שלב 1: ב־R-type יעד הכתיבה הוא rd (שדה 15:11). שלב 2: ב־lw/addi היעד הוא rt (20:16). שלב 3: RegDst בוחר איזה שדה נכנס לכתובת הכתיבה בקובץ הרגיסטרים."},
    {topic:"datapath",difficulty:2,question:"בפקודת beq, מה מחשב ה־ALU ומה עושה ה־adder הנפרד?",options:["ה־ALU מחשב יעד קפיצה; ה־adder בודק שוויון","ה־ALU בודק שוויון (חיסור/Zero); ה־adder מחבר PC+4 להיסט המורחב","שניהם מחשבים את אותה כתובת","אף אחד מהם לא מעורב ב־beq"],answerIdx:1,explanation:"שלב 1: כדי לדעת אם לקפוץ מחסרים rs−rt ובודקים Zero. שלב 2: במקביל adder מחבר את PC+4 להיסט אחרי shift-left-2. שלב 3: multiplexor על ה־PC בוחר לפי Zero AND Branch."},
    {topic:"datapath",difficulty:3,question:"איזה אות בקרה חייב להיות 1 ב־lw ולא ב־sw?",options:["MemWrite","ALUSrc","MemRead","Branch"],answerIdx:2,explanation:"שלב 1: שתיהן משתמשות ב־ALUSrc=1 לחישוב כתובת עם immediate. שלב 2: sw כותבת לזיכרון (MemWrite=1) ולא קוראת. שלב 3: lw קוראת (MemRead=1) ואז כותבת לרגיסטר (RegWrite=1). MemRead הוא ההבדל בכיוון הזיכרון."},
    {topic:"datapath",difficulty:3,question:"מה נכון לגבי שלב Fetch במחזור יחיד?",options:["הפקודה נקראת מהזיכרון לפי ה־PC, וה־PC מתעדכן ל־PC+4 כברירת מחדל","הפקודה מפוענחת לפני הקריאה","Fetch קורה רק ב־lw","ה־PC מתעדכן רק בסוף WriteBack"],answerIdx:0,explanation:"שלב 1: הכתובת בקובץ ה־PC בוחרת מילה מזיכרון הפקודות. שלב 2: adder של +4 מציע את הכתובת העוקבת. שלב 3: אם אין branch שנלקח, זה ה־PC הבא. במחזור יחיד כל זה קורה באותו שעון יחד עם שאר השלבים."},
    {topic:"datapath",difficulty:2,question:"מדוע addi משתמש בהרחבת סימן ולא באפסים?",options:["כי ה־opcode קצר","כי הערך המיידי מפורש כמספר במשלים ל־2, כולל שליליים","כי כך חוסכים רגיסטר","כי MARS דורש זאת בלבד"],answerIdx:1,explanation:"שלב 1: השדה המיידי הוא 16 סיביות עם סימן. שלב 2: addi עם ‎-1 חייב להפוך ל־32 סיביות של 1. שלב 3: הרחבת אפסים הייתה הופכת אותו למספר חיובי גדול — שגוי אריתמטית."},
    {topic:"datapath",difficulty:3,question:"במחזור יחיד, איזה רכיב חייב לשבת על המסלול הקריטי של lw?",options:["רק זיכרון הפקודות","זיכרון הפקודות, קובץ הרגיסטרים, ALU, זיכרון הנתונים, ואז כתיבה לרגיסטר","רק ה־ALU","רק המטמון"],answerIdx:1,explanation:"שלב 1: lw קוראת פקודה, קוראת רגיסטר בסיס, מחברת היסט, ניגשת לזיכרון נתונים, וכותבת ל־rt. שלב 2: כל אלה בטור באותו מחזור. שלב 3: לכן זמן המחזור נקבע לפי המסלול הזה — לא לפי add הקצר."},
    {topic:"pipeline",difficulty:2,question:"מהו stall בצנרת?",options:["ביטול הפקודה","הזרקת בועה — הצנרת מחכה מחזור בלי להתקדם בפקודה התלויה","החלפת סדר פקודות תמיד","כיבוי ה־ALU"],answerIdx:1,explanation:"שלב 1: כשהנתון עדיין לא מוכן, אי אפשר לתת לפקודה הבאה להיכנס ל־EX. שלב 2: מכניסים nop / בועה. שלב 3: זה המחיר של load-use, לא של כל data hazard."},
    {topic:"pipeline",difficulty:2,question:"למה מצמצמים control hazard עם branch ב־ID במקום ב־EX?",options:["כי כך יודעים מוקדם יותר אם לקפוץ ומבטלים פחות פקודות שכבר נשלפו","כי ID תמיד פנוי","כי כך נחסך ALU","כי אין צורך ב־PC"],answerIdx:0,explanation:"שלב 1: ככל שההחלטה מאוחרת יותר, יותר פקודות שגויות כבר בצנרת. שלב 2: השוואת רגיסטרים ב־ID מקצרת את חלון אי־הוודאות. שלב 3: עדיין עלול להיות צורך ב־flush של פקודה אחת."},
    {topic:"pipeline",difficulty:3,question:"מהו write-after-read (WAR) ב־MIPS 5-stage הקלאסי?",options:["הסכנה העיקרית ש־forwarding פותר","כמעט לא קורה: כתיבה תמיד ב־WB אחרי שקודמות כבר קראו","זהה ל־load-use","קורה בכל beq"],answerIdx:1,explanation:"שלב 1: קריאה ב־ID, כתיבה ב־WB. שלב 2: פקודה מאוחרת כותבת אחרי שהמוקדמת כבר קראה. שלב 3: לכן ב־5-stage הסטנדרטי WAR/WAW כמעט לא רלוונטיים — RAW הוא הסיפור, עם forwarding."},
    {topic:"pipeline",difficulty:3,question:"שתי פקודות: add $t0,$s0,$s1 ואז sub $t2,$t0,$s2. מה forwarding עושה?",options:["עוצר שני מחזורים","מעביר את תוצאת ה־add מיציאת ה־ALU / EX/MEM לכניסת ה־ALU של sub","מבטל את sub","כותב לזיכרון"],answerIdx:1,explanation:"שלב 1: sub צריך את $t0 לפני ש־add הגיע ל־WB. שלב 2: התוצאה כבר קיימת אחרי EX של add. שלב 3: ה־forwarding unit בוחר את ה־ALU-out במקום את הערך הישן מקובץ הרגיסטרים. אין stall."},
    {topic:"cache",difficulty:2,question:"מהו miss penalty?",options:["זמן גישה למטמון בפגיעה","המחיר הנוסף בשעונים כשצריך להביא בלוק מהרמה הבאה","גודל ה־tag","מספר הדרכים"],answerIdx:1,explanation:"שלב 1: hit עולה את זמן המטמון בלבד. שלב 2: miss דורש הבאת בלוק שלם מזיכרון / L2. שלב 3: העונש גדל עם גודל הבלוק ועם מרחק הרמה הבאה — לכן בלוק גדול אינו תמיד כדאי."},
    {topic:"cache",difficulty:3,question:"מטמון 2-way עם 32 סטים ובלוק 32 בתים. כמה ביטי אינדקס יש?",options:["5","6","10","32"],answerIdx:0,explanation:"שלב 1: מספר הסטים קובע את האינדקס, לא מספר הבלוקים הכולל. שלב 2: 32 סטים → log2(32)=5 ביטי אינדקס. שלב 3: 2-way משפיע על מספר הבלוקים (64) אבל לא על רוחב שדה האינדקס."},
    {topic:"cache",difficulty:3,question:"מהי מדיניות LRU?",options:["מפנים תמיד את בלוק 0","מפנים את הבלוק שהיה בשימוש הכי מזמן באותו סט","מפנים אקראית תמיד","כותבים תמיד לזיכרון"],answerIdx:1,explanation:"שלב 1: בסט עם כמה דרכים צריך לבחור קרבן. שלב 2: LRU מנחש שהכי פחות שימושי הוא זה שלא נגענו בו הכי הרבה זמן. שלב 3: זה מנצל temporal locality; יישום מדויק יקר בחומרה בדרגות גבוהות."},
    {topic:"cache",difficulty:2,question:"מהו compulsory miss?",options:["החטאה כי הבלוק מעולם לא היה במטמון — הקריאה הראשונה","החטאה כי הסט מלא","החטאה בגלל גודל המטמון","החטאה בגלל write-back"],answerIdx:0,explanation:"שלב 1: שלושת הסוגים: compulsory, capacity, conflict. שלב 2: הראשונה לכל בלוק היא compulsory — גם במטמון אינסופי. שלב 3: בלוק גדול יותר / prefetch מפחיתים אותן על חשבון עונש."},
    {topic:"formats",difficulty:2,question:"כמה סיביות יש לשדה rs ב־R-type ולמה?",options:["8, כי יש 256 רגיסטרים","5, כי יש 32 רגיסטרים","6, כמו opcode","16, כמו immediate"],answerIdx:1,explanation:"שלב 1: 32 רגיסטרים → log2(32)=5 סיביות. שלב 2: לכן rs, rt, rd כולם 5. שלב 3: זו פשרת התכנון — מספיק רגיסטרים בלי לנפח את הפקודה."},
    {topic:"formats",difficulty:3,question:"פקודת j עם address של 26 סיביות: איך נבנית כתובת היעד?",options:["PC+4 כולו מוחלף ב־address","4 הביטים העליונים של PC+4 + address + שני אפסי יישור","רק address מורחב באפסים ל־32","PC−address"],answerIdx:1,explanation:"שלב 1: פקודות מיושרות ל־4, לכן שתי סיביות תחתונות 00. שלב 2: 26+2=28, וארבעת ביטי PC+4 העליונים משלימים ל־32. שלב 3: לכן לא אפשר לקפוץ לכל מרחב הכתובות בפקודת j אחת."},
    {topic:"formats",difficulty:2,question:"מה מבדיל slt מ־sltu?",options:["אין הבדל","slt משווה במשלים ל־2; sltu משווה בלי סימן","slt רק לקבועים","sltu כותב לזיכרון"],answerIdx:1,explanation:"שלב 1: ‎-1 כמספר חתום קטן מ־0, כלא־חתום הוא 0xFFFFFFFF — הכי גדול. שלב 2: slt ייתן 1 על ‎-1<0; sltu ייתן 0. שלב 3: בחירת הפקודה משנה את תוצאת ההשוואה לגמרי."},
    {topic:"memory",difficulty:2,question:"מה קורה ב־lb לעומת lw?",options:["שתיהן טוענות מילה","lb טוענת בית אחד ומרחיבה סימן ל־32 סיביות; lw טוענת 4 בתים מיושרים","lb דורשת יישור ל־4","lb כותבת בית"],answerIdx:1,explanation:"שלב 1: lb קוראת 8 סיביות מכל כתובת. שלב 2: מרחיבים סימן כדי שהערך השלילי יישמר ברגיסטר. שלב 3: lbu מרחיב באפסים. lw דורש כתובת המתחלקת ב־4."},
    {topic:"memory",difficulty:3,question:"מערך של מילים מתחיל ב־0x10010000. מה כתובת המילה באינדקס 3?",options:["0x10010003","0x1001000C","0x10010012","0x10010004"],answerIdx:1,explanation:"שלב 1: כל מילה 4 בתים. שלב 2: היסט = 3×4 = 12 = 0xC. שלב 3: 0x10010000+0xC = 0x1001000C. הטעות הקלאסית היא להוסיף 3."},
    {topic:"memory",difficulty:2,question:"מה תפקיד $sp בקריאת פונקציה?",options:["מצביע לקוד","מצביע המחסנית: יורדים לפני דחיפה, עולים אחרי שחרור","קבוע 0","כתובת חזרה בלבד"],answerIdx:1,explanation:"שלב 1: המחסנית גדלה כלפי כתובות נמוכות. שלב 2: addi $sp,$sp,-N ואז sw של $ra / רגיסטרים שמורים. שלב 3: $ra עצמו הוא כתובת החזרה, לא המצביע."},
    {topic:"memory",difficulty:3,question:"מדוע sw לכתובת 0x10010002 תיכשל ביישור?",options:["כי 2 אי־זוגי בלבד","כי 0x10010002 אינו מתחלק ב־4","כי הכתובת שלילית","כי MARS אוסר על 0x10010000"],answerIdx:1,explanation:"שלב 1: מילה = 4 בתים, הכתובת חייבת ≡ 0 (mod 4). שלב 2: 0x…02 ≡ 2. שלב 3: זו שגיאת יישור — לא בגלל אי־זוגיות לבדה (0x…01 גם ייכשל, אבל הקריטריון הוא מודולו 4)."},
    {topic:"memory",difficulty:2,question:"מה ההבדל בין little endian ל־big endian בערך 0x12345678 בכתובת 0x100?",options:["אין הבדל בבתים","big: 12 ב־0x100; little: 78 ב־0x100","big: 78 ב־0x100; little: 12 ב־0x100","רק הסימן משתנה"],answerIdx:1,explanation:"שלב 1: endianness היא סדר הבתים בזיכרון, לא ערך הרגיסטר. שלב 2: big שם את הבית הכבד בכתובת הנמוכה. שלב 3: MIPS בספר Big; MARS לרוב Little — תרגיל שחוזר."},
    {topic:"numbers",difficulty:2,question:"מהו הייצוג של ‎-1 ב־8 סיביות משלים ל־2?",options:["10000001","11111111","10000000","00000001"],answerIdx:1,explanation:"שלב 1: הופכים את 00000001 → 11111110. שלב 2: מוסיפים 1 → 11111111. שלב 3: בדיקה: ‎-1+1=0 עם גלישה טבעית. כל הסיביות דולקות."},
    {topic:"numbers",difficulty:3,question:"מתי addi גורם ל־overflow במשלים ל־2?",options:["תמיד כשהתוצאה שלילית","כשחיבור שני חיוביים נותן שלילי, או שני שליליים נותן חיובי","רק כש־immediate שלילי","לעולם לא ב־MIPS"],answerIdx:1,explanation:"שלב 1: overflow הוא חריגה מהטווח החתום, לא נשיאה. שלב 2: סימן התוצאה הפוך משני המחוברים מאותו סימן. שלב 3: addiu מתעלם מזה — לכן בחירת הפקודה משנה."},
    {topic:"numbers",difficulty:2,question:"מה מבצעת slt $t0, $s0, $s1?",options:["$t0 = $s0 − $s1","$t0=1 אם $s0 < $s1 כחתומים, אחרת 0","מחליפה את שני הרגיסטרים","קופצת אם קטן"],answerIdx:1,explanation:"שלב 1: slt כותבת 0 או 1 לרגיסטר, לא קופצת. שלב 2: ההשוואה חתומה. שלב 3: blt מדומה כ־slt ואז bne מול $zero."},
    {topic:"numbers",difficulty:3,question:"מדוע shift left ב־1 שקול לכפל ב־2, ומה הקשר ל־overflow?",options:["אין קשר לכפל","הזזה שמאלה מכניסה 0 מימין; אם סיבית הסימן השתנתה — חרגנו מהטווח החתום","זה תמיד בטוח","זה רק ללא־חתומים"],answerIdx:1,explanation:"שלב 1: כל הזזה שמאלה כופלת ב־2. שלב 2: במשלים ל־2 הטווח מוגבל; סימן שמתהפך אומר שהערך כבר לא הייצוג של הכפל. שלב 3: לכן בודקים את הסיבית שנפלטה / שינוי הסימן."}
  ]);
  ARCH_MCQ.forEach(function (q, i) { q.id = 1000 + i; });

  const H1_NAMES = {
    limits:    "גבולות ורציפות",
    deriv:     "נגזרות וכללי גזירה",
    analysis:  "חקירת פונקציה",
    integrals: "אינטגרלים ושיטות"
  };
  const H2_NAMES = {
    improper:  "אינטגרלים לא אמיתיים",
    series:    "טורים והתכנסות",
    multivar:  "פונקציות רב-משתניות",
    complex:   "מספרים מרוכבים"
  };
  const HEDVA_MCQ = [

    // גבולות ורציפות
    {topic:"limits",difficulty:1,question:"מה הגבול של (sin 3x)/x כאשר x שואף ל-0?",options:["0","1","3","לא קיים"],answerIdx:2,explanation:"מרחיבים: (sin3x)/(3x)·3 → 1·3 = 3."},
    {topic:"limits",difficulty:2,question:"מתי מותר להשתמש בכלל לופיטל?",options:["תמיד כשיש שבר","רק בצורות לא מוגדרות 0/0 או ∞/∞","רק בגבול באינסוף","רק כשהמונה גזיר"],answerIdx:1,explanation:"צורות כמו 0·∞ או ∞−∞ יש להביא קודם לצורת שבר."},
    {topic:"limits",difficulty:2,question:"מה הגבול של (1+1/x)^x כאשר x שואף לאינסוף?",options:["1","e","∞","0"],answerIdx:1,explanation:"זו ההגדרה הקלאסית של e — מופיע כמעט בכל מבחן."},
    {topic:"limits",difficulty:3,question:"פונקציה f רציפה בקטע סגור [a,b] ומקיימת f(a)·f(b)<0. מה מובטח?",options:["f מונוטונית","קיימת נקודה c בקטע שבה f(c)=0","f גזירה","f חסומה בלבד"],answerIdx:1,explanation:"משפט ערך הביניים — שאלה חוזרת על קיום שורש."},
    {topic:"limits",difficulty:2,question:"מה תנאי הרציפות של f בנקודה x₀?",options:["f מוגדרת ב-x₀ בלבד","הגבול קיים בלבד","f(x₀) מוגדרת, הגבול קיים, והם שווים","f גזירה ב-x₀"],answerIdx:2,explanation:"שלושת התנאים יחד; גזירות גוררת רציפות אך לא להפך."},

    // נגזרות
    {topic:"deriv",difficulty:1,question:"מהי הנגזרת של x·ln x?",options:["ln x","1/x","ln x + 1","x/ln x"],answerIdx:2,explanation:"כלל המכפלה: 1·ln x + x·(1/x)."},
    {topic:"deriv",difficulty:2,question:"מהי הנגזרת של e^(x²)?",options:["e^(x²)","2x·e^(x²)","x²·e^(x²)","2x"],answerIdx:1,explanation:"כלל השרשרת: הנגזרת החיצונית כפול הפנימית."},
    {topic:"deriv",difficulty:2,question:"בגזירה סתומה של x²+y²=25, מהו dy/dx?",options:["−x/y","x/y","−y/x","2x+2y"],answerIdx:0,explanation:"גוזרים לפי x: 2x+2y·y'=0 ולכן y' = −x/y."},
    {topic:"deriv",difficulty:3,question:"אם f גזירה ו-f'(x₀)=0, מה בהכרח נכון?",options:["x₀ נקודת מקסימום","x₀ נקודת מינימום","x₀ נקודה חשודה לקיצון בלבד","f אינה רציפה"],answerIdx:2,explanation:"נדרשת בדיקת סימן הנגזרת או הנגזרת השנייה; ייתכן גם פיתול."},
    {topic:"deriv",difficulty:2,question:"מהי הנגזרת של arctan x?",options:["1/(1+x²)","1/√(1−x²)","−1/(1+x²)","1/x"],answerIdx:0,explanation:"מדף הנוסחאות — מופיע גם באינטגרלים."},

    // חקירת פונקציה
    {topic:"analysis",difficulty:2,question:"איך מוצאים אסימפטוטה אנכית?",options:["גבול באינסוף","נקודות שבהן המכנה מתאפס והגבול שואף לאינסוף","נגזרת שנייה אפס","חיתוך עם הצירים"],answerIdx:1,explanation:"יש לוודא שהמונה אינו מתאפס באותה נקודה, אחרת זו נקודת אי-רציפות סליקה."},
    {topic:"analysis",difficulty:2,question:"מה קובעת הנגזרת השנייה?",options:["מונוטוניות","קמירות וקעירות ונקודות פיתול","אסימפטוטות","תחום הגדרה"],answerIdx:1,explanation:"f''>0 קמורה כלפי מעלה, f''<0 קעורה; שינוי סימן = פיתול."},
    {topic:"analysis",difficulty:3,question:"איך מוצאים אסימפטוטה משופעת y=mx+n?",options:["m = גבול f(x)/x ו-n = גבול (f(x)−mx)","m = f'(x) ו-n = f(0)","רק כשיש אסימפטוטה אנכית","אין דרך כללית"],answerIdx:0,explanation:"שני גבולות באינסוף; אם אחד לא קיים אין אסימפטוטה משופעת."},
    {topic:"analysis",difficulty:2,question:"מה מבטיח משפט לגראנז' לפונקציה רציפה ב-[a,b] וגזירה ב-(a,b)?",options:["קיים c שבו f'(c) = (f(b)−f(a))/(b−a)","f מונוטונית","f'(c)=0 תמיד","f קמורה"],answerIdx:0,explanation:"רול הוא המקרה הפרטי שבו f(a)=f(b)."},

    // אינטגרלים
    {topic:"integrals",difficulty:1,question:"מהו האינטגרל של 1/x?",options:["ln x + C","ln|x| + C","−1/x² + C","x·ln x + C"],answerIdx:1,explanation:"הערך המוחלט הכרחי — שגיאה שחוזרת בבדיקות."},
    {topic:"integrals",difficulty:2,question:"איזו שיטה מתאימה לאינטגרל של x·e^x?",options:["הצבה","אינטגרציה בחלקים","שברים חלקיים","זהות טריגונומטרית"],answerIdx:1,explanation:"בוחרים u=x כי הנגזרת שלו מפשטת, ו-dv=e^x dx."},
    {topic:"integrals",difficulty:2,question:"איזו שיטה מתאימה ל-∫ 1/(x²−1) dx?",options:["בחלקים","שברים חלקיים","הצבה טריגונומטרית","גזירה"],answerIdx:1,explanation:"מפרקים ל-A/(x−1)+B/(x+1)."},
    {topic:"integrals",difficulty:3,question:"מה נותן המשפט היסודי של החדו\"א?",options:["הנגזרת של אינטגרל מסוים עם גבול עליון x היא f(x)","כל פונקציה רציפה גזירה","האינטגרל תמיד חיובי","גבול של סכום רימן אינו קיים"],answerIdx:0,explanation:"הקשר בין גזירה לאינטגרציה — בסיס לחישוב אינטגרלים מסוימים."},
    {topic:"integrals",difficulty:3,question:"איך מחשבים שטח בין שתי פונקציות f מעל g בקטע [a,b]?",options:["∫(f+g)","∫(f−g)","∫f · ∫g","∫|f|"],answerIdx:1,explanation:"חובה לבדוק נקודות חיתוך; אם הסדר מתחלף מפצלים לקטעים."},
    {topic:"improper",difficulty:3,question:"מתי אינטגרל לא אמיתי ∫₁^∞ 1/x^p dx מתכנס?",options:["p>1","p<1","p=1","תמיד"],answerIdx:0,explanation:"עבור p≤1 הוא מתבדר — קריטריון בסיסי שגם משמש למבחן ההשוואה בטורים."},

    // טורים
    {topic:"series",difficulty:2,question:"מתי הטור הגיאומטרי Σq^n מתכנס?",options:["|q|<1","|q|>1","q>0","תמיד"],answerIdx:0,explanation:"והסכום הוא 1/(1−q) עבור טור המתחיל ב-n=0."},
    {topic:"series",difficulty:2,question:"מה אומר מבחן ההכרח (תנאי הכרחי להתכנסות)?",options:["אם האיבר הכללי לא שואף ל-0 הטור מתבדר","אם האיבר שואף ל-0 הטור מתכנס","הטור תמיד מתכנס","אין קשר"],answerIdx:0,explanation:"הכיוון ההפוך אינו נכון — הטור ההרמוני מתבדר למרות ש-1/n→0."},
    {topic:"series",difficulty:3,question:"מה קובע מבחן המנה (דלאמבר) כאשר הגבול L<1?",options:["הטור מתכנס בהחלט","הטור מתבדר","אין מסקנה","הטור מתכנס בתנאי"],answerIdx:0,explanation:"L>1 מתבדר; L=1 המבחן אינו מכריע וצריך כלי אחר."},
    {topic:"series",difficulty:3,question:"מהו רדיוס ההתכנסות של טור חזקות Σaₙ(x−x₀)ⁿ?",options:["R = lim |aₙ/aₙ₊₁|","R = lim aₙ","R = x₀","תמיד 1"],answerIdx:0,explanation:"בקצוות הקטע יש לבדוק התכנסות בנפרד."},
    {topic:"series",difficulty:2,question:"מהו פיתוח טיילור של e^x סביב 0?",options:["Σ xⁿ","Σ xⁿ/n!","Σ (−1)ⁿxⁿ","Σ n·xⁿ"],answerIdx:1,explanation:"מתכנס לכל x; ממנו גוזרים גם את פיתוחי sin ו-cos."},

    // רב-משתני
    {topic:"multivar",difficulty:2,question:"מהי הנגזרת החלקית ∂/∂x של f(x,y)=x²y+y³?",options:["2xy","x²+3y²","2xy+3y²","2x"],answerIdx:0,explanation:"גוזרים לפי x ומתייחסים ל-y כקבוע, לכן y³ מתאפס."},
    {topic:"multivar",difficulty:3,question:"מה תנאי הכרחי לנקודת קיצון פנימית של f(x,y)?",options:["שתי הנגזרות החלקיות מתאפסות","רק ∂f/∂x מתאפסת","הפונקציה רציפה","הדטרמיננטה חיובית"],answerIdx:0,explanation:"נקודה קריטית; הסיווג נעשה במבחן ההסיאן."},
    {topic:"multivar",difficulty:3,question:"במבחן ההסיאן, אם D>0 ו-fxx>0 — מהי הנקודה?",options:["מקסימום מקומי","מינימום מקומי","אוכף","לא ניתן לקבוע"],answerIdx:1,explanation:"D>0 ו-fxx<0 מקסימום; D<0 אוכף; D=0 לא מכריע."},
    {topic:"multivar",difficulty:3,question:"למה משמשת שיטת כופלי לגראנז'?",options:["לקיצון תחת אילוץ","לחישוב אינטגרל כפול","למציאת אסימפטוטות","לפיתוח לטור"],answerIdx:0,explanation:"פותרים ∇f = λ∇g יחד עם משוואת האילוץ."},
    {topic:"multivar",difficulty:2,question:"מה מתאר הגרדיאנט ∇f בנקודה?",options:["כיוון העלייה התלולה ביותר","כיוון הירידה","הערך המקסימלי","שטח מתחת לפונקציה"],answerIdx:0,explanation:"וגודלו הוא קצב השינוי המרבי; הוא ניצב לקווי הגובה."}
  
  ];
  [].push.apply(HEDVA_MCQ, [

    {topic:"improper",difficulty:2,question:"איך מטפלים באינטגרל ∫₀¹ 1/√x dx?",options:["הוא לא מוגדר","כגבול כאשר הגבול התחתון שואף ל-0 מימין","גוזרים תחילה","מציבים x=1"],answerIdx:1,explanation:"אי-רציפות בקצה: מחשבים lim(t→0⁺) ∫ₜ¹ ומקבלים 2 — מתכנס."},
    {topic:"improper",difficulty:3,question:"מה אומר מבחן ההשוואה לאינטגרלים לא אמיתיים?",options:["אם 0≤f≤g ו-∫g מתכנס אז ∫f מתכנס","אם f≤g אז שניהם מתבדרים","רק לפונקציות שליליות","אין מבחן כזה"],answerIdx:0,explanation:"ובכיוון ההפוך: אם ∫f מתבדר אז גם ∫g. משווים בדרך כלל ל-1/x^p."},
    {topic:"improper",difficulty:2,question:"מתי ∫₀¹ 1/x^p dx מתכנס?",options:["p<1","p>1","p=1","תמיד"],answerIdx:0,explanation:"שים לב שזה הפוך מהמקרה של ∫₁^∞ — מלכודת נפוצה."},
    {topic:"complex",difficulty:1,question:"מהי הצורה הפולרית של מספר מרוכב z?",options:["z = a+bi","z = r(cos θ + i·sin θ)","z = r·θ","z = a·bi"],answerIdx:1,explanation:"r=|z| ו-θ הארגומנט; שקול ל-re^(iθ) לפי אוילר."},
    {topic:"complex",difficulty:2,question:"לפי נוסחת דה-מואבר, מהו z^n בצורה פולרית?",options:["rⁿ(cos nθ + i·sin nθ)","r(cos nθ + i·sin nθ)","rⁿ(cos θ + i·sin θ)","nr(cos θ + i·sin θ)"],answerIdx:0,explanation:"הרדיוס בחזקה, הזווית מוכפלת — הבסיס לחישוב שורשים."},
    {topic:"complex",difficulty:3,question:"כמה שורשים מסדר n יש למספר מרוכב שאינו אפס?",options:["1","2","n שורשים שונים","אינסוף"],answerIdx:2,explanation:"מפוזרים באופן שווה על מעגל ברדיוס r^(1/n), בהפרשי זווית 2π/n."},
    {topic:"complex",difficulty:2,question:"מהו הצמוד של z=a+bi ומה z·z̄?",options:["a−bi, והמכפלה a²+b²","a+bi, והמכפלה a²−b²","−a−bi, והמכפלה 0","b+ai, והמכפלה 2ab"],answerIdx:0,explanation:"המכפלה היא |z|² ולכן ממשית — כך מחלקים מרוכבים."}

  ]);
  [].push.apply(HEDVA_MCQ, [
    {topic:"limits",difficulty:2,question:"מה הגבול של (√(x+1)−1)/x כאשר x→0?",options:["0","∞","1/2","לא קיים"],answerIdx:2,explanation:"שלב 1: זו צורת 0/0. שלב 2: כופלים בצמוד: המונה הופך ל־((x+1)−1)=x. שלב 3: נשאר 1/(√(x+1)+1) → 1/2. בלי הצמוד לופיטל גם עובד, אבל הצמוד קצר יותר."},
    {topic:"limits",difficulty:3,question:"אם lim(x→a) f(x) קיים ו־f אינה מוגדרת ב־a, מה בהכרח נכון?",options:["f רציפה ב־a","יש אי-רציפות סליקה או לפחות גבול, בלי ערך בנקודה","f מתבדרת","f גזירה ב־a"],answerIdx:1,explanation:"שלב 1: גבול לא דורש ש־f(a) יהיה מוגדר. שלב 2: אם מגדירים f(a) כערך הגבול מקבלים רציפות — זו סליקה. שלב 3: בלי ההגדרה מחדש זו לא רציפות. גזירות דורשת יותר."},
    {topic:"limits",difficulty:2,question:"מה הגבול של (1−cos x)/x² כאשר x→0?",options:["0","1","1/2","∞"],answerIdx:2,explanation:"שלב 1: 0/0. שלב 2: זהות 1−cos x = 2 sin²(x/2), או לופיטל פעמיים. שלב 3: מתקבל 1/2. זה גבול סטנדרטי שחוזר בחקירות ובטיילור."},
    {topic:"limits",difficulty:3,question:"מתי אומרים שלפונקציה יש אי-רציפות מסוג קפיצה ב־a?",options:["הגבול הדו-צדדי קיים ושונה מ־f(a)","הגבולות החד-צדדיים קיימים (סופיים) ושונים זה מזה","הגבול אינסופי","f לא מוגדרת ב־a בלבד"],answerIdx:1,explanation:"שלב 1: קפיצה = שני גבולות חד-צדדיים סופיים שונים. שלב 2: סליקה = גבול דו-צדדי קיים ושונה מהערך / חסר ערך. שלב 3: עיקרית = לפחות צד אחד מתבדר או לא קיים."},
    {topic:"deriv",difficulty:2,question:"מהי הנגזרת של ln(x²+1)?",options:["1/(x²+1)","2x/(x²+1)","2x","1/x"],answerIdx:1,explanation:"שלב 1: כלל שרשרת. שלב 2: הנגזרת החיצונית 1/u עם u=x²+1. שלב 3: כופלים ב־u'=2x. לא שוכחים את הנגזרת הפנימית — זו הטעות הנפוצה."},
    {topic:"deriv",difficulty:3,question:"נגזור את x^x (ל־x>0). מה הצעד הראשון הנכון?",options:["כלל המכפלה ישירות על x·x","כותבים x^x = e^{x ln x} ואז גוזרים שרשרת","הנגזרת היא x·x^{x−1} בלבד","אי אפשר לגזור"],answerIdx:1,explanation:"שלב 1: בסיס מעריך שניהם משתנים — אין כלל חזקה רגיל. שלב 2: מעבירים לאקספוננט. שלב 3: הנגזרת של x ln x היא ln x + 1, ולכן (x^x)' = x^x (ln x + 1)."},
    {topic:"deriv",difficulty:2,question:"מהי הנגזרת הלוגריתמית של f/g?",options:["f'/g'","(ln f)' − (ln g)' = f'/f − g'/g","f'g − fg'","1/(f/g)"],answerIdx:1,explanation:"שלב 1: ln(f/g)=ln f − ln g. שלב 2: גוזרים איבר-איבר. שלב 3: זה מקצר מכפלות ארוכות; כלל המנה מתקבל אם כופלים ב־f/g."},
    {topic:"deriv",difficulty:3,question:"משפט רול דורש f(a)=f(b) בנוסף לרציפות וגזירות. מה מקבלים?",options:["f קבועה","קיים c עם f'(c)=0","f'(a)=f'(b)","אין קיצון"],answerIdx:1,explanation:"שלב 1: רול הוא לגראנז' כש־f(a)=f(b), ולכן השיפוע הממוצע 0. שלב 2: קיימת נקודה עם משיק אופקי. שלב 3: לא נובע ש־f קבועה — רק שיש לפחות שורש אחד ל־f'."},
    {topic:"analysis",difficulty:2,question:"איך מוצאים תחום הגדרה של ln(x−2)/(x−5)?",options:["x≠5 בלבד","x>2 וגם x≠5","x≥2","x<5"],answerIdx:1,explanation:"שלב 1: ln דורש ארגומנט חיובי: x−2>0 → x>2. שלב 2: מכנה לא מתאפס: x≠5. שלב 3: 5>2 ולכן נשאר (2,5)∪(5,∞). שוכחים את ה־ln ומפסידים מחצית התחום."},
    {topic:"analysis",difficulty:3,question:"f'(x)>0 בקטע. מה נכון?",options:["f קמורה","f עולה ממש בקטע","f חיובית","יש מקסימום בקצה"],answerIdx:1,explanation:"שלב 1: סימן f' קובע מונוטוניות, לא קמירות. שלב 2: f'>0 ⇒ עולה ממש. שלב 3: קמירות נקבעת מ־f''. ערך הפונקציה יכול להיות שלילי גם כשהיא עולה."},
    {topic:"analysis",difficulty:2,question:"נקודת פיתול דורשת שינוי קמירות. האם f''(c)=0 מספיק?",options:["כן, תמיד","לא: צריך שינוי סימן של f'' (או של f') סביב c; ייתכן f''=0 בלי פיתול","רק אם f'(c)=0","רק אם c קצה קטע"],answerIdx:1,explanation:"שלב 1: x³ ב־0: f''=0 ויש פיתול. שלב 2: x⁴ ב־0: f''=0 ואין שינוי קמירות. שלב 3: לכן f''=0 הוא חשוד, לא גזר דין."},
    {topic:"analysis",difficulty:3,question:"אסימפטוטה אופקית y=L פירושה:",options:["f(L)=0","lim(x→±∞) f(x) = L","f'(x)=0 באינסוף","יש אנכית ב־L"],answerIdx:1,explanation:"שלב 1: אופקית היא גבול באינסוף (או מינוס אינסוף). שלב 2: הפונקציה יכולה לחתוך את הישר. שלב 3: זה לא קשור לאנכי ולאו-דווקא לנגזרת."},
    {topic:"integrals",difficulty:2,question:"מהו ∫ 2x / (x²+1) dx?",options:["ln|x²+1| + C","2 ln|x²+1| + C","arctan x + C","x²+1 + C"],answerIdx:0,explanation:"שלב 1: המונה הוא בדיוק נגזרת המכנה. שלב 2: הצבה u=x²+1, du=2x dx. שלב 3: ∫ du/u = ln|u|. בלי הערך המוחלט זו טעות, גם אם u>0 תמיד כאן."},
    {topic:"integrals",difficulty:3,question:"באינטגרציה בחלקים של ∫ ln x dx, מה בוחרים כ־u?",options:["dv = ln x dx","u = ln x, dv = dx","u = x","אין בחלקים"],answerIdx:1,explanation:"שלב 1: ln לא מתמקד ישירות. שלב 2: u=ln x ⇒ du=dx/x, dv=dx ⇒ v=x. שלב 3: xv − ∫x·(1/x) dx = x ln x − x + C."},
    {topic:"integrals",difficulty:2,question:"מהו ∫ sin²x dx לפי זהות?",options:["−cos²x + C","∫(1−cos 2x)/2 dx","sin x + C","x + C"],answerIdx:1,explanation:"שלב 1: חזקה זוגית — מעבירים לזווית כפולה. שלב 2: sin²x = (1−cos 2x)/2. שלב 3: האינטגרל נעשה מיידי. בלי הזהות נתקעים."},
    {topic:"integrals",difficulty:3,question:"במשפט היסודי, d/dx ∫_a^{x²} f(t) dt שווה ל־",options:["f(x²)","f(x²)·2x","F(x²)−F(a)","f(x)·2x"],answerIdx:1,explanation:"שלב 1: כלל השרשרת על הגבול העליון. שלב 2: הנגזרת לפי הגבול היא f(גבול) כפול נגזרת הגבול. שלב 3: כאן ·2x. לשכוח את 2x זו טעות חוזרת."},
    {topic:"improper",difficulty:2,question:"איך בודקים ∫₁^∞ e^{−x} dx?",options:["הוא מתבדר כי הטווח אינסופי","lim(b→∞) ∫₁^b e^{−x} dx = e^{−1} — מתכנס","גוזרים תחת הסימן","משווים ל־1/x"],answerIdx:1,explanation:"שלב 1: מחליפים את ∞ בגבול. שלב 2: הקדומה −e^{−x} מ־1 עד b שואפת ל־e^{−1}. שלב 3: דעיכה אקספוננציאלית מנצחת כל פולינום — מתכנס."},
    {topic:"improper",difficulty:3,question:"מבחן הגבול להשוואה: אם lim f/g = c ∈ (0,∞), אז",options:["∫f מתכנס תמיד","∫f ו־∫g מתכנסים או מתבדרים יחד","אין קשר","רק אם c=1"],answerIdx:1,explanation:"שלב 1: הזנבות מאותו סדר גודל. שלב 2: התכנסות של האחד גוררת את השני. שלב 3: c=0 או ∞ דורשים זהירות — לא אותו מבחן."},
    {topic:"improper",difficulty:2,question:"∫_{-1}^{1} dx/x מוגדר כערך ראשי. מה נכון כאינטגרל לא אמיתי רגיל?",options:["מתכנס כי זו פונקציה אי-זוגית","מתבדר: כל צד לחוד הוא ln שבור ל־∞","מתכנס בהחלט","שווה 0 תמיד בלי גבולות"],answerIdx:1,explanation:"שלב 1: אי-רציפות ב־0 בפנים. שלב 2: חייבים לפצל ל־∫_{-1}^{−ε}+∫_δ^{1} ושני הגבולות בנפרד. שלב 3: כל צד מתבדר. הערך הראשי (ε=δ) הוא 0 — זה לא ההגדרה הרגילה."},
    {topic:"improper",difficulty:3,question:"איזה אינטגרל מתכנס?",options:["∫₁^∞ dx/x","∫₁^∞ dx/√x","∫₁^∞ dx/x²","∫₀^1 dx/x"],answerIdx:2,explanation:"שלב 1: מבחן p באינסוף דורש p>1. שלב 2: 1/x² עם p=2 מתכנס; הרמוני ו־p=1/2 מתבדרים. שלב 3: ∫₀^1 dx/x מתבדר (p=1 בקצה 0)."},
    {topic:"series",difficulty:2,question:"הטור ההרמוני המתחלף Σ (−1)^{n+1}/n:",options:["מתבדר","מתכנס בתנאי (לא בהחלט)","מתכנס בהחלט","גיאומטרי עם |q|>1"],answerIdx:1,explanation:"שלב 1: לייבניץ — איברים יורדים ל־0, לכן מתכנס. שלב 2: הערכים המוחלטים הם הרמוני, מתבדר. שלב 3: זו הדוגמה הקלאסית להתכנסות בתנאי."},
    {topic:"series",difficulty:3,question:"מבחן האינטגרל ל־Σ f(n) דורש ש־f תהיה",options:["כל פונקציה","חיובית, יורדת, רציפה לבסוף","זוגית","פולינום"],answerIdx:1,explanation:"שלב 1: משווים את הטור לאינטגרל לא אמיתי של אותה f. שלב 2: בלי מונוטוניות היורדת ההשוואה לציורים של מלבנים נשברת. שלב 3: לכן עובד יפה על 1/(n ln² n) וכדומה."},
    {topic:"series",difficulty:2,question:"מהו סכום Σ_{n=0}^∞ (1/3)^n?",options:["1/3","3/2","3","לא מתכנס"],answerIdx:1,explanation:"שלב 1: גיאומטרי עם q=1/3, |q|<1. שלב 2: סכום מ־n=0 הוא 1/(1−q)=3/2. שלב 3: אם מתחילים מ־n=1 מקבלים 1/2 — קוראים את גבול הסכום."},
    {topic:"series",difficulty:3,question:"טור חזקות סביב 0 עם R=2. מה חייבים לבדוק בנפרד?",options:["x=0","x=±2","כל |x|<2","אין מה לבדוק"],answerIdx:1,explanation:"שלב 1: בתוך הרדיוס יש התכנסות בהחלט; מחוץ — התבדרות. שלב 2: על השפה |x|=R המבחן לרדיוס שותק. שלב 3: בודקים x=2 ו־x=−2 כטורים מספריים."},
    {topic:"multivar",difficulty:2,question:"מהי ∂/∂y של f(x,y)=e^{xy}?",options:["e^{xy}","x e^{xy}","y e^{xy}","xy e^{xy}"],answerIdx:1,explanation:"שלב 1: y הוא המשתנה, x קבוע. שלב 2: שרשרת: e^{xy}·x. שלב 3: ∂/∂x הייתה נותנת y e^{xy}. מערבבים בין המשתנים — זו הטעות."},
    {topic:"multivar",difficulty:3,question:"במבחן ההסיאן, D<0 פירושו",options:["מינימום","מקסימום","אוכף","אין נקודה קריטית"],answerIdx:2,explanation:"שלב 1: D=fxx fyy − (fxy)². שלב 2: D<0 — סימנים מנוגדים / דומיננטיות מעורבת → אוכף. שלב 3: D>0 הולכים ל־fxx כדי להחליט מין/מקס. D=0 לא מכריע."},
    {topic:"multivar",difficulty:2,question:"נגזרת כיוונית בכיוון וקטור היחידה u היא",options:["||∇f||","∇f · u","∇f × u","f_x + f_y"],answerIdx:1,explanation:"שלב 1: זו ההטלה של הגרדיאנט על הכיוון. שלב 2: המקסימום כש־u מקביל ל־∇f. שלב 3: חייבים לנרמל את u; בלי נרמול מקבלים כפולה, לא את הקצב ליחידת אורך."},
    {topic:"multivar",difficulty:3,question:"בכופלי לגראנז' ל־f תחת g=c, כמה משוואות יש ב־R²?",options:["1","2","3: שתי רכיבי ∇f=λ∇g ואילוץ g=c","אינסוף"],answerIdx:2,explanation:"שלב 1: שני משתנים + λ — שלושה נעלמים. שלב 2: ∇f=λ∇g נותן שתי משוואות, ועוד האילוץ. שלב 3: בלי האילוץ מקבלים את כל קווי הגובה, לא את הנקודה על g=c."},
    {topic:"complex",difficulty:2,question:"מהו |3−4i|?",options:["7","1","5","−5"],answerIdx:2,explanation:"שלב 1: |a+bi|=√(a²+b²). שלב 2: 9+16=25. שלב 3: √25=5. המודול תמיד אי-שלילי — לא ‎-5."},
    {topic:"complex",difficulty:3,question:"ארגומנט ראשי של ‎-1 הוא",options:["0","π","π/2","−π/2"],answerIdx:1,explanation:"שלב 1: ‎-1 יושב על הציר השלילי. שלב 2: הענף הראשי Arg ∈ (−π,π]. שלב 3: זווית π (או 180°). 0 שייך ל־+1."},
    {topic:"complex",difficulty:2,question:"איך מחלקים z/w?",options:["הופכים את הסדר","כופלים בצמוד המכנה ומחלקים ב־|w|²","מחברים מודולים","רק בצורה פולרית אי אפשר"],answerIdx:1,explanation:"שלב 1: (z · w̄) / (w · w̄). שלב 2: המכנה נעשה ממשי |w|². שלב 3: בפ Polar פשוט מחלקים רדיוסים ומחסרים זוויות — שתי דרכים שקולות."},
    {topic:"complex",difficulty:3,question:"לפי אוילר, e^{iπ} + 1 שווה",options:["2","i","0","−1"],answerIdx:2,explanation:"שלב 1: e^{iθ}=cos θ + i sin θ. שלב 2: θ=π → ‎-1 + i·0. שלב 3: ‎-1+1=0. זו הזהות, לא קירוב."}
  ]);
  HEDVA_MCQ.forEach(function (q, i) { q.id = 2000 + i; });

  const PY_QUIZ_NAMES = {
    loops: "לולאות",
    functions: "פונקציות",
    strings: "מחרוזות",
    lists: "רשימות",
    conditions: "תנאים",
    recursion: "רקורסיה"
  };
  const PY_EXAM_NAMES = Object.assign({ dictionaries: "מילונים" }, PY_QUIZ_NAMES);

  const COURSES = {
    python: {
      id: "python",
      title: "פייתון 10016",
      note: "בלוקי המועד (כתיבת קוד): רקורסיה, מחרוזות, רשימות, מילונים. הבוחן האמריקאי בודק גם לולאות, פונקציות ותנאים — בלי מילונים.",
      quizTopics: PY_QUIZ_NAMES,
      labelTopics: PY_EXAM_NAMES,
      questions: PYTHON_MCQ,
      examBlocks: PYTHON_EXAM_BLOCKS,
      examItems: PYTHON_EXAM_ITEMS,
      hasExam: true
    },
    arch: {
      id: "arch",
      title: "ארגון המחשב 10145",
      note: "מועד יחיד 18.8.2026. 55–60% מהמבחן הוא datapath, pipeline ומטמון — שאלה 11 לבדה 44 נקודות, ולכן רוב המאגר שם.",
      quizTopics: ARCH_NAMES,
      labelTopics: ARCH_NAMES,
      questions: ARCH_MCQ,
      examBlocks: [],
      examItems: [],
      hasExam: false
    },
    hedva1: {
      id: "hedva1",
      title: "חדו״א 1 · 90901",
      note: "גבולות ורציפות, כללי גזירה, חקירת פונקציה ואינטגרלים — המהלכים המכניים שנושאים נקודות, לא הוכחות. תאריך המועד לפי מערכת אפקה, לא כאן.",
      quizTopics: H1_NAMES,
      labelTopics: H1_NAMES,
      questions: HEDVA_MCQ.filter(function (q) { return Object.prototype.hasOwnProperty.call(H1_NAMES, q.topic); }),
      examBlocks: [],
      examItems: [],
      hasExam: false
    },
    hedva2: {
      id: "hedva2",
      title: "חדו״א 2 · 90902",
      note: "אינטגרלים לא אמיתיים, טורים והתכנסות, פונקציות רב-משתניות ומספרים מרוכבים. תאריך המועד לפי מערכת אפקה, לא כאן.",
      quizTopics: H2_NAMES,
      labelTopics: H2_NAMES,
      questions: HEDVA_MCQ.filter(function (q) { return Object.prototype.hasOwnProperty.call(H2_NAMES, q.topic); }),
      examBlocks: [],
      examItems: [],
      hasExam: false
    }
  };

  function getCourse(id) {
    return COURSES[id] || COURSES.python;
  }

  return {
    COURSES: COURSES,
    getCourse: getCourse,
    PYTHON_MCQ: PYTHON_MCQ,
    PYTHON_EXAM_BLOCKS: PYTHON_EXAM_BLOCKS,
    PYTHON_EXAM_ITEMS: PYTHON_EXAM_ITEMS
  };
});
