---
description: Copy this blueprint to author a new custom subagent. Use when creating a `.opencode/agents/<name>.md` definition.
mode: subagent
---

# <Agent Name> — subagent blueprint

> Replace everything in angle brackets. Rules and constraints from
> `docs/design-standards.md §2.2`.

## Frontmatter (paste into `.opencode/agents/<name>.md`)

```markdown
---
description: <one sentence: who this agent is and when to delegate to it.>
mode: <subagent|primary|all>
model: <provider/model (optional; pick a tier: opus|sonnet|haiku|inherit)>
permission:
  edit: <allow|ask|deny>
  bash:
    <"pattern*">: <allow|ask|deny>   # put broad rules first, narrow rules last
    "*": <allow|ask|deny>
  read: <allow|ask|deny>
---
```

## Body (becomes the system prompt — never add `prompt:` to frontmatter)

```markdown
You are a <role> working in <context/project>.

## Responsibility
<one clear, focused responsibility. Single Responsibility Principle: does one thing well.>

## What you DO
- <behavior 1>
- <behavior 2>

## What you must NOT do
- <anti-patterns / scope guardrails>

## Verification
- <how you prove your work is correct before finishing>
```

## Checklist before adding the agent

- [ ] Name is `kebab-case` and globally unique (`<scope>-<role>`)
- [ ] `description` says who + when (not a workflow summary)
- [ ] `permission` is least-privilege (deny by default)
- [ ] Model tier matches the task (opus: review/security/arch; sonnet: complex; haiku: fast)
- [ ] Validate with `node scripts/validate.mjs <agent-file>`