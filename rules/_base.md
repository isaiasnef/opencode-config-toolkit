# AGENTS.md

Blueprint de proyecto para este repositorio. Apréndelo una vez, aplícalo a todos los agentes/comandos/skills de aquí.

## Identidad
- Repositorio: **opencode-config-toolkit** — un toolkit genérico para diseñar, validar y distribuir configuración de OpenCode: reglas `AGENTS.md`, agentes personalizados, skills y comandos.
- Esta config es **meta**: gobierna cómo se autoran las configuraciones de OpenCode, no la lógica de negocio de un producto. Mantén el proyecto agnóstico; nunca hardcodees nombres de un solo servicio.

## Modelo de trabajo
- Lee `/AGENTS.md` (este archivo), `/docs/design-standards.md`, `/docs/quality-model.md` y `/docs/distribution.md` antes de cambiar nada.
- Trata `manifest.json` como la única fuente de verdad del inventario de artefactos; los scripts/navegación lo leen, no hardcodees rutas.
- Commits pequeños y regulares por hito; empuja a `main` (`git@github.com:isaiasnef/opencode-config-toolkit.git`).

## Must / Must Not
- DEBES usar tecnología aburrida y declarativa (scripts Node `.mjs`, manifiestos JSON, Markdown) — sin churn de frameworks.
- DEBES mantener cada artefacto visible al usuario por debajo de ~500 líneas; divide las skills en niveles progresivos.
- DEBES dar a cada agente/skill/comando una `description` con una frase disparadora explícita **"Use when …" / "Úsalo cuando …"**.
- NO DEBES inventar conocimiento de dominio que el toolkit nunca fue diseñado para tener — manténlo genérico.
- NO DEBES guardar secretos, credenciales ni llaves personales en el repo; mantén `.env` sin trackear.

## Arquitectura
- `rules/` — blueprints de `AGENTS.md` por arquetipo (`_base`, `backend-service`, `data-pipeline`, `frontend-app`).
- `agents/` — agentes personalizados de OpenCode reutilizables (agent-designer, skill-designer, command-designer, config-auditor).
- `skills/` — skills reutilizables con divulgación progresiva (design-agent, validate-config, organize-config, distribute-config).
- `commands/` — slash commands (`init-config`, `validate-config`, `audit-config`, `new-agent`).
- `scripts/` — CLIs Node independientes (`generate.mjs`, `validate.mjs`, `bootstrap.mjs`).
- `docs/` — estándares de autoría y quality model.

## Verifica antes de terminar
```bash
node scripts/validate.mjs .
node --check scripts/*.mjs
```

## Fases
- **H0** cimientos (README, LICENSE, manifest, opencode) — hecho.
- **H1** docs (design-standards, quality-model, distribution) — hecho.
- **H2** agents — hecho.
- **H3** skills — hecho.
- **H4** commands — hecho.
- **H5** scripts (generate, validate, bootstrap) — en proceso.
- **H6** manifest funcional + ejemplos de distribución remota — pendiente.

Fuera del alcance de esta conversación: validar repos externos, publicación en red, APIs REST — solo fases futuras.