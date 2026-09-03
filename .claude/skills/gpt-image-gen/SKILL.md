---
name: gpt-image-gen
description: Generate text-free visual assets through the OpenAI Images API with the locked gpt-image-2 model. Use when producing images, banners, ad creatives, backgrounds or any visual asset for the Craft & System marketing engine, or when the user mentions תמונה, ויז'ואל, קריאייטיב, באנר, image generation, or gpt-image-2.
---

# GPT Image Gen — Craft & System

A thin, opinionated wrapper over the OpenAI Images API. Everything an image
generation needs is behind one PowerShell script; this file governs **when** you
may call it and **what** the prompt must contain.

---

## Iron rule 1 — the model

**`gpt-image-2`. Only.**

Not `gpt-image-1`. Not `dall-e-3`. Not "whatever the API suggests in the error".
This is a locked project decision, recorded in `CLAUDE.md` and in
`vault/Meeting Notes/agent-roster.md`.

The model name is a **constant inside `scripts/gen-image.ps1`** — there is
deliberately no parameter to change it. If a call fails, **report the failure and
stop.** Never edit the script to try a different model, and never work around it
with a direct `curl`.

## Iron rule 2 — Zero-Text

Image engines do not render Hebrew correctly. What comes back is mangled
letterforms that look like text but are not — worse than no text at all.

**Therefore: every image this project generates carries no text whatsoever.**
The Hebrew is layered on top afterwards, in code (HTML/CSS or SVG).

Every prompt ends with this clause, **verbatim**:

```
no text, no letters, no words, no signage, no captions
```

The script checks for it and **refuses to run without it** — the gate fires
before the paid call, so a malformed prompt costs nothing. That is the mechanical
half. The other half is yours: **open the returned PNG with `Read` and confirm
there is no letter, word, sign or caption in it.** An image that came back with
text is rejected and regenerated. Do not ship it and do not crop it out.

## Cost gate

**Every call costs money.** `CLAUDE.md` requires an explicit stop for approval
before any action that costs money.

Do not run this script unless the user has explicitly approved this generation,
including **how many images**. No approval → write the prompts to a file, report
them, and stop. Approval for one run never carries over to the next.

---

## How to call it

One line:

```bash
pwsh -File scripts/gen-image.ps1 -Prompt "<the full prompt>" -OutFile "output/creatives/<name>.png"
```

| Parameter | Required | Default | Notes |
|---|---|---|---|
| `-Prompt` | yes | — | Must end with the Zero-Text clause |
| `-OutFile` | yes | — | Relative to repo root. `.png` appended if missing; parent folder created |
| `-Size` | no | `1024x1024` | Also `1024x1536` (portrait), `1536x1024` (landscape) |
| `-Quality` | no | `medium` | `low` · `medium` · `high` |

The script loads `OPENAI_API_KEY` from `.env` itself. **Never pass the key on the
command line, never echo it, never write it into any file.**

## Writing the prompt

English, comma-separated, concrete. Six parts in order:

1. **Subject** — what is in the frame
2. **Scene / context** — where. For this brand: a real construction site, a
   contractor's pickup, a field office. Not a startup open-space
3. **Light** — golden hour, overcast, harsh noon
4. **Palette** — the brand's, or the one the brief specifies
5. **Style** — documentary photography, editorial, minimal 3D
6. **The Zero-Text clause**, verbatim

```
a contractor's hands holding a tablet on a concrete pour, late afternoon light,
warm neutral palette, documentary photography, shallow depth of field,
no text, no letters, no words, no signage, no captions
```

**Two traps specific to this brand:**

- **No AI-stock look.** No glowing circuits, no floating holographic UI, no
  handshake-over-a-globe. `voice-and-tone.md` bans the verbal equivalents; the
  same ban applies to the visual.
- **The image must recognise real field work.** Craft & System sells to
  contractors. A visual that looks like a SaaS landing page contradicts the copy
  it sits next to.

## When something fails

- **Exit code 2** — the Zero-Text gate. Add the clause and run again. Nothing was spent.
- **Exit code 1** — missing `.env` / missing key / API error / empty payload.
  The script prints the API's own message. **Report it as-is and stop.**
- **Never retry automatically in a loop.** Each retry is another charge.
- **Never switch model** to get past an error.

## Output locations

| Path | What goes there |
|---|---|
| `creative/` | The agent's scratch space — experiments, prompt drafts. Never a deliverable |
| `creative/reference/` | Inspiration and reference material |
| `output/creatives/` | Final assets: the clean PNG plus its overlay file |

Marketing **text** deliverables never go in `output/creatives/` — they live in
`output/marketing/`.
