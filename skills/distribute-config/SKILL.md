---
name: distribute-config
description: Úsalo cuando expongas o instales una configuración de OpenCode en otras máquinas o equipos (reglas/skills remotas, o instalación de agentes/comandos).
---

# Distribuir una Configuración de OpenCode

Haz que una config sea consumible por cualquier máquina o compañero de equipo.
Ver `docs/distribution.md`.

## Cuándo usar
- Compartir reglas/skills entre equipos sin copiar-pegar
- Instalar agentes/comandos en una máquina nueva (`~/.config/opencode/`)
- Decidir a qué repo y versión fijarse

## Mecanismos
| Artefacto | Cómo | ¿Remoto? |
|-----------|------|---------|
| Reglas / AGENTS.md | campo `instructions` (archivo o URL) | ✅ nativo |
| Skills | `skills.urls` / `skills.paths` | ✅ nativo |
| Agentes | `~/.config/opencode/agents/*.md` | ❌ → instalar |
| Comandos | `~/.config/opencode/commands/*.md` | ❌ → instalar |

## Reglas remotas (sin instalar)
```json
{ "$schema": "https://opencode.ai/config.json",
  "instructions": ["https://raw.githubusercontent.com/<owner>/<repo>/main/rules/_base.md"] }
```

## Skills remotas (sin instalar)
```json
{ "$schema": "https://opencode.ai/config.json",
  "skills": { "urls": ["https://raw.githubusercontent.com/<owner>/<repo>/main/skills"] } }
```

## Instalar agentes + comandos
```bash
node scripts/bootstrap.mjs            # todos los artefactos
node scripts/bootstrap.mjs agents     # solo agentes
node scripts/bootstrap.mjs --dry-run  # vista previa, sin escribir
```

## Errores comunes
- Fijarse a `latest`/rama flotante en lugar de un tag que controles
- Esperar que agentes/comandos se carguen de forma remota (solo son locales) → usa bootstrap
- Instalar re-copias de un agente/comando sin permiso de escritura → el bootstrap es idempotente

## Verificación
Después del bootstrap, `ls ~/.config/opencode/{agents,commands,skills}` muestra los artefactos;
las reglas/skills remotas cargan en un opencode.json nuevo; `node scripts/validate.mjs`
pasa en el target.