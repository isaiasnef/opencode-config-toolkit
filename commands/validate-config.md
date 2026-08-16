---
description: Ejecuta el validador de calidad sobre una configuración de OpenCode y reporta los hallazgos.
agent: build
---

# Validar una Configuración de OpenCode

Pasa la config por el quality model y saca a flote hallazgos + prescripciones.

# Inputs
- `$1` — ruta objetivo (directorio del proyecto, directorio de skill, o archivo de agente/comando). Default `.`
- `$ARGUMENTS` — flags adicionales (`--fix`, `--strict`, `--format json`)

# Pasos
1. Resuelve el target (default `.`).
2. Ejecuta: `node scripts/validate.mjs <target> <flags>`
3. Si hay hallazgos, resume los problemas principales con sus prescripciones.
4. NO apliques `--fix` automáticamente a menos que el usuario lo pida.

# Salidas
- Score 0–100, conteos de pasar/warn/error, los hallazgos principales.

# Definición de terminación
- Salida del comando reportada; el usuario decide si corregir.