---
client: baimbetov
topic: homepage-signing-fix
run: 1
tags:
  - publishing-log
  - baimbetov
---

# homepage-signing-fix, ריצה 1: בלי חתימה בדף הבית

## Overview

שלב 1 בלבד, `scope: edit`. שלוש מחרוזות בדף הבית (שלב 02, meta, נתונים מובנים), כולן מנוסח שכבר אושר. **אין נוסח חדש לאישור.**

**התוצר:** `output/baimbetov/marketing/2026-10-04-homepage-signing-fix-run1-copy.md`. **לבונה:** `output/baimbetov/site/2026-10-04-site-phase1-homepage-strings.md`, שמאחד אותו עם גוש התיאורים של [[homepage-description-run-1]], שלא הוחל באתר אף פעם.

## Open Questions

- הבונה מחיל ב-`site-phase1`, ונימרוד עושה commit וממזג ל-`main`.
- שעות הפעילות באתר (שורה 362) כתובות עם מקף בינוני. נימרוד מחליט.

## Session Log

### 2026-10-04 · הקופי נכתב, ורשימה לבונה [wip]

- **What was done:** הקופירייטרית, בהגדרה החדשה, מצאה נוסח מאושר לכל שלוש המחרוזות. היא גילתה שגוש התיאורים לדף הבית מ-2026-09-30 לא נמצא באף ענף של האתר. **Related:** [[homepage-signing-fix]], [[pergola-signing-fix-run-1]], [[agency-hierarchy]]

### 2026-10-04 · הבונה החיל ב-site-phase1 [wip]

- **What was done:** 8 מחרוזות ב-`index.html` (meta, og, twitter, נתונים מובנים, כותרת משנה, שלב 02, הבועה הצפה). המנכ"ל אימת ב-git: קובץ אחד שונה, אפס "חות" בדף הבית וב-`/pergola/`. **Next:** נימרוד בודק את הבועה בדפדפן, עושה commit וממזג ל-`main`.
