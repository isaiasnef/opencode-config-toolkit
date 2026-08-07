---
name: design-agent
description: Use when authoring or redesigning a custom OpenCode subagent (.opencode/agents/&lt;name&gt;.md). Design clean, least-privilege agents.
---

# Designing Agents

Help create OpenCode subagents that are clean, organized, and efficient. See
`docs/design-standards.md §2.2` for the authoritative rules.

## When to Use
- Starting a new `.opencode/agents/<name>.md`
- Reviewing an existing agent for structure, permissions, or model fit
- Delegating agent authoring to someone (or something) else

## Process
1. **Clarify the single responsibility.** Ask: what is the one thing this agent does?
2. **Choose the form**: `subagent` vs `primary` vs `all`.
3. **Write `description`**: who + when. One sentence. No workflow summary.
4. **Assign permissions** (least privilege): deny by default, allow the minimum.
5. **Pick a model tier**: `opus` (review/security/arch), `sonnet` (complex),
   `haiku` (fast deterministic), `inherit` (defer).
6. **Write the body** = the system prompt: Responsibility / Do / Must-not / Verification.
7. **Validate**: `node scripts/validate.mjs <file>`.

## Quick Reference
| Decision | Guidance |
|----------|----------|
| file location | `.opencode/agents/<name>.md` |
| frontmatter keys | `description`, `mode`, `model`, `permission` |
| naming | `kebab-case`, globally unique: `<scope>-<role>` |
| permissions | deny by default; allow minimum tools |
| model | match tier to task difficulty & risk |

## Common Mistakes
- Inline `prompt:` in frontmatter (the body is the prompt) → remove it.
- One agent doing many jobs → split by Single Responsibility.
- `bash: allow` broadly → scope to the required commands.

## Verification
The file passes `validate.mjs`: valid frontmatter, unique name, least-privilege
permissions, and a non-empty body.