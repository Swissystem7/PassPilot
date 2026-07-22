const questionBank = () => [
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
  ,{ id: 46, topic: "recursion", type: "code", difficulty: 2, prompt: "כתבו פונקציה רקורסיבית sum_digits(n) שמחזירה את סכום הספרות של מספר שלם אי-שלילי.", referenceSolution: "def sum_digits(n):\n    if n < 10:\n        return n\n    return n % 10 + sum_digits(n // 10)", explanation: "תנאי העצירה הוא מספר חד-ספרתי; בכל צעד מפרידים את הספרה האחרונה." }
  ,{ id: 47, topic: "recursion", type: "code", difficulty: 2, prompt: "כתבו פונקציה רקורסיבית count_char(s, ch) שסופרת כמה פעמים ch מופיע במחרוזת s.", referenceSolution: "def count_char(s, ch):\n    if s == '':\n        return 0\n    return (1 if s[0] == ch else 0) + count_char(s[1:], ch)", explanation: "מטפלים בתו הראשון וממשיכים רקורסיבית עם שאר המחרוזת." }
  ,{ id: 48, topic: "recursion", type: "code", difficulty: 3, prompt: "כתבו פונקציה רקורסיבית is_palindrome(s) שמחזירה True אם s פלינדרום.", referenceSolution: "def is_palindrome(s):\n    if len(s) <= 1:\n        return True\n    return s[0] == s[-1] and is_palindrome(s[1:-1])", explanation: "משווים קצוות; אם הם שווים ממשיכים אל תת-המחרוזת הפנימית." }
  ,{ id: 49, topic: "strings", type: "code", difficulty: 2, prompt: "כתבו normalize_words(s) שמסירה רווחים בקצוות, הופכת לאותיות קטנות ומחזירה מילים מופרדות ברווח יחיד.", referenceSolution: "def normalize_words(s):\n    return ' '.join(s.strip().lower().split())", explanation: "split ללא מפריד מכווץ רצפי רווחים; join מחבר ברווח יחיד." }
  ,{ id: 50, topic: "strings", type: "code", difficulty: 2, prompt: "כתבו initials(name) שמחזירה את האות הראשונה מכל מילה בשם, באותיות גדולות וללא רווחים.", referenceSolution: "def initials(name):\n    return ''.join(word[0].upper() for word in name.split() if word)", explanation: "split מפיק את המילים, ו-join מחבר את האות הראשונה של כל אחת." }
  ,{ id: 51, topic: "strings", type: "code", difficulty: 3, prompt: "כתבו longest_word(text) שמחזירה את המילה הארוכה ביותר; במקרה של שוויון החזירו את הראשונה.", referenceSolution: "def longest_word(text):\n    words = text.split()\n    return max(words, key=len) if words else ''", explanation: "max עם key=len שומר את המופע הראשון במקרה של שוויון." }
  ,{ id: 52, topic: "lists", type: "code", difficulty: 2, prompt: "כתבו unique_in_order(items) שמחזירה רשימה ללא כפילויות, תוך שמירת סדר ההופעה הראשון.", referenceSolution: "def unique_in_order(items):\n    result = []\n    for item in items:\n        if item not in result:\n            result.append(item)\n    return result", explanation: "מוסיפים איבר רק אם טרם הופיע ברשימת התוצאה." }
  ,{ id: 53, topic: "lists", type: "code", difficulty: 2, prompt: "כתבו rotate_left(items, k) שמסובבת רשימה k מקומות שמאלה ואינה משנה את הרשימה המקורית.", referenceSolution: "def rotate_left(items, k):\n    if not items:\n        return []\n    k %= len(items)\n    return items[k:] + items[:k]", explanation: "מצמצמים את k בעזרת מודולו ומחברים שני חיתוכים." }
  ,{ id: 54, topic: "lists", type: "code", difficulty: 3, prompt: "כתבו flatten(matrix) שמחזירה רשימה שטוחה מתוך רשימת רשימות.", referenceSolution: "def flatten(matrix):\n    return [item for row in matrix for item in row]", explanation: "ה-list comprehension עובר תחילה על כל שורה ואז על כל איבר בשורה." }
  ,{ id: 55, topic: "dictionaries", type: "code", difficulty: 2, prompt: "כתבו char_frequency(s) שמחזירה מילון ובו מספר המופעים של כל תו.", referenceSolution: "def char_frequency(s):\n    counts = {}\n    for ch in s:\n        counts[ch] = counts.get(ch, 0) + 1\n    return counts", explanation: "get מחזירה 0 למפתח חדש ומאפשרת להגדיל את המונה בבטחה." }
  ,{ id: 56, topic: "dictionaries", type: "code", difficulty: 2, prompt: "כתבו invert_unique(d) שהופכת מפתחות וערכים במילון. הניחו שכל הערכים ייחודיים.", referenceSolution: "def invert_unique(d):\n    return {value: key for key, value in d.items()}", explanation: "עוברים על זוגות items ובונים כל ערך כמפתח חדש." }
  ,{ id: 57, topic: "dictionaries", type: "code", difficulty: 3, prompt: "כתבו group_by_length(words) שמקבצת מילים במילון לפי אורכן, לפי סדר הקלט.", referenceSolution: "def group_by_length(words):\n    groups = {}\n    for word in words:\n        groups.setdefault(len(word), []).append(word)\n    return groups", explanation: "setdefault יוצר רשימה ריקה לכל אורך חדש ואז append מוסיף אליה." }
  ,{ id: 58, topic: "dictionaries", difficulty: 1, question: "מה יודפס?\nd = {'a': 1}\nd['b'] = 2\nprint(len(d))", options: ["1", "2", "3", "שגיאה"], answerIdx: 1, explanation: "ההשמה מוסיפה את המפתח b, ולכן במילון שני זוגות." }
  ,{ id: 59, topic: "dictionaries", difficulty: 2, question: "מה יודפס?\nd = {'x': 4}\nprint(d.get('y', 0))", options: ["None", "4", "0", "שגיאה"], answerIdx: 2, explanation: "המפתח y חסר, ולכן get מחזירה את ערך ברירת המחדל 0." }
];

const mulberry32 = (seed) => {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const pickQuiz = (opts = {}) => {
  const { topics, difficulty, count = 10, seed } = opts;
  if (!Number.isInteger(seed)) throw new TypeError("seed must be an integer");
  if (!Number.isInteger(count) || count < 0) throw new TypeError("count must be a non-negative integer");
  if (topics !== undefined && !Array.isArray(topics)) throw new TypeError("topics must be an array");
  if (difficulty !== undefined && ![1, 2, 3].includes(difficulty)) throw new TypeError("difficulty must be 1, 2, or 3");
  let filtered = questionBank();
  if (topics && topics.length) filtered = filtered.filter((q) => topics.includes(q.topic));
  if (difficulty !== undefined) filtered = filtered.filter((q) => q.difficulty === difficulty);
  const rng = mulberry32(seed);
  const shuffled = [...filtered];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

module.exports = { questionBank, pickQuiz };

