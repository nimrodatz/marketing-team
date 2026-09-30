# Local Business (LocalBusiness) structured data

**מקור:** [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/local-business)
**תאריך פרסום:** לפי הדף, עודכן 2026-09-08
**נאסף:** 2026-09-30

## נקודות מרכזיות
- חובה: `name` ו-`address`. מומלץ: `telephone`, `url`, `openingHoursSpecification`, `geo`, `aggregateRating`, `review`, `priceRange` ועוד.
- גוגל לא מבטיח שתכונה שצורכת נתונים מובנים תופיע בתוצאות. הדף לא אומר שהסימון משפיע על הדירוג.
- **אין בדף הנחיה לעסק שירות בלי כתובת מוצגת.**
- חל על הסימון Search Essentials וההנחיות הכלליות לנתונים מובנים.

## מה זה אומר ללקוח
פרשנות: בדף הבית כבר יש `HomeAndConstructionBusiness` עם שם, טלפון, שעות, אזור שירות וקישור לפרופיל, ו-`address` עם אזור ומדינה בלבד. לעסק שהכתובת שלו מוסתרת בפרופיל, **לא מוסיפים כתובת רחוב** רק כדי לעמוד בדרישה. `aggregateRating` ו-`review` לא נכנסים עד שביקורות עוברות דרך `facts.md` (`client.md` §4.8).
