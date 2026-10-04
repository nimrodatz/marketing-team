---
client: baimbetov
kind: site-request
from: שיווק
to: פרויקט האתר (C:\my projects\baimbetov)
date: 2026-10-04
status: ממתין לביצוע
related: network-outreach run 1
---

# בקשה לאתר: תמונת שיתוף אמיתית, וארבעה קישורים קצרים

**למה עכשיו:** הקמפיין `network-outreach` (הודעות וואטסאפ אישיות של נימרוד ויהודה) שולח קישור לדף הבית.
וואטסאפ מציג מתחת לקישור כרטיס עם התמונה, הכותרת והתיאור מתגיות ה-`og` של דף הבית. **ההודעות לא יוצאות
עד ששני השינויים באוויר.**

## 1. תמונת השיתוף של דף הבית

**הבעיה:** `og:image`, `twitter:image` וה-`image` ב-JSON-LD מצביעים היום על `assets/images/hero_image.png`.
זו תמונה שנוצרה במחשב (פנים של בית מול יער אורנים), והיא לא עבודה של באים בטוב. לפי `client.md` §4.6
בתיק הלקוח, תמונה מיוצרת לא מוצגת כעבודה שלנו.

**הבקשה:**
1. ליצור מ-`assets/hero_slides/slide2.jpg` (פרגולות עץ במרפסת ובחזית של בית חדש) קובץ חדש, **1200×630**,
   למשל `assets/images/og-home.jpg`. **החיתוך:** רצועה רוחבית מהחלק העליון של התמונה, כך שהפרגולה העליונה
   מול השמיים במרכז, ושום קורה לא נחתכת בקצוות. נימרוד בחר את התמונה ב-2026-10-04.
2. להחליף את שלוש ההפניות ל-`hero_image.png` בתגיות של דף הבית: `og:image`, `twitter:image`, וה-`image` ב-JSON-LD.
3. מומלץ להוסיף `og:image:width` 1200 ו-`og:image:height` 630.
4. **לא לגעת** בכותרת ובתיאור של `og` במסגרת הבקשה הזו.

## 2. ארבעה קישורים קצרים

ב-`_redirects` של Cloudflare Pages, הפניה **302** לדף הבית עם התגיות:

```
/n   /?utm_source=nimrod-dm&utm_medium=whatsapp&utm_campaign=network-outreach-run1        302
/y   /?utm_source=yehuda-dm&utm_medium=whatsapp&utm_campaign=network-outreach-run1        302
/nr  /?utm_source=nimrod-referral&utm_medium=whatsapp&utm_campaign=network-outreach-run1  302
/yr  /?utm_source=yehuda-referral&utm_medium=whatsapp&utm_campaign=network-outreach-run1  302
```

- **302 ולא 301:** כך אפשר לשנות את היעד בקמפיין הבא בלי שהדפדפנים זוכרים את הישן.
- **הטופס:** הוא כבר שומר את ה-`utm` מהכתובת (`functions/api/lead.js`). צריך לוודא שהתגיות שורדות את
  ההפניה, ושליד בדיקה מגיע לאיירטייבל עם `utm_source` נכון. אחר כך מוחקים את ליד הבדיקה.

## 3. בדיקה לפני שההודעות יוצאות

1. `https://baimbetov.me/n` נפתח בדף הבית, והכתובת בשורת הכתובות נושאת את התגיות.
2. **הכרטיס בוואטסאפ:** לשלוח לעצמך את `baimbetov.me/n` ולראות את הפרגולה בכרטיס. אם עדיין מופיעה
   התמונה הישנה, לבדוק ב-Facebook Sharing Debugger שהתגית החדשה נקראת.
3. לדווח לשיווק שהשינויים באוויר. אחרי זה ההודעות יוצאות.
