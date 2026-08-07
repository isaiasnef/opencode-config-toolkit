---
description: Copy this blueprint to author a new OpenCode slash command. Use when creating a `.opencode/commands/<name>.md` definition.
agent: build
---

# <Command Name> — command blueprint

> Replace placeholders. Rules: `docs/design-standards.md §2.4`.

## Frontmatter (paste into `.opencode/commands/<name>.md`)

```markdown
---
description: <one sentence describing what the command does.>
agent: <build|plan|general|custom-agent>
model: <provider/model (optional)>
---
```

## Body (this becomes the prompt/the template)

```markdown
# Task
<what this command accomplishes>

# Steps
1. <step 1>
2. <step 2>
3. <step 3>

# Inputs
- $ARGUMENTS  <everything after the command name>
- $1, $2      <positional arguments>

# Output / Definition of done
<what counts as done>
```

## Checklist
- [ ] `description` present (shown in the slash palette)
- [ ] Body is non-empty and states inputs via `$ARGUMENTS`/`$1`
- [ ] Name doesn't collide with a skill of the same intent
- [ ] Validate with `node scripts/validate.mjs <command-file>`