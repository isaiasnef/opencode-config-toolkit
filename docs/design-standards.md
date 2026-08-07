# Design Standards — OpenCode Configuration Toolkit

Conventions for authoring **clean, organized, and efficient** OpenCode configuration:
`AGENTS.md`, custom agents, skills, and slash commands. Project-agnostic.

Distilled from mature references: Anthropic's Agent Skills authoring guidance,
`superpowers:writing-skills`, `addyosmani/agent-skills`, and `wshobson/agents`
(a multi-harness marketplace with an OpenCode target).

---

## 1. Principles (never violated)

1. **The config file is a table of contents, not an encyclopedia.**
   Keep `AGENTS.md` under ~150 lines. Detail lives in `docs/`, `references/`, or a
   skill's `references/` — loaded on demand.
2. **The repo is the system of record.** If it's not in the repo, the agent can't see
   it. No Slack threads, no Notion, no local-only lore.
3. **Enforce invariants, not implementation.** Frontmatter shape, file naming, and
   trigger phrases are validated mechanically (`validate.mjs`). Style and tone within
   those bounds are your call.
4. **Boring tech.** Markdown + YAML frontmatter + small scripts. No DSLs, no template
   engines, no harness-specific markup in source.

## 2. Conventions per artifact

### 2.1 `AGENTS.md`

- Concise core with sections: purpose, precedence, external references, stack,
  rules (MUST/MUST-NOT), architecture, and verification commands.
- **Lazy-load detail**: reference `@docs/<topic>.md` and instruct the agent to `Read`
  them only when the task touches that area.
- Declare **precedence** explicitly when nested AGENTS.md files exist (sub-project
  rules win over root rules).
- End with **MUST ASK triggers** — decisions not covered by the rules must be asked.

### 2.2 Custom agents (`.opencode/agents/<name>.md`)

File form (preferred over inline config):

```markdown
---
description: One sentence: who this agent is and when to delegate to it.
mode: subagent            # primary | subagent | all
model: anthropic/claude-sonnet-5
permission:
  edit: deny
  bash:
    "git status*": allow
    "*": ask
---

You are a <role>. ... (system prompt — the body is the prompt)
```

- **Body is the prompt.** Never put `prompt:` in frontmatter.
- One responsibility per agent. Name it for what it does.
- **Least privilege**: deny by default, allow the minimum tool surface.
- **Model tier** by task: `opus` for review/security/architecture; `sonnet` for
  balanced complex work; `haiku` for fast deterministic tasks; `inherit` to defer.
- Use **globally unique names** (`<scope>-<role>`) to avoid collisions.

### 2.3 Skills (`skills/<name>/SKILL.md`)

Required frontmatter:

```yaml
---
name: validating-skills            # kebab-case, lowercase, matches folder
description: Use when <triggering conditions and symptoms>.  # 3rd person, ≤1024 chars
---
```

**Description rules (Skill Discovery Optimization):**
- `description` = **when** to use it, **not** what it does.
- Start with `Use when ...`. Third person. ≤1024 chars; aim ≤500.
- Front-load concrete trigger keywords: error messages, symptoms, tool names.
- **Never summarize the skill's workflow** — agents follow the description as a shortcut.

**Naming:** verb-first / gerund. `creating-skills` not `skill-creation`.

**Progressive disclosure (3 tiers):**
1. **Frontmatter** — name + description (always loaded).
2. **SKILL.md body** — overview, when to use, quick reference, common mistakes. ≤500 lines.
3. **`references/` + `assets/`** — deep material, loaded on demand. Keep references
   **one level deep** from SKILL.md.

**SKILL.md canonical structure:**

```markdown
# Skill Name

## Overview          # core principle in 1-2 sentences
## When to Use       # symptoms + when NOT to use
## Quick Reference   # table for scanning
## Implementation    # inline code or link to references/
## Common Mistakes   # what goes wrong + fixes
## Gotchas           # failure patterns to bulletproof
```

**Degrees of freedom:** match specificity to fragility — high freedom (guidance),
medium (parameterized recipe), low (exact command, no modification).

### 2.4 Slash commands (`.opencode/commands/<name>.md`)

```markdown
---
description: One sentence describing what the command does.
agent: build
---

(command body = the prompt, with $ARGUMENTS / $1 / $2)
```

- `template` is the body; do **not** add a `template:` frontmatter key.
- Use `$ARGUMENTS` for free text; `$1`, `$2` for positional args.
- Keep names consistent with any related skill (avoid skill/command name collisions).

## 3. Match the form to the failure

Choose the guidance form based on the **baseline failure** you observed:

| Baseline failure | Right form |
|------------------|-----------|
| Violates a rule under pressure (knows better, does it anyway) | Prohibition + rationalization table + red flags |
| Complies but output has the wrong shape | Positive recipe / contract (state what the output IS) |
| Omits a required element | Structural: REQUIRED slot in a template |
| Behavior depends on a condition | Conditional on an observable predicate |

**Rules for whichever form:**
- **No nuance clauses** ("don't X unless it matters") — they reopen negotiation.
- Exemption clauses don't scope; restructure so the rule can't reach the exempt part.
- Bulletproof discipline skills with a **rationalization table** and **red flags** list.

## 4. Anti-patterns

- Narrative storytelling instead of reusable technique.
- Multi-language example dilution (one excellent example beats five mediocre).
- `@` force-loading references (burns context) — use `**REQUIRED:** <skill>` instead.
- Windows-style paths; use forward slashes everywhere.
- Too many options without a default; provide a default + escape hatch.
- "Voodoo constants" — justify configuration values.
- Utility scripts that punt to the agent instead of handling errors.

## 5. Terminology and hygiene

- Consistent terminology within a skill (pick one term per concept).
- No time-sensitive instructions; if a thing changes, put old behavior in an
  "old patterns" section.
- One excellent, concrete example per pattern.

## 6. Authoring checklist (per artifact)

- [ ] Frontmatter shape matches the schema (`name`+`description` present)
- [ ] Description = triggering conditions, "Use when ...", 3rd person, keywords
- [ ] `SKILL.md` body < 500 lines; detail in `references/` (one level deep)
- [ ] References > 100 lines have a table of contents
- [ ] Guidance form matches the failure type (see §3)
- [ ] No anti-patterns from §4
- [ ] Workflows have clear steps + verification gate
- [ ] ≥3 evaluations/checks written before finalizing (see quality-model.md)