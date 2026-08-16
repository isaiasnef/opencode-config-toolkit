---
description: Auditoría profunda de una configuración de OpenCode usando el agente config-auditor.
agent: config-auditor
---

# Auditar una Configuración de OpenCode

Corre una auditoría semántica (más allá del linter mecánico) sobre la config y obtén un
reporte de calidad estructurado.

# Inputs
- `$1` — ruta objetivo (default `.`)
- `$ARGUMENTS` — áreas de enfoque (p. ej. `skills`, `agents`, `AGENTS.md`)

# Pasos
1. Como `config-auditor`, carga la config objetivo.
2. Corre la capa mecánica: `node scripts/validate.mjs <target>`.
3. Evalúa semánticamente: calidad del trigger, forma de la guía, divulgación
   progresiva, eficiencia de tokens.
4. Produce un reporte: score 0–100, hallazgos por regla + severidad, prescripciones.
5. Sugiere ≥3 evaluaciones (escenarios + assertions) para artefactos nuevos.

# Salidas
- Reporte de auditoría estructurado (score, hallazgos, prescripciones, evals sugeridos).

# Definición de terminación
- Cada hallazgo mapea a una regla o a una observación concreta; sin correcciones silenciosas.