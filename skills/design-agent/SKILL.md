---
name: design-agent
description: Úsalo cuando autoras o rediseñas un subagente personalizado de OpenCode (.opencode/agents/&lt;name&gt;.md). Diseña agentes limpios y de menor privilegio.
---

# Diseñando Agentes

Ayuda a crear subagentes de OpenCode limpios, organizados y eficientes. Ver
`docs/design-standards.md §2.2` para las reglas autoritarias.

## Cuándo usar
- Empezar un nuevo `.opencode/agents/<name>.md`
- Revisar un agente existente por estructura, permisos o adecuación de modelo
- Delegar la autoría de agentes a alguien (o algo) más

## Proceso
1. **Clarifica la responsabilidad única.** Pregunta: ¿cuál es la única cosa que hace este agente?
2. **Elige la forma**: `subagent` vs `primary` vs `all`.
3. **Escribe la `description`**: quién + cuándo. Una frase. Sin resumen del workflow.
4. **Asigna permisos** (menor privilegio): deniega por defecto, permite lo mínimo.
5. **Elige un nivel de modelo**: `opus` (revisión/seguridad/arquitectura), `sonnet` (complejo),
   `haiku` (determinista rápido), `inherit` (diferir).
6. **Escribe el cuerpo** = el prompt del sistema: Responsabilidad / Hacer / No-hacer / Verificación.
7. **Valida**: `node scripts/validate.mjs <archivo>`.

## Referencia rápida
| Decisión | Guía |
|----------|----------|
| ubicación del archivo | `.opencode/agents/<name>.md` |
| claves del frontmatter | `description`, `mode`, `model`, `permission` |
| nombrado | `kebab-case`, único global: `<scope>-<role>` |
| permisos | deniega por defecto; permite las herramientas mínimas |
| modelo | iguala el nivel a la dificultad y el riesgo de la tarea |

## Errores comunes
- `prompt:` en línea en el frontmatter (el cuerpo es el prompt) → quítalo.
- Un agente haciendo muchos trabajos → divide por responsabilidad única.
- `bash: allow` amplio → acota a los comandos requeridos.

## Verificación
El archivo pasa `validate.mjs`: frontmatter válido, nombre único, permisos de menor
privilegio y cuerpo no vacío.