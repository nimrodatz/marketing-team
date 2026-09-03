---
tags:
  - setup
  - structure
  - repo
---

# Repo Structure

## Overview

`marketing team` is the AI Content OS working repo. Git conventions: commit per self-contained unit of work, push once at the end of a session, tag the versions worth returning to. As of 2026-09-03 it is no longer a skeleton: three agents, four skills, two agent scratch spaces (`copywriter/drafts/`, `creative/`), executable tooling in `scripts/`, and real deliverables under `output/marketing/` and `output/creatives/`. Its defining property is that **the Obsidian vault root is the repo root**, not `vault/`. `.obsidian/` therefore sits at the top level, and Obsidian sees every file in the project, with `vault/` appearing as one folder among several in the file explorer. Four content folders (`vault/`, `references/`, `scripts/`, `output/`) split the work by lifecycle stage: knowledge in, source material in, automation, deliverables out. `.claude/` holds the Claude Code configuration. Git remote is `nimrodatz/marketing-team`, branch `main`.

## Open Questions

- Whether the repo needs a branch-per-feature habit or whether committing straight to `main` stays adequate. Single developer, no CI, no collaborators — `main` is fine for now, and the answer changes the day a second person or an automated check enters.
- Whether the generated PNGs under `output/creatives/` belong in git at all is unsettled. They are binary, regenerable, and each regeneration costs money — arguments pull both ways.
- No CI and no tests. `scripts/` now holds two PowerShell scripts (`verify-site-facts.ps1`, `gen-image.ps1`) and both are verified by hand; the repo has no package manifest and, given that Node is not even installed on the working machine, probably should not grow one.

## Session Log

### 2026-09-02 — Mapping the repo and wiring the standing workflow rule [shipped]

- **What was done:** Walked every top-level path and documented what it is for. Created `CLAUDE.md`, created the four vault folders with their `_index.md` files, and extended `.gitignore` for Obsidian.
- **The layout:**
  - **`CLAUDE.md`** (repo root, new) — auto-loaded into context at every session start. Carries the mandatory `obsidian-vault-workflow` Phase 1 / Phase 2 rule, the skill table, vault conventions and ground rules.
  - **`.claude/skills/`** — the three Obsidian skills, committed so they travel with the repo. Detailed in [[obsidian-skills-setup]].
  - **`.claude/agents/`**, **`.claude/commands/`** — custom subagents and slash commands. Both empty (`.gitkeep` only).
  - **`.claude/settings.local.json`** — machine-local permission allowlist (`node`, WebSearch, a couple of WebFetch domains). Local preferences, not shared config.
  - **`.obsidian/`** — the user's own vault configuration: enabled core plugins (graph, backlinks, properties, templates, **bases**, sync), graph tuning, appearance, and `workspace.json`. **Treated as off-limits for edits.**
  - **`vault/`** — the knowledge base and long-term memory. Four folders: `Meeting Notes` (code, architecture, decisions), `Content Briefs` (editorial specs), `Publishing Log` (publish runs and post-mortems), `Brand Guidelines` (voice, visuals, tone). Each has an `_index.md` for topic discovery.
  - **`references/`** — source material and research inputs. Empty.
  - **`scripts/`** — automation and tooling. Empty.
  - **`output/`** — generated deliverables. Empty.
  - **`.gitignore`** — hardened against secrets (`.env*`, keys, certs, `credentials*`, `service-account*.json`, `secrets/`), plus dependencies, build output, and OS/editor cruft. Comments are in Hebrew.
- **Decisions:** `.obsidian/workspace.json` and `workspace-mobile.json` were gitignored while the rest of `.obsidian/` was left trackable — window layout is per-machine session state that would churn on every open, whereas plugin and appearance settings are worth sharing. `.trash/` was added too, since Obsidian's delete-to-trash setting writes there. Notes are confined to `vault/` and never the repo root, so the vault stays the single place memory lives.
- **Notes / Caveats:** Because the vault root is the repo root, Obsidian will surface `.claude/skills/*/SKILL.md` as notes if hidden files are shown — harmless, but it explains stray nodes in the graph view. The graph looked empty before this session simply because no notes existed yet.
- **Related:** [[obsidian-skills-setup]]

### 2026-09-03 — מפת התיקיות אחרי כניסת סוכן הקריאייטיב [shipped]

