# opencode-config-toolkit

Generic toolkit to **design, validate, and distribute** OpenCode configurations: `AGENTS.md` rules, custom agents, skills, and commands. Clean, organized, and efficient by design.

Project-agnostic: the goal is not to ship skills that solve *your* domain problems, but a **meta-kit** that helps you author, review, and hand out the configuration artifacts themselves for any kind of project.

## What you get

| Area | Deliverable |
|------|-------------|
| **Design** | `docs/design-standards.md` — conventions for `AGENTS.md`, agents, skills and commands |
| **Quality** | `docs/quality-model.md` + `scripts/validate.mjs` — 8 diagnostic rules, scoring, prescriptions |
| **Generation** | `scripts/generate.mjs` + `presets/` — scaffold a config into a destination project |
| **Distribution** | `scripts/bootstrap.mjs` + `docs/distribution.md` — apply config to any machine/team |
| **Blueprints** | `agents/`, `skills/`, `commands/` — copy-adapt templates for your own config |

## Repository structure

```
opencode-config-toolkit/
├── README.md                # this file
├── LICENSE                  # MIT
├── manifest.json            # index (SSOT) of every artifact
├── opencode.json            # self-config for this repo (schema + remote dist)
├── docs/
│   ├── design-standards.md  # how to author clean, organized, efficient config
│   ├── quality-model.md     # how to validate config quality
│   └── distribution.md      # how to expose config to other machines/teams
├── rules/                   # AGENTS.md blueprints by project type
├── agents/                  # subagent blueprints (meta)
├── skills/                  # meta-skills (design/validate/organize/distribute)
├── commands/                # slash command blueprints (meta)
└── scripts/
    ├── generate.mjs         # generator
    ├── validate.mjs         # validator/linter
    ├── bootstrap.mjs        # distribution/install
    └── presets/             # generator presets by project type
```

## Quickstart

```bash
# Clone
git clone https://github.com/isaiasnef/opencode-config-toolkit.git

# Validate an existing config (a project's AGENTS.md + .opencode/)
node scripts/validate.mjs /path/to/your/project

# Generate a new config into a destination project
node scripts/generate.mjs --name my-service --type backend --out /path/to/project

# Install this toolkit globally so its skills/agents/commands are available everywhere
node scripts/bootstrap.mjs
```

## Principles

1. **The config file is a table of contents, not an encyclopedia.** Keep `AGENTS.md` short; push detail into `docs/` or `references/`.
2. **The repo is the system of record.** If it's not in the repo, the agent can't see it.
3. **Enforce invariants, not implementation.** Frontmatter shape, naming, and triggers are validated mechanically; style and tone are up to you.
4. **Boring tech.** Markdown + YAML frontmatter + small Node scripts. No DSLs, no template engines.

## License

MIT — see [LICENSE](LICENSE).