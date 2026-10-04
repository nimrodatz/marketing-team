---
tags:
  - archive
---

# multi-client-engine: older Session Log entries

Moved here on 2026-10-04 under the archive rule in `obsidian-vault-workflow` (files over 25,000 characters keep their last 5 entries). Overview, Open Questions and the recent entries: [[multi-client-engine]].

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

### 2026-09-28 · בדיקת הרגרסיה חזרה בסשן חדש ועברה [shipped]

- **What was done:** שתי הרצות יבשות של הקופירייטרית עם run 99 פיקטיבי. **(1)** על [[peer-warm-group]] עם `client: craft-system`. **(2)** על עותק זמני בלי השורה `client`, בתיקיית ה-scratchpad. העותק נמחק בסוף. שום קובץ לא נכתב, ו-`git status` נקי.
- **Decisions:** **הרגרסיה עברה.** התמלילים של שני הסוכנים נבדקו ישירות, ולא רק הדיווח שלהם. באף הרצה לא היה Read או Glob על `.claude/`, ולא היו Write או Edit. **הרצה 1** קראה את הבריף, את [[house-standards]], את `client.md`, את `site-copy.md`, את [[voice-and-tone]], את [[icp-construction]], את [[crafts]] ואת `playbook.md`. זו אותה קבוצה כמו בסשן הקודם. היא בחרה `world` = `בנייה כללי` כברירת מחדל מהמניפסט, ודיווחה שהבריף לא נקב בקראפט. את הזוויות היא לקחה מהבריף במפה v2 (זה אני, התקרה, ההפניה) ולא מה-playbook. מחירים אסורים לפי §3 של הבריף. **הרצה 2** קראה קובץ אחד, הבריף, ועצרה ושאלה. היא ציטטה את §1 בהגדרה החדשה, "בריף בלי `client`: עצרי, דווחי, שאלי", ולא את [[house-standards]], שאותו לא פתחה בכלל. היא גם זיהתה את הרמזים ל-C&S בבריף וסירבה להסיק מהם לקוח.
- **Notes / Caveats:** **ממצא אחד על המנוע:** תפקיד `facts` של C&S מצביע לתוך [[voice-and-tone]] §8, ולכן `voice` נקרא לפני `icp`. זה נכנס ל-Open Questions. ממצאים על הבריף: מפת הזוויות v1 ב-§4 מול v2 ב-[[copy-refinement-peer-warm-group]], שורת "`<N>` = 2" מיושנת, ודרישות שאין להן מקום בשלד (שני נוסחים, מחרוזות UI, שני גופים דקדוקיים). הסוכנת קראה את פתק ה-copy-refinement כי הבריף מגדיר אותו קלט חובה, אף שהוא לא בטבלת הקריאה שלה.
- **Related:** [[house-standards]], [[peer-warm-group]], [[copy-refinement-peer-warm-group]], [[voice-and-tone]], [[crafts]], [[agent-copywriter]]

