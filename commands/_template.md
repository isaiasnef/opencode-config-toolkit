---
description: Copia este blueprint para autorar un nuevo slash command de OpenCode. Úsalo cuando crees una definición de `.opencode/commands/<name>.md`.
agent: build
---

# <Nombre del comando> — blueprint de comando

> Reemplaza los placeholders. Reglas: `docs/design-standards.md §2.4`.

## Frontmatter (pega en `.opencode/commands/<name>.md`)

```markdown
---
description: <una frase que describa qué hace el comando.>
agent: <build|plan|general|custom-agent>
model: <provider/model (opcional)>
---
```

## Cuerpo (se convierte en el prompt/el template)

```markdown
# Task
<qué logra este comando>

# Pasos
1. <paso 1>
2. <paso 2>
3. <paso 3>

# Inputs
- $ARGUMENTS  <todo lo que sigue al nombre del comando>
- $1, $2      <argumentos posicionales>

# Salida / Definición de terminación
<qué cuenta como terminado>
```

## Checklist
- [ ] `description` presente (se muestra en la paleta de slash)
- [ ] Cuerpo no vacío y establece los inputs vía `$ARGUMENTS`/`$1`
- [ ] El nombre no colisiona con una skill de la misma intención
- [ ] Valida con `node scripts/validate.mjs <archivo-del-comando>`