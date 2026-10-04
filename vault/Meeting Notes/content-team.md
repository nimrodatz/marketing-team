---
tags:
  - agents
  - content
status: built, not run in the agency
---

# צוות התוכן בתוך הסוכנות

## Overview

**עד 2026-10-04 צוות התוכן היה פרויקט נפרד**, `claude prog\the5agents`, עם `CLAUDE.md`, כספת ותיקי לקוחות
משלו. מאותו יום הוא שלושה סוכנים בסוכנות, שקוראים את אותו תיק לקוח כמו שאר הצוותים:

| סוכן | מה | מקור |
|---|---|---|
| `content-writer` | מאמרים, פוסטים, קרוסלות, רילס, הסבת מאמר לפוסטים | הסקיל `content-writer`. **מצב "דף אתר" בוטל** |
| `seo` | מפת מילים, ניתוח תוצאות חיפוש, בריף SEO, בדיקה לפני פרסום, מעקב | הסקיל `seo`, ועוד מצב ה-serp של סוכן המחקר |
| `researcher` | מקורות למאמר (כולל נוסח מילולי של חוק), מחקר עסק ומתחרים | הסוכן `researcher`, בלי מצב serp |

**`image-designer` בוטל** והפך למצב `content` ב-`creative` (§7א). **`client-onboarding` נבלע ב-`/new-client`**:
מודול השירותים, השאלון, והלקח "לקוח שמגיע עם משימה: שני סבבים". **`gpt-image-gen` ו-`obsidian-*`** כבר קיימים כאן.

**שלוש הכרעות בהעברה:**

1. **לא העתקה אלא כתיבה מחדש בפורמט הסוכנות:** קריאה לפי מניפסט, שלב אפס, `run<N>`, איסור המקף הארוך
   (בצוות התוכן הוא היה רק "לא יותר מפעם-פעמיים בפסקה"), ודיווח עם נתיב מלא.
2. **ה-serp עבר מ-`researcher` ל-`seo`**, כי סוכן לא יכול להפעיל סוכן. בצוות התוכן הסקיל `seo` רץ בשיחה
   הראשית והפעיל את סוכן המחקר. כאן `seo` הוא סוכן בעצמו, עם `WebSearch` ו-`WebFetch`.
3. **בעלות אחת לכל דף:** טקסט של דף אתר, כולל title ו-meta, של `copywriter`. `seo` ממליץ. זו הטבלה
   מ-[[team-handoffs]], שנדחתה כמנגנון של תיבת בקשות ונכנסה עכשיו ככלל.

**תיקיית ריצת תוכן:** `output/<client>/content/<date>-<topic>-run<N>/`, עם `brief.md`, `article.md`,
`article.html` או `social.md`, `seo-review.md`, `sources/` ו-`images/`. **מחקר כללי** ב-`clients/<client>/research/`,
עם לוג אחד שמשותף ל-`strategist`, ל-`seo` ול-`researcher`.

**`the5agents` עצמו** גובה ב-2026-10-04 (`claude prog\_backups\`, bundle של גיט וארכיון קבצים בלי `.env`)
ונשאר על הדיסק לקריאה בלבד. נמחק רק באישור.

## Open Questions

- **אף אחד משלושת הסוכנים לא רץ בסוכנות.** ריצה ראשונה מוצעת: `seo` במצב review על מאמר ההיתר שכבר קיים.
- **ארבעת מבחני התחביר כתובים לעברית.** לדיאנה (סלובקית) לא הוכרע מה חל.
- **11 הפתקים בכספת של `the5agents` לא הועברו.** רק מה שמחזיק החלטה פעילה נכנס לפתק הזה. הם נשארים בגיבוי.
- **`clients/demo/` לא הועבר**, בכוונה.

## Session Log

### 2026-10-04 · הצוות עבר לסוכנות [planned]

- **What was done:** נכתבו `content-writer.md`, `seo.md` ו-`researcher.md` ב-`.claude/agents/`. נוסף מצב `content` ל-`creative.md`. `/new-client` קיבל את מודול השירותים, והשאלון ותבנית מפת המילים עברו ל-`clients/_template/`. `/new-campaign` קיבל `kind: article | social`. מבאים בטוב הועתקו מאמר ההיתר (ל-`output/baimbetov/content/`), מפת המילים, שלושה קבצי מחקר והלוג. דיאנה נפתחה כ-`clients/telavivian/` בטיוטה.
- **Decisions:** שלוש ההכרעות ב-Overview.
- **Notes / Caveats:** הקבצים שהועתקו מצוות התוכן הועתקו כמו שהם, **כולל מקפים ארוכים**. הם קבצי מקור, לא תוצר; הסוכן שיערוך אותם ינקה.
- **Related:** [[agency-hierarchy]], [[team-handoffs]], [[agent-strategist]], [[agent-creative]], [[multi-client-engine]]
