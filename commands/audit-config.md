---
description: Deep audit of an OpenCode configuration using the config-auditor agent.
agent: config-auditor
---

# Audit an OpenCode Configuration

Run a semantic audit (beyond the mechanical linter) over the config and get a
structured quality report.

# Inputs
- `$1` — target path (default `.`)
- `$ARGUMENTS` — focus areas (e.g. `skills`, `agents`, `AGENTS.md`)

# Steps
1. As the `config-auditor`, load the target config.
2. Run the mechanical layer: `node scripts/validate.mjs <target>`.
3. Evaluate semantically: trigger quality, guidance form, progressive disclosure,
   token efficiency.
4. Produce a report: score 0–100, findings by rule + severity, prescriptions.
5. Suggest ≥3 evaluations (scenarios + assertions) for new artifacts.

# Outputs
- Structured audit report (score, findings, prescriptions, suggested evals).

# Definition of done
- Every finding maps to a rule or a concrete observation; no silent fixes.