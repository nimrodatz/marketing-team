---
tags:
  - setup
  - skills
  - obsidian
---

# Obsidian Skills Setup

## Overview

Three Claude Code skills live in `.claude/skills/`, all sourced from the `ZeremItay/the-5-agents-obsidian` repo. They are project-scoped, so they load for anyone working in this repo and are committed to git. Together they cover the full loop: **when** to write to the vault (`obsidian-vault-workflow`), **how** to write a note (`obsidian-markdown`), and **how** to build database views over the notes (`obsidian-bases`). Only `obsidian-vault-workflow` is mandatory — it is enforced by the standing rule at the top of `CLAUDE.md` in the repo root. The other two are reference material, pulled in when the task actually calls for them. Status: installed and wired up.

## Open Questions

- `obsidian-markdown/SKILL.md` links to `references/PROPERTIES.md`, `references/EMBEDS.md` and `references/CALLOUTS.md` (6 references across the file) — **those files were never copied over and do not exist**. The skill still works for the common cases documented inline, but the deep-dive sections are dead links. Decide whether to pull them from upstream or drop the references.
- No `.base` file exists in the vault yet, so `obsidian-bases` has never actually run here.
- The `Content Briefs`, `Publishing Log` and `Brand Guidelines` folders are empty — Phase 1's "read recent briefs / guidelines" step is a no-op until they have content.

## Session Log

### 2026-09-02 — Documenting the installed skill set [shipped]

- **What was done:** Audited `.claude/skills/` against the upstream repo and wrote this note. Confirmed all three skills from `ZeremItay/the-5-agents-obsidian` are present — the repo contains exactly these three, nothing was missed in the install.
- **The three skills:**
  - **`obsidian-vault-workflow`** (228 lines) — the mandatory read/write protocol. Phase 1 loads context before work (find the topic file via `_index.md`, read it fully, read the 2–3 most recent Meeting Notes, scan briefs/guidelines). Phase 2 writes it back after work (append a dated `[status]`-tagged Session Log entry at the bottom, update Overview only on scope/status change, prune resolved Open Questions, wikilink related notes, read back to verify). Defines the four-folder convention and the `_index.md` discovery pattern. Owner: every task in this repo.
  - **`obsidian-markdown`** (196 lines) — Obsidian Flavored Markdown reference: wikilinks and heading/block links, `![[embeds]]`, `> [!type]` callouts, YAML frontmatter properties, tags, `%%comments%%`, LaTeX math, Mermaid, footnotes. Assumes standard Markdown as known and covers only the Obsidian extensions. Owner: anything writing `.md` inside `vault/`.
  - **`obsidian-bases`** (317 lines) — `.base` file authoring: YAML schema, global vs per-view filters (`and`/`or`/`not`, nested), computed `formulas`, display config, summary formulas, and the table/card view types. Owner: any task building a database-like view over the notes.
- **Decisions:** Enforcement moved out of chat and into `CLAUDE.md`. A chat instruction like "use this skill every session" does not survive a session boundary — `CLAUDE.md` is auto-loaded into context on every session start, so that is the only place a standing rule actually holds. The skill descriptions alone are not enough, since they only make the skill *available*, not *required*.
- **Notes / Caveats:** The `bases` core plugin is confirmed enabled in `.obsidian/core-plugins.json`, so `obsidian-bases` output will render. `.obsidian/` is the user's own configuration and is treated as off-limits for edits.
- **Related:** [[repo-structure]]
