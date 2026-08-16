---
description: Genera el scaffolding de un nuevo archivo de subagente desde el blueprint agents/_template.
agent: build
model: anthropic/claude-sonnet-5
---

# Nuevo Subagente Personalizado

Scaffold de un agente `.opencode/agents/<name>.md` desde el template del toolkit.

# Inputs
- `$1` — nombre del agente (`kebab-case`, p. ej. `backend-reviewer`)
- `$ARGUMENTS` — rol o descripción corta opcional

# Pasos
1. Usa el blueprint `agents/_template.md` como punto de partida.
2. Llena el frontmatter: `description`, `mode` (`subagent`) y el nivel de `model`.
3. Llena `permission` con menor privilegio (deniega por defecto).
4. Escribe el cuerpo: Responsabilidad / Hacer / No-hacer / Verificación.
5. Guarda en `.opencode/agents/<name>.md` (o el dir de config del proyecto).

# Salidas
- `.opencode/agents/<name>.md` — listo para revisar.

# Definición de terminación
- El archivo pasa `node scripts/validate.mjs .opencode/agents/<name>.md`; el nombre es único y `kebab-case`.