- **What was done:** נוספו שלוש תיקיות בשורש — `creative/` ו-`creative/reference/` (מרחב העבודה
  הפרטי של [[agent-creative]], מקבילה ל-`copywriter/drafts/`) ו-`output/creatives/` (הפלט הסופי:
  PNG נקי + קובץ HTML להלבשה). `scripts/` קיבל קובץ שני, `gen-image.ps1`. `.claude/skills/`
  עלה משלושה סקילים לארבעה עם `gpt-image-gen`, ו-`.claude/agents/` משניים לשלושה.
  ה-Overview עודכן — הריפו כבר לא שלד.
- **Decisions:** **`package.json` נמחק.** הוא היה שריד מגרסת הסדנה: תיאר סטאק Node על Gemini,
  עם סקריפט שהצביע על `scripts/generate.mjs` שאינו קיים, בסביבה שבה Node לא מותקן כלל.
  הוא גם סתר את החלטת `gpt-image-2` הנעולה. במקביל `.env.example` שוכתב מ-`GEMINI_API_KEY`
  ל-`OPENAI_API_KEY` — הוא הקובץ היחיד מהשניים שנועד להיכנס לגיט, ולכן הוא מה שסשן עתידי קורא.
  **הכלל ש-`output/creatives/` מכיל media בלבד רוכך:** הוא מכיל נכסים ויזואליים **ואת קובצי
  ההלבשה שלהם**, כי ההפניה בין ה-HTML ל-PNG יחסית והם לא יכולים להיפרד. תוצרי טקסט שיווקי
  נשארים ב-`output/marketing/`.
- **Notes / Caveats:** `.obsidian/` עדיין untracked וההחלטה עליו לא הוכרעה. הסקריפט החדש
  קורא את `.env` בעצמו, ו-`.gitignore` כבר מחריג אותו — נבדק ב-`git status`.
- **Related:** [[agent-creative]], [[agent-roster]], [[obsidian-skills-setup]], [[agent-ceo-orchestration]]

### 2026-09-03 — קצב הקומיטים, ו-`.obsidian/` מוכרע [shipped]

- **What was done:** שיחה על שיטת העבודה מול גיט, ואז שני קומיטים שניקו עץ עבודה שנצבר.
  הקומיט הראשון תפס את **מוסכמת השמות עם מספר ריצה** (`<date>-<topic>-run<N>-<kind>`) —
  16 קבצים: `CLAUDE.md`, שלושת הסוכנים, שבע הערות בוולט, ושינוי שם לתוצרי ריצה 1.
  השני הפסיק לעקוב אחרי `.obsidian/graph.json`.
- **Decisions:**
  - **`.obsidian/` נשאר tracked** — שאלה פתוחה משתי ישיבות קודמות, ובפועל היא כבר הוכרעה
    בשטח: הקבצים היו במעקב. `graph.json` הוצא ממנו והצטרף ל-`workspace.json` ברשימת ההחרגות,
    מאותו נימוק בדיוק — אובסידיאן כותב אותו מחדש בכל פתיחה של תצוגת הגרף, כך שהוא הופיע
    כשינוי ב-`git status` בכל סשן בלי לשאת שינוי אמיתי אף פעם. שאר הקונפיג — פלאגינים,
    מראה — נשאר בגיט כי הוא כן שווה שיתוף בין מכונות.
  - **קצב עבודה מול גיט:** קומיט בסוף כל יחידת עבודה שעומדת בפני עצמה (בפרויקט הזה — שלב
    בפייפליין), פוש פעם אחת בסוף סשן. פוש הוא גיבוי מחוץ למחשב, לא הכרזה על גרסה יציבה;
    בריפו של מפתח יחיד בלי CI אין למי לשבור את הבילד. "גרסה שסגורים עליה" מסומנת בתגית
    (`git tag`), לא בהימנעות מפוש. עבודה שעלולה לשבור את הפייפליין — ענף.
- **Notes / Caveats:** אישור לקומיט או לפוש **אינו נדבק בין סשנים ולא בתוך סשן** — צריך פקודה
  מפורשת בכל פעם. מה שכן נשמר הוא ההקשר בלבד (ש-push פירושו `origin/main` ב-`nimrodatz/marketing-team`).
  היסטוריית הגיט יושבת ב-`.git` על הדיסק ולא בסשן, ולכן פוש מסשן אחד דוחף גם קומיטים
  שנוצרו בסשן אחר. אוטומציה אמיתית של קומיט בסוף משימה תדרוש hook ב-`settings.json` —
  נשקל ונדחה, כי הודעות קומיט אוטומטיות מרעישות את ההיסטוריה.
- **Related:** [[agent-ceo-orchestration]], [[agent-creative]], [[marketing-engine-prd]]
