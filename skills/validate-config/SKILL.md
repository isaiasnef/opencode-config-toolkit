---
name: validate-config
description: Use when validating or auditing an OpenCode configuration (AGENTS.md, agents, skills, commands) for quality issues before shipping.
---

# Validating OpenCode Configuration

Assess a config against the quality model in `docs/quality-model.md`.

## When to Use
- Before committing or shipping an OpenCode config change
- When an agent, skill, or command "isn't working" or isn't being discovered
- In review of someone else's config

## What to check (8 rules)
1. **frontmatter** — required `name` + `description` present and well-formed
2. **description** — triggering conditions only ("Use when ..."), 3rd person, ≤1024
3. **file-size** — `SKILL.md` body < 500 lines
4. **structure** — `references/` used for depth; one level deep; ToC on long files
5. **gotchas** — has a "Common Mistakes / Gotchas" section
6. **allowed-tools** — tool restrictions suit the artifact kind
7. **conflicts** — no duplicate names or overlapping triggers
8. **portability** — kebab-case folders, lowercase tools, valid `permission` shape

## Workflow
1. `node scripts/validate.mjs <target>` — mechanical layer
2. Read for semantic quality (trigger clarity, guidance form, token efficiency)
3. Report score 0–100 + findings with prescriptions
4. Optionally `--fix` (adds backup) with `undo` available

## Quick Reference
| Case | Command |
|------|---------|
| Lint a project dir | `node scripts/validate.mjs /path/to/project` |
| Auto-fix with backup | `node scripts/validate.mjs <target> --fix` |
| Warnings as errors | `node scripts/validate.mjs <target> --strict` |
| JSON for CI | `node scripts/validate.mjs <target> --format json` |

## Common Mistakes
- Treating the description as a summary of the workflow (agents shortcut on it)
- Letting `SKILL.md` grow past 500 lines without splitting into `references/`
- Name collisions between skills / agents / commands silently overwrite

## Verification
`validate.mjs` exits `0` (pass) with no findings, or your score threshold is met and
every finding maps to a rule with a prescription.