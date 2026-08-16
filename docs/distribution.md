# Distribution — aplica una config de OpenCode a cualquier máquina/equipo

Cómo se exponen los artefactos de configuración de este repo para que **cualquier
compañero de equipo o máquina** pueda consumirlos sin copiar-pegar ni setups improvisados.

## Estrategia

OpenCode soporta de forma nativa la carga **remota** de reglas y skills, mientras que los
agentes y comandos slash se descubren solo desde rutas locales. El toolkit combina ambos:

| Artefacto | Mecanismo de carga | ¿Remoto? |
|----------|----------------|---------|
| Reglas / `AGENTS.md` | `instructions` (archivo o URL) | ✅ nativo |
| Skills | `skills.urls` / `skills.paths` | ✅ nativo (listas de URLs) |
| Subagentes | `~/.config/opencode/agents/*.md` | ❌ local → instalar |
| Comandos | `~/.config/opencode/commands/*.md` | ❌ local → instalar |

`manifest.json` es el índice de cada artefacto y la fuente de verdad que usan los scripts.

## 1. Reglas remotas (sin instalar)

Apunta el `opencode.json` de cualquier proyecto a los archivos de reglas de este repo vía
URLs raw:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "https://raw.githubusercontent.com/isaiasnef/opencode-config-toolkit/main/rules/_base.md"
  ]
}
```

## 2. Skills remotas (sin instalar)

```json
{
  "$schema": "https://opencode.ai/config.json",
  "skills": {
    "urls": [
      "https://raw.githubusercontent.com/isaiasnef/opencode-config-toolkit/main/skills"
    ]
  }
}
```

> Sirve una lista separada por coma/nueva línea (`skills-index.json`) si quieres exponer
> un subconjunto curado por equipo.

## 3. Agentes + comandos (instalar)

Los agentes y comandos se descubren solo desde directorios locales, así que se instalan en
la config del usuario. Lo hace `scripts/bootstrap.mjs`:

```bash
node scripts/bootstrap.mjs                # instala TODOS los artefactos
node scripts/bootstrap.mjs agents         # solo agentes
node scripts/bootstrap.mjs commands       # solo comandos
node scripts/bootstrap.mjs --dry-run      # vista previa, sin escribir
```

Lee `manifest.json` y copia cada artefacto a `~/.config/opencode/` respetando su destino
(`agents/`, `commands/`, `skills/`).

## 4. Usar el toolkit en otro proyecto

```bash
# Desde el repo del toolkit
node scripts/generate.mjs --name cart-svc --type backend --out ../cart-svc

# O referencia reglas/skills remotamente como se muestra arriba y solo haz bootstrap de agentes/comandos.
```

## Convenciones

- **Todo dentro del repo.** Los artefactos de config viven en el repo; nada importante
  vive solo en un chat o en un doc.
- **Una sola fuente de verdad** (`manifest.json`); `generate.mjs`/`validate.mjs`/`bootstrap.mjs`
  la leen en vez de hardcodear rutas.
- Versiona el repo; fija `instructions`/`skills.urls` a una etiqueta/rama que controles.