# מצב ה-SEO של baimbetov.me ובדיקות מקומיות, 2026-10-15

**מקור:** הריפו של האתר (קריאה בלבד), האתר החי (WebFetch), WebSearch, ומסמך מדיניות הספאם של גוגל
**נאסף:** 2026-10-15 · **לוג:** `research-log.md`

## נקודות מרכזיות

**האתר החי תואם לריפו.** `sitemap.xml` החי כולל 7 כתובות: `/`, `/pergola/`, `/articles/`, `/articles/pergola-permit/`, ושלושה דפים משפטיים.
דף הבית החי: כותרת "תכנון ובניית פרגולות, גלריות, דקים ומבני עץ | באים בטוב", h1 "מתכננים ובונים פרגולות, גלריות ודקים מעץ".
התפריט בדף הבית מוביל לעוגנים (`#pergolas`, `#galleries`, `#decks`, `#wood-structures`, `#works`), ו-`/articles/` לדף אמיתי.

**כתובת שלא קיימת מחזירה עכשיו HTTP 404** (ב-2026-09-30 היא החזירה את דף הבית). `404.html` קיים בריפו עם `noindex`.

**ממצאים מהקוד (חיפוש בריפו):**
- אין אף קישור פנימי אל `/pergola/`: לא מדף הבית, לא מהמאמר, לא מהתפריט והפוטר. הוא כן במפת האתר.
- ל-`/pergola/` אין נתונים מובנים. יש לו canonical לעצמו.
- מאמר ההיתר: `Article` עם `datePublished` ו-`dateModified` 2026-10-06, `author` ו-`publisher` מסוג `Organization`, canonical לעצמו. הקישורים הפנימיים בגוף שלו הם עוגני התפריט ו-`/#process` בלבד, בלי קישור לדף שירות.
- דף הבית: `HomeAndConstructionBusiness` בלי כתובת רחוב (נכון, הכתובת מוסתרת), `areaServed` עם 7 אזורים, `knowsAbout` בלי "ניהול פרויקטים". `FAQPage` עם 7 שאלות עדיין בקוד.
- תמונות: JPG ברוחב 600 עם `width`, `height`, `alt` תיאורי ו-`loading="lazy"` מתחת לקפל, בתוך ה-HTML ולא ב-JavaScript. תמונת ה-Hero בלי lazy.
- אין `consent`, `gtag` או `G-4RW3W69MWD` באף קובץ בריפו הנוכחי. GA4 לא חי.

**לא מדיד:**
- `site:baimbetov.me` דרך כלי החיפוש של הסוכן לא החזיר אף דף מהאתר. **הכלי אינו גוגל ולא מוכיח שהאתר לא באינדקס.** אינדקס נבדק רק ב-Search Console.
- PageSpeed Insights API החזיר 429 (חריגה ממכסה בלי מפתח). אין מדידת מהירות. נימרוד מריץ ידנית בדפדפן.

## חיפושים מקומיים (תוצאות בלבד, לא נקראו דפים, חיפוש מארה"ב)

- `בניית פרגולות עץ בחדרה`: לא הופיע אף עסק מחדרה. הופיעו דפי עיר של pro.co.il (`/pergolas/<עיר>`), פורטל מידרג וכתבות חדשות.
- `פרגולות עץ נתניה שרון בונה פרגולות`: הופיעו דפי עיר של d.co.il (דפי זהב, קטגוריה `c40480`, דף לכל עיר ולכל אזור), ורישום ב-b144 של עסק מהשרון עם ביקורת אחת.
- **משמעות:** בחיפושי עיר, מי שמדורג הם אינדקסים עם דף לכל עיר. אין הוכחה שעסק יחיד עם דפי עיר מנצח אותם. **הערכה בלבד** (חיפוש מארה"ב, תוצאות בלבד).
- אינדקסים ישראליים שעולים בחיפוש עם קטגוריית פרגולות: d.co.il (zap דפי זהב), pro.co.il, b144, מידרג. **תנאי הרישום והעלות לא נקראו.** לפי ויקיפדיה העברית (משני), רישום שורה בסיסית בדפי זהב ניתן חינם.

## מקור ראשוני: מדיניות הספאם של גוגל

[Google, Spam policies](https://developers.google.com/search/docs/essentials/spam-policies), נקרא ב-2026-10-15.

**Doorway abuse:** "sites or pages created to rank for specific, similar search queries". בין הדוגמאות: "multiple domain names or pages targeted at specific regions or cities that funnel users to one page", ו-"substantially similar pages that are closer to search results than a clearly defined, browseable hierarchy".

**קישורים:** אסורים "exchanging money for links", "exchanging goods or services for links", ו-"excessive link exchanges" ודפי שותפים שנועדו לקישור הדדי בלבד.

## מה זה אומר ללקוח

פרשנות: דפי עיר שמוחלף בהם רק שם העיר הם הדוגמה שגוגל מציין. מתחרה אחד (עץ ופלא) מחזיק דף אזור אחד למרכז, ולא דף לכל עיר. אין לבאים בטוב כרגע עבודות מתועדות לפי עיר ב-`facts.md`, ולכן אין תוכן אמיתי לדף עיר.
