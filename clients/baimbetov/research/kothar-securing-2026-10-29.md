# אבטחת השם "כותר": סימן מסחר, מחלקות, הפניית דומיין

**נאסף:** 2026-10-29 · **לקוח:** baimbetov · **למה:** תכנית ספרינט המיתוג, `output/baimbetov/strategy/2026-10-29-kothar-sprint-plan.md`
**השלמה ל:** `kothar-name-check-2026-10-26.md`. מה שנבדק שם (דומיינים, שמות משתמש, כללי הפרופיל בגוגל, Search Console) לא נבדק שוב.
**כלל:** ממצא אינו עובדה של הלקוח ולא נכנס ל-`facts`. זה לא ייעוץ משפטי.

---

## 1. פקודת סימני המסחר [נוסח חדש], התשל"ב-1972

**מקור:** [WIPO Lex, Trade Marks Ordinance, English](https://www.wipo.int/wipolex/edocs/lexdocs/laws/en/il/il043en.pdf)
**תאריך פרסום:** נוסח אנגלי מעודכן עד 2010-09-01. **הנוסח המחייב הוא העברי ברשומות**, ויכול להיות שתוקן מאז.
**נאסף:** 2026-10-29

### נקודות מרכזיות
- **ס' 24(א):** כל אדם רשאי להגיש התנגדות לרישום תוך שלושה חודשים מיום הפרסום.
- **ס' 27:** תאריך הרישום הוא התאריך שבו הוגשה הבקשה.
- **ס' 31:** הרישום בתוקף 10 שנים מיום הגשת הבקשה, וניתן לחידוש.
- **ס' 57:** תביעת הפרה רק לבעל סימן רשום או סימן מוכר היטב. סימן לא רשום לא מקנה תביעת הפרה לפי הפקודה.
- **ס' 63:** מי שמציג סימן כרשום כשהוא לא רשום עובר עבירה (קנס, הסכום בנוסח האנגלי בלירות, מיושן).
- **ס' 11(4):** המילה "registered" לא נרשמת כחלק מסימן.

### מה זה אומר ללקוח (פרשנות)
מותר להשתמש בשם "כותר" מהיום, לפני שהסימן נרשם. ההגשה המוקדמת קובעת את התאריך. סימן ® לא מופיע בשום מקום עד שהסימן נרשם בפועל.

---

## 2. כותרות סוגי Nice

**מקור:** [Irish IPO, Class Headings, Nice Classification 10th edition](https://www.ipoi.gov.ie/en/law-practice/legislation/trade-marks/trade-marks-practice-and-procedures/nice-classification-2016-class-headings.pdf)
**תאריך פרסום:** 2016-01-01. **מהדורה ישנה.** הנוסח הנוכחי לא נקרא (עמוד WIPO חזר ריק).
**נאסף:** 2026-10-29

### נקודות מרכזיות
- **37:** Building construction; repair; installation services.
- **42:** Scientific and technological services and research and design relating thereto; ... design and development of computer hardware and software.
- **19:** Building materials (non-metallic); ... non-metallic transportable buildings.
- **6:** ... metal building materials; transportable buildings of metal.
- **40:** Treatment of materials.

### מה זה אומר ללקוח (פרשנות)
העסק מוכר שירות, לא מוצר מדף. הליבה היא 37 (בנייה והתקנה), ו-42 לתכנון ההנדסי. 19 ו-6 הם מוצרים (חומרי בנייה ומבנים מוכנים), ולא מה שהעסק מוכר היום. **שימו לב:** סוג 42 כולל גם תוכנה, וזה המקום שבו "כותר" של מטח (ספרייה מקוונת) עלול להיות רשום. לא נבדק.

---

## 3. אגרת הגשה ברשות הפטנטים

**מקור:** [gov.il, הגשת בקשה לרישום סימן מסחר](https://www.gov.il/he/service/trademark_registration)
**נאסף:** 2026-10-29

### נקודות מרכזיות
- **הדף חזר 403. הסכום לא נקרא.** גם דף "סימן מאשר" חזר 403, וקובץ הכנסת סרוק ולא קריא.
- מסיכום תוצאות חיפוש בלבד (**לא נקרא**): האגרה משולמת לכל סוג בנפרד, דרך מערכת ההגשה המקוונת, ומבקש פרטי בלי מיופה כוח יכול לשלם גם בשירות התשלומים הממשלתי.

### מה זה אומר ללקוח (פרשנות)
הסכום מופיע לנימרוד במסך התשלום של ההגשה המקוונת. אין מספר במסמך.

---

## 4. Cloudflare Pages: דומיין חדש והפניית דומיין ישן

**מקורות:**
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), עודכן 2026-04-21
- [Redirecting *.pages.dev to a custom domain](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/), עודכן 2026-04-21
- [Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/), עודכן 2026-06-26
**נאסף:** 2026-10-29

### נקודות מרכזיות
- דומיין ראשי (בלי www) כדומיין של פרויקט Pages: **חייב להיות zone ב-Cloudflare**, כלומר שרתי השמות מפנים ל-Cloudflare. תת-דומיין מספיק לו CNAME.
- הפניית דומיין שלם מתועדת דרך Bulk Redirects: רשימה עם מקור, יעד, 301, והאפשרויות Preserve query string, Subpath matching, Preserve path suffix, Include subdomains. ואז כלל שמפעיל את הרשימה.
- Bulk Redirects מוגדרים ברמת החשבון. מגבלות לפי מסלול לא נקראו.

### מה זה אומר ללקוח (פרשנות)
kothar.co.il עובר ל-Cloudflare כמו baimbetov.me. ההפניה של baimbetov.me נעשית בלוח הבקרה, בפעולה אחת, ושומרת כל נתיב. אם baimbetov.me מחובר היום כדומיין ראשי לפרויקט, הוא כבר zone ב-Cloudflare (הסקה מהכלל, נימרוד מאשר בלוח הבקרה).

---

## 5. מה לא נבדק או לא נקרא
1. סכום האגרה (403).
2. זמן הבחינה ברשות הפטנטים.
3. האם "כותר" או "Kotar" רשומים כסימן, בכל סוג. המאגר לא נגיש לכלי.
4. שם עסק בוואטסאפ ביזנס **באפליקציה**: דף העזרה הרשמי לא נקרא. המקורות שנמצאו עוסקים ב-API, וסותרים זה את זה.
5. כללי ISOC-IL הנוכחיים לשמות בעברית תחת co.il.
6. איך פונים לתמיכה של Google Business Profile (הנתיב בדף העזרה לא נקרא).
