---
name: validate-config
description: Úsalo cuando valides o audites una configuración de OpenCode (AGENTS.md, agentes, skills, comandos) por problemas de calidad antes de publicar.
---

# Validando una Configuración de OpenCode

Evalúa una config contra el quality model en `docs/quality-model.md`.

## Cuándo usar
- Antes de confirmar (commit) o publicar un cambio de config de OpenCode
- Cuando un agente, skill o comando "no funciona" o no se descubre
- Al revisar la config de otra persona

## Qué revisar (8 reglas)
1. **frontmatter** — `name` + `description` requeridos, presentes y bien formados
2. **description** — solo condiciones de disparo ("Use when ..."/"Úsalo cuando ..."), 3.ª persona, ≤1024
3. **file-size** — cuerpo de `SKILL.md` < 500 líneas
4. **structure** — `references/` para profundidad; un solo nivel; ToC en archivos largos
5. **gotchas** — tiene una sección "Common Mistakes / Gotchas"
6. **allowed-tools** — restricciones de herramientas acordes al tipo de artefacto
7. **conflicts** — sin nombres duplicados ni triggers superpuestos
8. **portability** — carpetas kebab-case, herramientas en minúsculas, forma válida de `permission`

## Workflow
1. `node scripts/validate.mjs <target>` — capa mecánica
2. Lee buscando calidad semántica (claridad del trigger, forma de la guía, eficiencia de tokens)
3. Reporta score 0–100 + hallazgos con prescripciones
4. Opcionalmente `--fix` (crea respaldo) con `undo` disponible

## Referencia rápida
| Caso | Comando |
|------|---------|
| Lint de un directorio de proyecto | `node scripts/validate.mjs /ruta/al/proyecto` |
| Auto-fix con respaldo | `node scripts/validate.mjs <target> --fix` |
| Warnings como errores | `node scripts/validate.mjs <target> --strict` |
| JSON para CI | `node scripts/validate.mjs <target> --format json` |

## Errores comunes
- Tratar la description como un resumen del workflow (los agentes la usan como atajo)
- Dejar que `SKILL.md` crezca más de 500 líneas sin dividir en `references/`
- Colisión de nombres entre skills / agentes / comandos que se sobreescriben en silencio

## Verificación
`validate.mjs` sale `0` (pasa) sin hallazgos, o alcanza el umbral de score y cada
hallazgo se mapea a una regla con una prescripción.