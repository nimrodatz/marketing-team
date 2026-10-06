# Meeting Notes: Index

Code, architecture, design decisions, bugfixes and refactors. One file per topic, each with a persistent Overview and a dated Session Log.

**Grouped by client** (since 2026-10-04). A new topic goes under the section of the client it serves; a topic that serves every client goes under "המנוע". A client without topics yet gets its section when its first topic is written. The client's own facts and decisions live in `clients/<slug>/`, not here.

## המנוע: הסוכנות עצמה

**מבנה וזיכרון**

- [[agency-hierarchy]], ההיררכיה של הסוכנות: דלת אחת, תיק לקוח אחד, ארבעה צוותים, ומפת המעבר של `CLAUDE.md` המקוצר
- [[multi-client-engine]], המנוע כסוכנות: שכבות מנוע, לקוח וריצה, תיקי לקוח ב-`clients/`, ומצב הביצוע
- [[multi-domain-expansion]], הרחבה לתחומים נוספים: למה אין צורך בצוותים חדשים, ושלושת הדברים שכבולים לבנייה
- [[marketing-engine-prd]], מסמך הגג של Craft & System Marketing Engine: ICP, פרוסה אנכית ראשונה, מפת שלבים והגדרות "בוצע"
- [[repo-structure]], every top-level folder and config file in the repo, what it is for and what belongs in it
- [[site-repo-integration]], הגבול בין ריפו האתר למנוע השיווק: ריפו נפרד, וולט משותף, תלות חד סטרית, ומה יש בקוד האתר בפועל
- [[obsidian-skills-setup]], the three Obsidian skills installed in `.claude/skills/`: what each does, when it loads, who owns it
- [[copy-corrections]], יומן העריכות של נימרוד והנימוקים שלהן: ההפרדה בין תיקון מכני לכיול אנושי, ולמה נימוק שווה יותר מתיקון

**הצוותים והסוכנים**

- [[agent-roster]], מפת צוות הסוכנים: מי קיים, מי מתוכנן, ומה הקלט והפלט של כל אחד
- [[agent-ceo-orchestration]], אפיון סוכן המנכ"ל: טון, סמכויות, איסורים מוחלטים, נקודות עצירה ושרשרת התזמור הליניארית
- [[agent-strategist]], סוכן האסטרטגיה לפני הבריף: מחקר רשת, המלצה על ערוץ ותקציב בטווח, ושלוש ההכרעות שקבעו אותו
- [[agent-copywriter]], אפיון סוכנת הקופי: בידוד כלים, סדר קריאת מסמכי היסוד, שלוש הזוויות ופורמט הפלט
- [[agent-campaigner]], אפיון סוכן ה-Outbound: מיפוי זווית→רכיב, חמשת רכיבי ערכת השטח וארבע ההתנגדויות
- [[agent-creative]], אפיון סוכן הוויז'ואל: שער העלות, שני חוקי הברזל (gpt-image-2 ו-Zero-Text), מיפוי זווית→ויזואל וזוג הפלט
- [[agent-landing]], אפיון סוכן דפי הנחיתה: בידוד ללא רשת, Mobile-First כאילוץ ICP, שני ערוצי ההמרה, חריג ה-CDN וכלל האריזה העצמאית
- [[content-team]], צוות התוכן עבר מ-`the5agents` לסוכנות: שלושה סוכנים, מה בוטל ומה נבלע
- [[agent-site-builder]], סוכן הבנייה: כותב קוד בריפו האתר של הלקוח, לא כותב טקסט, לא עושה קומיט
- [[team-handoffs]], העברת עבודה בין שיווק, תוכן ובונה. **הוחלף:** תיבת הבקשות לא יושמה; טבלת הבעלות נכנסה ב-[[agency-hierarchy]]

## Craft & System

תיק: `clients/craft-system/`

- [[copy-refinement-peer-warm-group]] · דיוק הקופי של הקבוצה החמה: האבחנה, שמונה ההכרעות, מפת הזוויות v2 וחומר הגלם הביוגרפי של נימרוד
- [[launch-runway]], מסלול ההשקה: מה נשאר עד שליחה בפועל, החוסם היחיד, וההחלטה על הסים
- [[site-mobile-readiness]], האתר במובייל: מה נבדק ויצא תקין, חמשת הליקויים כחוב ידוע, ולמה אין לאתר בעלים בפייפליין

## באים בטוב

תיק: `clients/baimbetov/` · יומן ההחלטות: `clients/baimbetov/decisions.md`

- [[baimbetov-crm]], ה-CRM באיירטייבל: לידים ← הצעות מחיר ← פרויקטים ← תשלומים, האוטומציות ומה פתוח
- [[post-holiday-roadmap]], התכנית אחרי החג: העלאת דף הפרגולות, מודעות לריצה 2, סוכן אסטרטגיה, ותשתית תוכן ו-SEO לבאים בטוב

## Telavivian (דיאנה)

תיק: `clients/telavivian/` · אין עדיין נושאים.
