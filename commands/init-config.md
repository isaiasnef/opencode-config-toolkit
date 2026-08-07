---
description: Generate the base OpenCode configuration (AGENTS.md, .opencode/ layout, opencode.json) for a project.
agent: build
---

# Initialize an OpenCode Configuration

Scaffold a clean, standards-compliant OpenCode config into the current project.

# Context
- Current project: the target of the config
- Reference standards: `docs/design-standards.md`

# Steps
1. Detect the project type and primary stack (ask if unclear).
2. Generate `AGENTS.md` from the closest `rules/<type>.md` blueprint:
   - purpose, precedence, external references, stack, rules, architecture, verification
3. Create the `.opencode/` layout:
   - `.opencode/agents/`, `.opencode/commands/`, `.opencode/skills/`
4. Write a `opencode.json` with `$schema` and minimal `permission`.
5. If the generator exists, prefer running `node scripts/generate.mjs --name <name> --type <type> --out .`

# Outputs
- `AGENTS.md`
- `opencode.json`
- `.opencode/` directories (empty scaffolding)

# Definition of done
- `node scripts/validate.mjs .` passes; AGENTS.md is < ~150 lines with lazy-load references.