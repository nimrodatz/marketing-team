---
tags:
  - architecture
  - clients
  - scaling
status: wip
---

# מנוע של כמה לקוחות: הסוכנות

## Overview

**המטרה:** שהצוות ישרת את באים בטוב, ומחר כל לקוח חדש, בלי לשכפל סוכנים. ממשיך את [[multi-domain-expansion]].
הסוכנים בנויים לפי תפקיד. החסר היה שכבת **לקוח**: עובדות, קהל, קול, ויזואל, הצעה וערוצים.

**שלוש שכבות:**

| שכבה | מה בה | איפה |
|---|---|---|
| מנוע | סוכנים, סקריפטים, שערים, סטנדרט הכתיבה | `.claude/`, `scripts/`, [[house-standards]] |
| לקוח | מניפסט + קבצי מותג + playbook | `clients/<slug>/` |
| ריצה | בריף, תוצרים, יומן פרסום | `vault/Content Briefs/`, `output/<slug>/`, `vault/Publishing Log/` |

**מפעילים תמיד מתיקיית צוות השיווק**, ולא מריפו של לקוח. כשצריך לפרוס דף לריפו של לקוח
(למשל `C:\my projects\baimbetov`), מוסיפים אותו כתיקייה נוספת לסשן.

## מצב הביצוע

- [x] **שלב 1:** [[house-standards]] נוצר. §3, §6 ו-§9 ב-[[voice-and-tone]] הוחלפו בהפניות. [[crafts]] §2 תוחם ל-C&S.
- [x] **שלב 2:** `clients/craft-system/client.md`, `playbook.md` ו-`facts-check.json`. תבנית ריקה ב-`clients/_template/` (שבעה קבצים).
- [x] **הוקדם משלב 6:** `scripts/verify-site-facts.ps1` מקבל `-Client` (ברירת מחדל `craft-system`) וקורא את `facts-check.json`. בלי קובץ או בלי `siteUrl`: דילוג מוצהר ויציאה 0.
- [x] **שלב 3:** ארבעת הסוכנים קוראים לפי מניפסט. §1 בכל סוכן: שדה `client` מהבריף ← [[house-standards]] ← `clients/<client>/client.md` ← הקבצים לפי תפקיד ← playbook. בריף בלי `client` = עצירה. אפס הופעות של שמות קבצי C&S, מחירים או wa.me בגוף הסוכנים.
- [ ] **בדיקת רגרסיה:** בוצעה בחלקה. **צריך לחזור עליה בסשן חדש**, ראה Session Log.
- [ ] **שלב 4:** הקמפיינר מקבל שדה `channel` (`outbound` / `paid-social` / `paid-search`). בערוצים הממומנים התוצר הוא `…-run<N>-ads-kit.md`: גרסאות מודעה לפי מגבלות התווים של מטא וגוגל, קהלים, מבנה קמפיין, מילות מפתח ומילות שלילה, תקציב, UTM לכל מודעה. `PAUSED` בלבד. להסיר מ-campaigner/creative את "Meta Ads `[deferred]`".
- [ ] **שלב 5:** `.claude/commands/new-client.md` (ראיון ← תיק לקוח בסטטוס `טיוטה`) ו-`.claude/commands/new-campaign.md` (לקוח, ערוץ, הצעה ותקציב ← בריף עם `run<N>`). לקוח בטיוטה לא מגיע לשלב 3 בלי אישור.
- [ ] **שלב 6:** להעביר את `output/{marketing,creatives,landing,kits}` אל `output/craft-system/` עם `git mv`. להוסיף `-Client` ל-`build-review.ps1` (ברירת מחדל: craft-system, נתיבים יחסיים `../output/<client>/…`). לעדכן את נתיב תמונת הייחוס ב-playbook §6 וב-`client.md` §7, ואת נתיבי `output/` בארבעת הסוכנים.
- [ ] **שלב 7:** `CLAUDE.md`: "מנכ"ל הסוכנות", שלב אפס שבו מזהים את הלקוח וקוראים את המניפסט. כל מה שייחודי ל-C&S עובר למניפסט שלה. לעדכן את שלד הבריף (שדות `client` ו-`channel`), את [[multi-domain-expansion]] (השאלה הפתוחה על בחירת ה-ICP נסגרת) ואת קבצי `_index.md`.
- [ ] **שלב 8:** `clients/baimbetov/` בסטטוס `טיוטה`, מתוך הכספת של באים בטוב (`מסרים/מסר מהותי - עבודה.md`, `מסרים/קופי אתר ראשי.md`, `יומן החלטות.md`). הוויזואל לפי `assets/css/style.css` באתר: `--wood #7a5236`, `--wood-light #f3ece2`, `--wood-honey #b8895a`, `--wood-dark #5c3d27`, `--bg-light #f7f6f2`, `--text-main #2b2a27`, Heebo/Assistant. ה-`world`: פרגולות ודקים בחצר פרטית, **וצילום מוצר מוגמר מותר**. הטופס: `/api/lead` שכבר קיים באתר (שדות: name, phone, projectType ∈ פרגולה/דק/מבנה עץ/אחר, city, details, utm, page), ולכן לא מעתיקים פונקציה. הדף: `baimbetov.me/pergola/`. **עצירה לאישור נימרוד.**
- [ ] **אחרי זה:** `/new-campaign` לפרגולות אחרי סוכות.

