---
name: organize-config
description: Use when structuring or cleaning an OpenCode configuration directory to keep it DRY, single-source, and progressive-disclosure friendly.
---

# Organizing an OpenCode Configuration

Keep a config **clean, DRY, and single-source** across AGENTS.md, agents, skills, and
commands. See `docs/design-standards.md §1` for the principles.

## When to Use
- Setting up a new project's `.opencode/` layout
- Cleaning a config that has grown messy or duplicated
- Reviewing layout before distributing it to a team

## Principles
1. **Config file = table of contents.** `AGENTS.md` < ~150 lines; detail → `docs/`/`references/`.
2. **One source of truth.** An artifact is defined once; everything else references it.
3. **Composable, not bundled.** Granular units you can mix; install only what's needed.
4. **Progressive disclosure.** Metadata → core body → `references/`/`assets/` on demand.

## Layout (target)
```
AGENTS.md                      # concise rules + lazy-load references
opencode.json                  # $schema + permissions + remote instructions
.opencode/
├── agents/                    # one file per agent
├── commands/                  # one file per slash command
└── skills/<name>/SKILL.md     # folder per skill (+ references/ if needed)
docs/                          # lazy-load detail
```

## Refactor moves
- **Extract**: move detail out of `AGENTS.md` into `docs/<topic>.md`, referenced with `@`.
- **Split**: a `SKILL.md` > 500 lines → split into `references/` one level deep.
- **Dedup**: overlapping skills/triggers → merge or cross-reference, never duplicate.
- **Align**: skill names and their slash commands must not collide (rename one).

## Common Mistakes
- Duplicating the same rule in AGENTS.md and a skill
- A monolithic skill/agent doing five things (breaks composability)
- Forgetting to update `manifest.json` when adding/removing an artifact

## Verification
`node scripts/validate.mjs <target>` passes; the structure matches the layout above;
no artifact is defined in more than one place.