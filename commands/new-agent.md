---
description: Scaffold a new custom subagent file from the agents/_template blueprint.
agent: build
model: anthropic/claude-sonnet-5
---

# New Custom Subagent

Scaffold a `.opencode/agents/<name>.md` agent from the toolkit template.

# Inputs
- `$1` — agent name (`kebab-case`, e.g. `backend-reviewer`)
- `$ARGUMENTS` — optional role/short description

# Steps
1. Use the blueprint `agents/_template.md` as the starting point.
2. Fill frontmatter `description`, `mode` (`subagent`), and `model` tier.
3. Fill `permission` with least privilege (deny by default).
4. Write the body: Responsibility / Do / Must-not / Verification.
5. Save to `.opencode/agents/<name>.md` (or the project's config dir).

# Outputs
- `.opencode/agents/<name>.md` — ready to review.

# Definition of done
- File passes `node scripts/validate.mjs .opencode/agents/<name>.md`; name is unique and `kebab-case`.