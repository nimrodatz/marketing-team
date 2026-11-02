# לוגו כותר, הקבצים הסופיים

הקבצים כאן נוצרים ב-`logo-v6/export-web.js`. אל תערכו אותם ידנית: תיקון נעשה במקור ואז מריצים שוב.

**השם "כותר" עולה לאוויר רק ביום ההשקה, 2026-11-17.** עד אז כל מה שבאוויר נושא את השם "באים בטוב".

## איזה קובץ לאיזה מקום

| שימוש | קובץ | הערה |
|---|---|---|
| **תמונות, הדמיות, חולצות, דפוס גדול** | `png/logo-stack-black-3000.png`, `png/logo-stack-white-3000.png` | הלוגו העומד. בית דפוס: `logo-stack-black.svg` |
| **אתר, דף נחיתה, חשבונית, הצעת מחיר** | `logo-row-black.svg`, `logo-row-white.svg` | הלוגו האופקי. ברוחב 240 פיקסלים ומעלה |
| **הדר של אתר ודף נחיתה, במחשב** | `logo-header-black.svg`, `logo-header-white.svg` | המשפט משמאל לשם. בגובה 64 פיקסלים |
| **הדר בטלפון** | `logo-header-phone-black.svg`, `logo-header-phone-white.svg` | המשפט מתחת לשם. בגובה 72 עד 80 פיקסלים |
| **מקום קטן מאוד** | `logo-row-small-black.svg`, `logo-row-small-white.svg` | בלי המשפט, כשאין מקום שהוא ייקרא בו |
| **חשבונית בתוכנה שלא מקבלת SVG** | `png/logo-row-black-1600.png` | |
| **לשונית בדפדפן** | `favicon.svg`, `png/favicon-32.png`, `png/apple-touch-icon-180.png` | |
| **תמונת פרופיל ברשתות** | `png/icon-512.png` | |

אם אפשר, משתמשים ב-SVG. הקובץ חד בכל גודל, והאותיות בו כבר קווי מתאר, כך שלא צריך להעלות שום פונט. הרקע של ה-PNG שקוף, חוץ מהאייקונים, שהרקע שלהם לבן.

## קוד להטמעה

הדר של אתר או דף נחיתה, עם החלפה אוטומטית בטלפון:

```html
<a href="/" aria-label="כותר, לדף הבית">
  <picture>
    <source media="(max-width: 480px)" srcset="/assets/logo-header-phone-black.svg" width="94" height="72">
    <img src="/assets/logo-header-black.svg" alt="כותר. תכנון. הנדסה. ביצוע. עץ ומתכת" width="255" height="64">
  </picture>
</a>
```

הלוגו האופקי המלא, למשל בתחתית הדף:

```html
<img src="/assets/logo-row-black.svg" alt="כותר. תכנון. הנדסה. ביצוע. עץ ומתכת" width="320" height="274">
```

אייקונים, בתוך `<head>`:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon-180.png">
```

## מה לא עושים

- לא מותחים את הלוגו. משנים גובה או רוחב בלבד, לא את שניהם.
- לא מקטינים את הלוגו האופקי המלא מתחת ל-240 פיקסלים ברוחב. במקום קטן משתמשים ב-`logo-row-small`.
- על תמונה או הדמיה מניחים את הלוגו בעריכה, כי מודל תמונה או וידאו משבש אותיות.
- לא צובעים אותו בצבע אחר בלי החלטה של נימרוד.