## Open Questions

- `functions/api/lead.js` באתר של באים בטוב כותב תמיד `מקור: 'אתר'`. לידים מדף הנחיתה יזוהו רק לפי UTM ו"דף מקור". כדאי לקבל `source` מהטופס.
- ה-Ask של באים בטוב: פגישה ומדידה? הצעת מחיר? צריך את ההכרעה של נימרוד לפני ה-playbook.
- מחיר "החל מ-" לפרגולה: עדיין פתוח בכספת של באים בטוב.
- **שלד הבריף** (`vault/Content Briefs/_template-brief.md`) עדיין בלי שדה `client`. נכנס בשלב 7, יחד עם `channel`.
- **"לקוח" בתוך C&S, ביחיד על קייס 3:** פתוח, **ושייך לתיק של C&S ולא למנוע.** עד הכרעה הסוכנים הולכים לפי המחמיר. `clients/craft-system/client.md` §4.6.
- **עוד תוכן של C&S ב-`CLAUDE.md`:** פסקת ה-Tone of voice, שלושת כללי הקופי שמפנים ל-`voice-and-tone`, ארבעת קבצי המותג, הטרהקוטה והמחירים באיסורים המוחלטים. עוברים בשלב 7.
- פתקים היסטוריים (`agent-roster`, `agent-campaigner`, `outbound-construction-turnkey`) עדיין מפנים ל"[[agent-copywriter]] סעיף 4" בשביל טבלת הזוויות, שעברה ל-playbook §1. לא תוקן, כי אלה רשומות של מה שהיה.

## Session Log

### 2026-09-28 · התכנית אושרה, והביצוע התחיל מהסשן הלא נכון [wip]

- **What was done:** התכנית אושרה. בוצעו שלב 1 ותחילת שלב 2 (ראה מצב הביצוע). העבודה נעצרה כשנימרוד שאל אם לא עדיף לעבוד מתיקיית צוות השיווק.
- **Decisions:** **כן. ממשיכים בסשן שנפתח בתיקיית צוות השיווק.** הסשן רץ מריפו של באים בטוב, ולכן לא נטענו בו `CLAUDE.md` של המנוע, הסקילים והסוכנים שב-`.claude/agents/`. בלעדיהם אי אפשר להריץ את בדיקת הרגרסיה, וגם זרימת הכספת לא רצה כמו שצריך.
- **Notes / Caveats:** שום דבר עדיין לא נכנס לקומיט. השינויים עד עכשיו: [[house-standards]] (חדש), [[voice-and-tone]], [[crafts]], `clients/craft-system/client.md` (חדש), והפתק הזה.
- **Related:** [[multi-domain-expansion]], [[house-standards]], [[voice-and-tone]], [[crafts]], [[agent-ceo-orchestration]], [[agent-roster]]

### 2026-09-28 · שלבים 2-3 נסגרו, ובדיקת הרגרסיה חשפה שהסוכנים נטענים בתחילת הסשן [wip]

