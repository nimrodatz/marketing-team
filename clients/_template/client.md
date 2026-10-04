---
client: <slug>
name: <שם העסק>
status: טיוטה
audience: <B2B | B2C>
site: <https://... או none>
channels:
  - <outbound | group-post | landing | paid-social | paid-search>
services:              # which teams work on this client. CLAUDE.md stage zero, step 3
  - <marketing | content | site | automation>
repos:
  site: <local path of the client's site repo, or none>
  remote: <github URL, or none>
  deploy: <cloudflare-pages:<project>, or none>   # every push to main goes live
tags:
  - client
---

# תיק לקוח: <שם העסק>

> [!warning] תבנית
> מעתיקים את התיקייה ל-`clients/<slug>/` וממלאים. **סטטוס `טיוטה` עד שנימרוד מאשר.**
> לקוח בטיוטה לא מגיע לשלב 3 (תמונות בתשלום) בלי אישור מפורש. [[house-standards]] §7.
> כל `<placeholder>` שנשאר בקובץ הוא עצירה לסוכן, לא הזמנה להשלים.

## 1. מי הלקוח

<העסק במשפט אחד. מה הוא מוכר, למי, ובאיזה אזור. הערוץ העיקרי עד היום.>

---

## 2. קבצי המותג: מה קוראים, ובאיזה סדר

**[[house-standards]] נקרא תמיד לפני כולם.** לכל סוכן יש סדר קריאה משלו, בהגדרת הסוכן.

| תפקיד | הקובץ | סטטוס |
|---|---|---|
| `facts` | `clients/<slug>/facts.md` | טיוטה |
| `icp` | `clients/<slug>/icp.md` | טיוטה |
| `voice` | `clients/<slug>/voice.md` | טיוטה |
| `world` | `clients/<slug>/world.md` | טיוטה |
| `visual` | `clients/<slug>/visual.md` | טיוטה |
| `playbook` | `clients/<slug>/playbook.md` | טיוטה |

---

## 3. עובדות נעולות, בקצרה

המקור המלא: `facts.md`. **במקרה של סתירה, הוא גובר על הטבלה הזאת.**

| | |
|---|---|
| **מחירים** | <מחירים, או "אין מחירים בתוצר"> |
| **וואטסאפ** | <`https://wa.me/972...`, או none> |
| **הוכחה מותרת** | <קייסים, ביקורות אמיתיות, מספרים מגובים. או "אין"> |
| **מחיר בתוצר** | <רק אם הבריף מתיר. ברירת המחדל: לא> |

---

## 4. קווים אדומים ייחודיים

<מה אסור להבטיח, להגיד או להראות אצל הלקוח הזה. כל שורה עם הסיבה.>

---

## 5. ערוצים ויעדי פריסה

| | |
|---|---|
| **ערוצים פעילים** | <> |
| **ערוצים ממומנים** | <> · `PAUSED` בלבד |
| **דף נחיתה** | <תיקייה ב-`output/<slug>/landing/` או נתיב בריפו של הלקוח> |
| **טופס** | <`/api/lead` מהתבנית, או נקודת קצה שכבר קיימת אצל הלקוח. אם קיימת: לא מעתיקים פונקציה> |
| **CRM** | <> |

---

## 6. בדיקת עובדות מול האתר

`clients/<slug>/facts-check.json`, דרך `pwsh -File scripts/verify-site-facts.ps1 -Client <slug>`.
אין אתר → אין קובץ, והסקריפט מדלג ומדווח.

---

## 7. תמונת ייחוס

<אין עדיין. נקבעת אחרי תמונה ראשונה שנימרוד מאשר.>

---

## Session Log

### YYYY-MM-DD · <title> [wip]

- **What was done:**
- **Decisions:**
- **Related:** [[multi-client-engine]], [[house-standards]]
