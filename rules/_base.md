# AGENTS.md

Project blueprint for this repository. Learn it once, apply to all agents/commands/skills here.

## Identity
- Repository: **opencode-config-toolkit** — a generic toolkit to design, validate, and distribute OpenCode configuration: `AGENTS.md` rules, custom agents, skills, and commands.
- This config is **meta**: it governs how OpenCode configurations are authored, not a single product's business logic. Keep it project-agnostic; never hard-code a single service's names.

## Working model
- Read `/AGENTS.md` (this file), `/docs/design-standards.md`, `/docs/quality-model.md`, and `/docs/distribution.md` before changing anything.
- Treat `manifest.json` as the single source of truth for artifact inventory; scripts/navigation read it, do not hardcode paths.
- Small, regular commits per milestone; push to `main` (`git@github.com:isaiasnef/opencode-config-toolkit.git`).

## Must / Must Not
- MUST use declarative, boring tech (Node `.mjs` scripts, JSON manifests, Markdown) — no framework churn.
- MUST keep every user-facing artifact below ~500 lines; split skills into progressive tiers.
- MUST give every agent/skill/command a `description` with an explicit **"Use when …"** trigger phrase.
- MUST NOT invent domain knowledge the toolkit was never designed to hold — keep it generic.
- MUST NOT store secrets, credentials, or personal keys in the repo; keep `.env` untracked.

## Architecture
- `rules/` — `AGENTS.md` blueprints per archetype (`_base`, `backend-service`, `data-pipeline`, `frontend-app`).
- `agents/` — reusable custom OpenCode agents (agent-designer, skill-designer, command-designer, config-auditor).
- `skills/` — progressively-disclosed reusable skills (design-agent, validate-config, organize-config, distribute-config).
- `commands/` — slash commands (`init-config`, `validate-config`, `audit-config`, `new-agent`).
- `scripts/` — standalone Node CLI runners (`generate.mjs`, `validate.mjs`, `bootstrap.mjs`).
- `docs/` — authoring standards and quality model.

## Verify before finishing
```bash
node scripts/validate.mjs .
node --check scripts/*.mjs
```

## Phases
- **H0** foundation (README, LICENSE, manifest, opencode) — done.
- **H1** docs (design-standards, quality-model, distribution) — done.
- **H2** agents — done.
- **H3** skills — done.
- **H4** commands — done.
- **H5** scripts (generate, validate, bootstrap) — in progress.
- **H6** functional manifest + remote distribution examples — pending.

Out of scope for this conversation: validating external repos, network publishing, REST APIs — future phases only.