- **What was done:** נכתבו `clients/craft-system/playbook.md` (שמונה סעיפים, **הועברו** מגוף ארבעת הסוכנים), `facts-check.json`, ו-`clients/_template/` בשבעה קבצים. `verify-site-facts.ps1` קורא עכשיו את ה-JSON, והחזיר 11 מתוך 11, בדיוק כמו לפני השינוי. ארבעת הסוכנים עברו לקריאה לפי מניפסט: שער `client`, [[house-standards]] ראשון, קבצים לפי תפקיד, playbook אחרון. תוקנו גם הפניות שהרגרסיה מצאה: [[icp-construction]] §2 ו-[[crafts]] Overview, ו"צוואר בקבוק" עבר מהקמפיינר ל-[[voice-and-tone]] §5.
- **Decisions:** **תיקון שלב 6 הוקדם**, כי `facts-check.json` בלי סקריפט שקורא אותו היה מקור אמת שני. **הרשימות האסורות לא שוכפלו לסוכנים**, והם מפנים ל-[[house-standards]] §2 ולקובץ ה-`voice`. **כלל הפנייה הראשונה נשאר ב-[[voice-and-tone]] §7**, כי "אני נימרוד" ייחודי ל-C&S. **Glob של קובץ הקופי תוקן** אצל הקמפיינר והקריאייטיב: `*-copy-*.md` לא תאם אף שם קובץ אמיתי, ועכשיו `*-run<N>-copy.md`. לדף הנחיתה נוסף מצב `existing_endpoint`, בשביל לקוח שכבר מחזיק `/api/lead` באתר שלו (באים בטוב).
- **Notes / Caveats:** **הרגרסיה לא נקייה, מסיבה מבנית.** Claude Code טוען את הגדרות הסוכנים בתחילת הסשן, ולכן שתי ההרצות היבשות קיבלו את **הקופירייטרית הישנה**. בהרצה עם `client: craft-system` הסוכנת זיהתה את הפער, קראה את ההגדרה החדשה מהדיסק ופעלה לפיה: היא קראה את [[house-standards]], `client.md`, `site-copy.md`, [[icp-construction]], [[crafts]] (`בנייה כללי`), [[voice-and-tone]] ו-`playbook.md`. זה כל מה שריצה 2 קראה ועוד שלושה קבצים, והזוויות נלקחו מהבריף (v2), לא מה-playbook. בהרצה בלי `client` הסוכנת **עצרה ושאלה**, אבל דרך [[house-standards]] §7.1 שהגיעה אליו מ-[[voice-and-tone]], ולא דרך ההגדרה החדשה. **המסקנה: שתי ההתנהגויות נכונות, אבל רק בסשן חדש אפשר לבדוק שההגדרה עצמה מייצרת אותן.** שום קובץ לא נכתב בהרצות. שום דבר לא נכנס לקומיט.
- **Related:** [[house-standards]], [[voice-and-tone]], [[icp-construction]], [[crafts]], [[peer-warm-group-run-2]], [[agent-copywriter]], [[agent-campaigner]], [[agent-creative]], [[agent-landing]]

### 2026-09-28 · שלוש הכרעות של נימרוד על ממצאי הרגרסיה [shipped]

- **What was done:** נוסף `client: craft-system` ל-frontmatter של שלושת הבריפים: [[outbound-construction-turnkey]], [[peer-intro-groups]], [[peer-warm-group]]. ב-[[voice-and-tone]] §8 הוסר "בנגריה שניהלתי" מהשורה של באים בטוב, ונוסף קאלאאוט שמפריד בין שני העסקים. ב-`CLAUDE.md` האיסור על "לקוח" הוגבל ל-C&S, ונוספה שם אותה הפרדה.
- **Decisions:** **(1)** הבריפים הקיימים נוקבים בלקוח כבר עכשיו, ולא מחכים לשלב 7. **(2)** **באים בטוב אינו הנגריה שנימרוד ניהל.** אלה שני עסקים נפרדים, ומספר הנגריה (30-40% ל-1-5%) לעולם לא מוצמד לבאים בטוב. **(3)** **האיסור על "לקוח" שייך ל-C&S בלבד**, ולא לבאים בטוב כלקוח של המנוע, כי לבאים בטוב יש לקוחות עבר אמיתיים.
- **Notes / Caveats:** הפער בתוך C&S, בין האיסור הגורף ב-`CLAUDE.md` לבין ההיתר ביחיד על קייס 3 ב-[[voice-and-tone]] §8, נשאר פתוח.
- **Related:** [[voice-and-tone]], [[outbound-construction-turnkey]], [[peer-intro-groups]], [[peer-warm-group]], [[house-standards]]

### 2026-09-28 · הבלוק של C&S יצא מ-`CLAUDE.md` [shipped]

- **What was done:** הבלוק על "לקוח", הקייסים, מספר הנגריה וההפרדה בין באים בטוב לנגריה עבר ל-`clients/craft-system/client.md` §4, סעיפים 6-9. ב-`CLAUDE.md` נשארה הפניה אחת.
- **Decisions:** **נימרוד חידד את העיקרון: החלטות נקודתיות נשארות אצל הלקוח.** התיקון הקודם, שהוסיף ל-`CLAUDE.md` "האיסור חל רק על C&S", היה תיקון נכון בשכבה הלא נכונה, והוא הוחלף בהעברה. השאלה על קייס 3 לא חוסמת כלום, וההכרעה בה שייכת לתיק של C&S.
- **Related:** [[voice-and-tone]], [[house-standards]], [[agent-ceo-orchestration]]
