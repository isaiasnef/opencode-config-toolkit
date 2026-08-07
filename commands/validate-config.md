---
description: Run the quality validator over an OpenCode configuration and report findings.
agent: build
---

# Validate an OpenCode Configuration

Run the config through the quality model and surface findings + prescriptions.

# Inputs
- `$1` — target path (project dir, skill dir, or agent/command file). Defaults to `.`
- `$ARGUMENTS` — extra flags (`--fix`, `--strict`, `--format json`)

# Steps
1. Resolve the target (default `.`).
2. Execute: `node scripts/validate.mjs <target> <flags>`
3. If findings exist, summarize the top issues with their prescriptions.
4. Do NOT auto-apply `--fix` unless the user asks.

# Outputs
- Score 0–100, counts of pass/warn/error, top findings.

# Definition of done
- Command output reported; user decides whether to fix.