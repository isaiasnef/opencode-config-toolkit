# Quality Model — OpenCode Configuration Toolkit

How to **validate** the quality of an OpenCode configuration: `AGENTS.md`, custom
agents, skills, and commands. Drives the `validate-config` skill and
`scripts/validate.mjs`.

## 1. Quality levels (three layers)

Evaluate at increasing cost, like a pyramid:

| Level | Type | Cost | What it catches |
|-------|------|------|-----------------|
| **Static** | Deterministic structural lint | <2s, free | Naming, frontmatter, file shape |
| **LLM judge** | Semantic evaluation (N dimensions) | ~seconds | Trigger quality, guidance clarity |
| **Eval / Monte-Carlo** | Repeated real/scenario runs | minutes | Whether it actually works in use |

Stable files pass static; ambiguous or high-stakes ones get judged; new skills get evals.

## 2. Diagnostic rules (the core, implemented by `validate.mjs`)

1. **`frontmatter`** — required fields present (`name`, `description`).
2. **`description`** — trigger phrase ("Use when"), keyword coverage, ≤1024 chars.
3. **`file-size`** — `SKILL.md` body < 500 lines.
4. **`structure`** — `references/`/`assets/` used when the skill grows; references
   one level deep; ToC on long files.
5. **`gotchas`** — skill has a failure-pattern section ("Common mistakes"/"Gotchas").
6. **`allowed-tools`** — tool restrictions appropriate to the artifact's kind
   (analysis / research / generation / execution / reference).
7. **`conflicts`** — duplicate `name`s and overlapping trigger keywords between skills;
   agent/skill/command name collisions.
8. **`portability`** — OpenCode safe: kebab-case folder names, lowercase tool refs,
   correct `permission` shape, no bare model strings without provider.

## 3. Scoring and prescription

- Compute a **score 0–100** across the applicable rules; classify the artifact by kind
  to tailor checks and expectations.
- For each finding emit a **prescription**: *why it matters* + a ready template.
- Commands: `--dry-run` (preview), `--fix` (apply with backup), `--strict`
  (warnings count as errors), `--format json|md`.

**Exit codes:** `0` pass · `1` errors found · `2` warnings found (with `--strict`).

## 5. Evaluations (eval-first)

Modeled after Anthropic's evaluation-driven development:

1. Write **evaluations before** finalizing a skill/agent: representative tasks that
   exercise the behavior you want.
2. Run a **baseline** without the artifact; document failures / rationalizations.
3. Write the minimal guidance that closes those specific failures (**RED→GREEN**).
4. Add scenario `assertions` (`contains`, `starts-with`, `matches`, `min-length`…)
   and track **regressions** when you refactor.

**The iron law:** no skill/agent ships without a failing check first. If you didn't
watch an agent fail without it, you don't know it teaches the right thing.

## Compliance checklist

- [ ] `name` + `description` present and valid
- [ ] description trigger ("Use when ..."), 3rd person, ≤1024, no workflow summary
- [ ] `SKILL.md` < 500 lines; details in `references/` (one level deep)
- [ ] ≥3 evaluations written; baseline observed; checks pass
- [ ] guidance form matches the observed failure (see design-standards §3)
- [ ] no name/keyword collisions across the config
- [ ] verified against the target models/harness you plan to use