---
name: distribute-config
description: Use when exposing or installing an OpenCode configuration on other machines or teams (remote rules/skills, or installing agents/commands).
---

# Distributing an OpenCode Configuration

Make a config consumable by any machine or teammate. See `docs/distribution.md`.

## When to Use
- Sharing rules/skills across teams without copy-paste
- Installing agents/commands on a new machine (`~/.config/opencode/`)
- Vetting which repo and version to pin to

## Mechanisms
| Artifact | How | Remote? |
|----------|-----|---------|
| Rules / AGENTS.md | `instructions` field (file or URL) | ✅ native |
| Skills | `skills.urls` / `skills.paths` | ✅ native |
| Agents | `~/.config/opencode/agents/*.md` | ❌ → install |
| Commands | `~/.config/opencode/commands/*.md` | ❌ → install |

## Remote rules (no install)
```json
{ "$schema": "https://opencode.ai/config.json",
  "instructions": ["https://raw.githubusercontent.com/<owner>/<repo>/main/rules/_base.md"] }
```

## Remote skills (no install)
```json
{ "$schema": "https://opencode.ai/config.json",
  "skills": { "urls": ["https://raw.githubusercontent.com/<owner>/<repo>/main/skills"] } }
```

## Install agents + commands
```bash
node scripts/bootstrap.mjs            # all artifacts
node scripts/bootstrap.mjs agents     # only agents
node scripts/bootstrap.mjs --dry-run  # preview, no writes
```

## Common Mistakes
- Pinning to `latest`/floating branch instead of a tag you control
- Rendering agent/command re-install disruptive (no idempotency) → bootstrap is idempotent
- Expecting agents/commands to load remotely (they are local-only) → use bootstrap

## Verification
After bootstrap, `ls ~/.config/opencode/{agents,commands,skills}` shows the artifacts;
remote rules/skills load in a fresh opencode.json; `validate.mjs` passes on the target.