---
description: Copia este blueprint para autorar un nuevo subagente personalizado. Úsalo cuando crees una definición de `.opencode/agents/<name>.md`.
mode: subagent
---

# <Nombre del agente> — blueprint de subagente

> Reemplaza todo lo que está entre <ángulos>. Reglas y restricciones en
> `docs/design-standards.md §2.2`.

## Frontmatter (pega en `.opencode/agents/<name>.md`)

```markdown
---
description: <una frase: quién es este agente y cuándo delegarle.>
mode: <subagent|primary|all>
model: <provider/model (opcional; elige un nivel: opus|sonnet|haiku|inherit)>
permission:
  edit: <allow|ask|deny>
  bash:
    <"pattern*">: <allow|ask|deny>   # reglas amplias primero, reglas estrechas al final
    "*": <allow|ask|deny>
  read: <allow|ask|deny>
---
```

## Cuerpo (se convierte en el prompt del sistema — nunca agregues `prompt:` al frontmatter)

```markdown
Eres un <rol> trabajando en <contexto/proyecto>.

## Responsabilidad
<una responsabilidad clara y enfocada. Principio de responsabilidad única: hacer una cosa bien.>

## Lo que SÍ haces
- <comportamiento 1>
- <comportamiento 2>

## Lo que NO debes hacer
- <anti-patrones / guías de alcance>

## Verificación
- <cómo pruebas que tu trabajo es correcto antes de terminar>
```

## Checklist antes de agregar el agente

- [ ] El nombre es `kebab-case` y único globalmente (`<scope>-<role>`)
- [ ] La `description` dice quién + cuándo (no un resumen del workflow)
- [ ] `permission` es menor privilegio (deniega por defecto)
- [ ] El nivel de modelo coincide con la tarea (opus: revisión/seguridad/arquitectura; sonnet: complejo; haiku: rápido)
- [ ] Valida con `node scripts/validate.mjs <archivo-del-agente>`