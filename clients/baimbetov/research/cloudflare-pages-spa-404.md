# Cloudflare Pages: Serving Pages

**מקור:** [Cloudflare Docs](https://developers.cloudflare.com/pages/configuration/serving-pages/)
**תאריך פרסום:** עודכן 2026-04-21
**נאסף:** 2026-09-30

## נקודות מרכזיות
- כשאין קובץ `404.html` בראש הפרויקט, Pages מניח שזה אפליקציית עמוד יחיד, ו"matches all incoming paths to the root (`/`)".
- Pages מפנה `/about/index.html` ל-`/about/`, ו-`/contact.html` ל-`/contact`.

## מה זה אומר ללקוח
פרשנות, עם בדיקה של האתר החי ב-2026-09-30: כתובת שלא קיימת, למשל `baimbetov.me/this-page-does-not-exist-2026/`, מחזירה את דף הבית במקום דף "לא נמצא". מאמר שיימחק או קישור עם שגיאת כתיב יחזירו דף בית, וגוגל עלול לסמן אותם כ-soft 404 ב-Search Console ([Google](https://developers.google.com/search/docs/crawling-indexing/http-network-errors), עודכן 2026-02-04). התיקון: קובץ `404.html`.
