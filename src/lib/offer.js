// PassPilot — honest bundle economics for the union add-on.
// Prices are observed market numbers (see MONETIZATION.md). Splits are
// labeled scenarios, not a signed contract.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const CHECKED_AT = "2026-08-13";
  const ADDON_MIN = 20;
  const ADDON_MID = 30;
  const ADDON_MAX = 40;
  const MARATHON_TYPICAL = 270;
  const MARATHON_LOW = 220;

  function observedMarket() {
    return {
      checkedAt: CHECKED_AT,
      afekaMarathonTypical: MARATHON_TYPICAL,
      afekaMarathonLow: MARATHON_LOW,
      alonVideoCourse: 349,
      dannySemester: 329,
      goolSemesterLow: 299,
      goolSemesterHigh: 349,
      tuitionYearIls: 12017,
      creditsFullYear: 40,
      tuitionPerCreditIls: 300.425,
      unionDuesIls: 275,
      unionOtherIncome2024: 384827,
      unionRevenue2024: 1464331,
      note: "מחירי מרתון/וידאו/שכ״ל נצפו במקורות פומביים ב־" + CHECKED_AT + ". אין מחירון GOOL בלי קופון. חלוקת הכנסות עם ספק חיצוני: לא נמצא אחוז פומבי.",
    };
  }

  function clampAddon(n) {
    const v = Math.floor(Number(n));
    if (!(v >= ADDON_MIN && v <= ADDON_MAX)) return ADDON_MID;
    return v;
  }

  function clampSeats(n) {
    const v = Math.floor(Number(n));
    if (!(v > 0)) return 20;
    return Math.min(200, v);
  }

  function round1(n) {
    return Math.round(Number(n) * 10) / 10;
  }

  function ils(n) {
    return Math.round(Number(n) || 0);
  }

  function bundleRow(input) {
    const src = input || {};
    const marathon = Number(src.marathonPrice) > 0 ? Number(src.marathonPrice) : MARATHON_TYPICAL;
    const addon = clampAddon(src.addonPrice);
    const seats = clampSeats(src.seats);
    const ticket = marathon + addon;
    return {
      marathonPrice: marathon,
      addonPrice: addon,
      ticket: ticket,
      seats: seats,
      addonGross: addon * seats,
      ticketGross: ticket * seats,
      marathonGross: marathon * seats,
      addonShareOfTicketPct: round1((addon / ticket) * 100),
      addonShareOfMarathonPct: round1((addon / marathon) * 100),
    };
  }

  function hypotheticalSplits(addonGross) {
    const gross = ils(addonGross);
    const rows = [
      { id: "even", unionPct: 50, vendorPct: 50, label: "חלוקה שווה — תרחיש, לא חוזה" },
      { id: "unionLeads", unionPct: 70, vendorPct: 30, label: "האגודה גובה ב־PayPal ומשלמת לספק — תרחיש" },
      { id: "coupon", unionPct: 0, vendorPct: 100, label: "קופון: הסטודנט משלם לספק — כמו מבצעי GOOL/באומן שנצפו" },
    ];
    return rows.map(function (r) {
      return {
        id: r.id,
        unionPct: r.unionPct,
        vendorPct: r.vendorPct,
        unionIls: ils(gross * r.unionPct / 100),
        vendorIls: ils(gross * r.vendorPct / 100),
        label: r.label,
        hypothetical: true,
      };
    });
  }

  function offerCopy() {
    return {
      title: "תוספת אבחון למרתון אגודה",
      priceLine: "20–40 ₪ מעל כרטיס המרתון (ניסוי מחיר, לא מחירון מאומת)",
      recommended: ADDON_MID,
      whatPaid: [
        "דוח מרחק ממבנה המבחן להדפסה",
        "כרטיס כניסה למרתון + מסלול 55",
        "מצב מרתון מתוזמן וקוד אבחון PP1 למדריך",
        "תדריך כיתה מהדבקת כמה קודים",
      ],
      whatFree: [
        "בוחן קצר עד " + 5 + " שאלות",
        "ציון, נושאים חלשים, ותוכנית ימים בסיסית",
        "מפת מבנה בלי האבחון האישי",
      ],
      notClaimed: [
        "אין משתמשים משלמים היום",
        "אין מדידת שיעור מעבר",
        "אין שרת תשלום — המימוש הוא קוד שהאגודה מפיצה",
        "20–40 ₪ הוא מחיר ניסוי מ־RESEARCH.md, לא סקר קונים",
      ],
    };
  }

  return {
    CHECKED_AT: CHECKED_AT,
    ADDON_MIN: ADDON_MIN,
    ADDON_MID: ADDON_MID,
    ADDON_MAX: ADDON_MAX,
    MARATHON_TYPICAL: MARATHON_TYPICAL,
    MARATHON_LOW: MARATHON_LOW,
    observedMarket: observedMarket,
    clampAddon: clampAddon,
    clampSeats: clampSeats,
    bundleRow: bundleRow,
    hypotheticalSplits: hypotheticalSplits,
    offerCopy: offerCopy,
  };
});
