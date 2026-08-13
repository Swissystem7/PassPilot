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
  PYTHON_MCQ.forEach(function (q, i) { if (q.id == null) q.id = i + 1; });

  const PYTHON_EXAM_BLOCKS = [{number:1,topic:"recursion",title:"שאלה 1 - רקורסיה",emphasis:"תנאי עצירה, צעד רקורסיבי ומחסנית קריאות"},{number:2,topic:"strings",title:"שאלה 2 - מחרוזות",emphasis:"כל פעולות המחרוזת: חיתוך, חיפוש, פיצול והחלפה"},{number:3,topic:"lists",title:"שאלה 3 - רשימות",emphasis:"מעבר, שינוי, חיתוך, מיון ו-list comprehensions"},{number:4,topic:"dictionaries",title:"שאלה 4 - מבני נתונים - מילונים",emphasis:"יצירה, עדכון, items וספירת מופעים"}];
  const PYTHON_EXAM_ITEMS = [

{topic:"recursion",prompt:"כתבו פונקציה רקורסיבית sum_digits(n) שמחזירה את סכום הספרות.",referenceSolution:"def sum_digits(n):\n    if n < 10:\n        return n\n    return n % 10 + sum_digits(n // 10)",explanation:"תנאי העצירה הוא מספר חד-ספרתי."},{topic:"recursion",prompt:"כתבו count_char(s, ch) רקורסיבית שסופרת מופעים.",referenceSolution:"def count_char(s, ch):\n    if s == '':\n        return 0\n    return (1 if s[0] == ch else 0) + count_char(s[1:], ch)",explanation:"מטפלים בתו הראשון וממשיכים עם השאר."},{topic:"recursion",prompt:"כתבו is_palindrome(s) רקורסיבית.",referenceSolution:"def is_palindrome(s):\n    if len(s) <= 1:\n        return True\n    return s[0] == s[-1] and is_palindrome(s[1:-1])",explanation:"משווים קצוות וממשיכים פנימה."},
{topic:"strings",prompt:"כתבו normalize_words(s): אותיות קטנות ורווח יחיד בין מילים.",referenceSolution:"def normalize_words(s):\n    return ' '.join(s.strip().lower().split())",explanation:"split מכווץ רווחים ו-join מחבר."},{topic:"strings",prompt:"כתבו initials(name) שמחזירה ראשי תיבות גדולים.",referenceSolution:"def initials(name):\n    return ''.join(word[0].upper() for word in name.split() if word)",explanation:"מחברים את האות הראשונה מכל מילה."},{topic:"strings",prompt:"כתבו longest_word(text); בשוויון החזירו את הראשונה.",referenceSolution:"def longest_word(text):\n    words = text.split()\n    return max(words, key=len) if words else ''",explanation:"max עם key=len שומר את הראשונה בשוויון."},
{topic:"lists",prompt:"כתבו unique_in_order(items), ללא כפילויות ובסדר המקורי.",referenceSolution:"def unique_in_order(items):\n    result = []\n    for item in items:\n        if item not in result:\n            result.append(item)\n    return result",explanation:"מוסיפים רק איבר שטרם הופיע."},{topic:"lists",prompt:"כתבו rotate_left(items, k) ללא שינוי הרשימה המקורית.",referenceSolution:"def rotate_left(items, k):\n    if not items:\n        return []\n    k %= len(items)\n    return items[k:] + items[:k]",explanation:"מודולו ושני חיתוכים."},{topic:"lists",prompt:"כתבו flatten(matrix) שמחזירה רשימה שטוחה.",referenceSolution:"def flatten(matrix):\n    return [item for row in matrix for item in row]",explanation:"עוברים על שורות ואז על איברים."},
{topic:"dictionaries",prompt:"כתבו char_frequency(s) שמחזירה מילון שכיחויות.",referenceSolution:"def char_frequency(s):\n    counts = {}\n    for ch in s:\n        counts[ch] = counts.get(ch, 0) + 1\n    return counts",explanation:"get מספק אפס למפתח חדש."},{topic:"dictionaries",prompt:"כתבו invert_unique(d); הניחו שהערכים ייחודיים.",referenceSolution:"def invert_unique(d):\n    return {value: key for key, value in d.items()}",explanation:"מחליפים מפתח וערך בכל זוג."},{topic:"dictionaries",prompt:"כתבו group_by_length(words) שמקבצת מילים לפי אורך.",referenceSolution:"def group_by_length(words):\n    groups = {}\n    for word in words:\n        groups.setdefault(len(word), []).append(word)\n    return groups",explanation:"setdefault יוצר רשימה לכל אורך."}
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
      note: "",
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
      note: "מבחן 18.8, מועד יחיד. 55-60% מהמבחן הוא datapath, pipeline ומטמון — שאלה 11 לבדה 44 נקודות, ולכן רוב המאגר שם.",
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
      note: "מועד ב' 5.8. גבולות ורציפות, כללי גזירה, חקירת פונקציה ואינטגרלים — המהלכים המכניים שנושאים את רוב הנקודות, לא הוכחות.",
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
      note: "מועד ב' 5.8. אינטגרלים לא אמיתיים, טורים והתכנסות, פונקציות רב-משתניות ומספרים מרוכבים.",
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
