---
description: Genera la configuración base de OpenCode (AGENTS.md, layout .opencode/, opencode.json) para un proyecto.
agent: build
---

# Inicializar una Configuración de OpenCode

Scaffold de una config de OpenCode limpia y conforme al estándar en el proyecto actual.

# Contexto
- Proyecto actual: el objetivo de la config
- Estándares de referencia: `docs/design-standards.md`

# Pasos
1. Detecta el tipo de proyecto y el stack principal (pregunta si no está claro).
2. Genera `AGENTS.md` desde el blueprint `rules/<type>.md` más cercano:
   - propósito, precedencia, referencias externas, stack, reglas, arquitectura, verificación
3. Crea el layout `.opencode/`:
   - `.opencode/agents/`, `.opencode/commands/`, `.opencode/skills/`
4. Escribe un `opencode.json` con `$schema` y `permission` mínimo.
5. Si existe el generator, prefiere correr `node scripts/generate.mjs --name <name> --type <type> --out .`

# Salidas
- `AGENTS.md`
- `opencode.json`
- directorios `.opencode/` (scaffolding vacío)

# Definición de terminación
- `node scripts/validate.mjs .` pasa; AGENTS.md es de < ~150 líneas con referencias lazy-load.