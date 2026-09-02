---
tags:
  - setup
  - structure
  - repo
---

# Repo Structure

## Overview

`marketing team` is the AI Content OS working repo — currently a skeleton: the scaffolding, skills and conventions are in place, but no product code or content has been written yet. Its defining property is that **the Obsidian vault root is the repo root**, not `vault/`. `.obsidian/` therefore sits at the top level, and Obsidian sees every file in the project, with `vault/` appearing as one folder among several in the file explorer. Four content folders (`vault/`, `references/`, `scripts/`, `output/`) split the work by lifecycle stage: knowledge in, source material in, automation, deliverables out. `.claude/` holds the Claude Code configuration. Git remote is `nimrodatz/marketing-team`, branch `main`.

## Open Questions

- `.obsidian/` is still untracked. Committing it keeps vault settings consistent across machines; `workspace.json` is already gitignored so the churn is handled. Awaiting a decision on whether to commit.
- `references/`, `scripts/` and `output/` hold nothing but `.gitkeep` — their conventions (naming, file types, whether outputs are committed or ignored) are undefined and should be settled the first time each is actually used.
- No CI, no tests, no package manifest. Whether this repo ever grows executable code, or stays a content + prompt workspace, is undecided.

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
