# Distribution — apply OpenCode config to any machine/team

How the configuration artifacts in this repo are exposed so that **any team-mate or
machine** can consume them without copy-paste or bespoke setup.

## Strategy

OpenCode natively supports **remote** loading for rules and skills, while agents and
slash commands are discovered only from local paths. The toolkit combines both:

| Artifact | Load mechanism | Remote? |
|----------|----------------|---------|
| Rules / `AGENTS.md` | `instructions` (file or URL) | ✅ native |
| Skills | `skills.urls` / `skills.paths` | ✅ native (URL lists) |
| Subagents | `~/.config/opencode/agents/*.md` | ❌ local → install |
| Commands | `~/.config/opencode/commands/*.md` | ❌ local → install |

`manifest.json` is the index of every artifact and the source of truth the scripts use.

## 1. Remote rules (no install)

Point any project's `opencode.json` at this repo's rule files via raw URLs:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "https://raw.githubusercontent.com/isaiasnef/opencode-config-toolkit/main/rules/_base.md"
  ]
}
```

## 2. Remote skills (no install)

```json
{
  "$schema": "https://opencode.ai/config.json",
  "skills": {
    "urls": [
      "https://raw.githubusercontent.com/isaiasnef/opencode-config-toolkit/main/skills"
    ]
  }
}
```

> Serve a comma/newline-separated list (`skills-index.json`) if you want to expose a
> curated subset per team.

## 3. Agents + commands (install)

Agents and commands are discovered only from local directories, so install them into the
per-user config. `scripts/bootstrap.mjs` does this:

```bash
node scripts/bootstrap.mjs                # install ALL artifacts
node scripts/bootstrap.mjs agents         # only agents
node scripts/bootstrap.mjs commands       # only commands
node scripts/bootstrap.mjs --dry-run      # preview, no writes
```

It reads `manifest.json`, and copies each artifact into `~/.config/opencode/` respecting
their destination (`agents/`, `commands/`, `skills/`).

## 4. Using the toolkit in another project

```bash
# From the toolkit repo
node scripts/generate.mjs --name cart-svc --type backend --out ../cart-svc

# Or reference rules/skills remotely as shown above and only bootstrap agents/commands.
```

## Conventions

- **Everything in the repo.** Config artifacts live in the repo; nothing important
  lives only in a chat or a doc.
- **One source of truth** (`manifest.json`); `generate.mjs`/`validate.mjs`/`bootstrap.mjs`
  read it rather than hardcode paths.
- Version the repo; pin `instructions`/`skills.urls` to a tag/branch you control.