# Estándares de diseño — OpenCode Configuration Toolkit

Convenciones para autorar una configuración de OpenCode **limpia, organizada y eficiente**:
`AGENTS.md`, agentes personalizados, skills y slash commands. Agnóstica de proyecto.

Destilada de referencias maduras: la guía de autoría de Agent Skills de Anthropic,
`superpowers:writing-skills`, `addyosmani/agent-skills` y `wshobson/agents`
(un marketplace multi-harness con destino a OpenCode).

---

## 1. Principios (que nunca se violan)

1. **El archivo de configuración es un índice, no una enciclopedia.**
   Mantén `AGENTS.md` por debajo de ~150 líneas. El detalle vive en `docs/`, `references/`
   o el `references/` de una skill — se carga bajo demanda.
2. **El repo es la fuente de verdad.** Si no está en el repo, el agente no puede verlo.
   Nada de hilos de Slack, ni Notion, ni conocimiento solo local.
3. **Impón invariantes, no implementación.** La forma del frontmatter, el nombrado y las
   frases disparadoras se validan mecánicamente (`validate.mjs`). El estilo y el tono
   dentro de esos límites son tu decisión.
4. **Tecnología aburrida.** Markdown + frontmatter YAML + scripts pequeños. Sin DSL, sin
   motores de plantillas, sin marcado específico de harness en el código fuente.

## 2. Convenciones por artefacto

### 2.1 `AGENTS.md`

- Núcleo conciso con secciones: propósito, precedencia, referencias externas, stack,
  reglas (MUST/MUST-NOT), arquitectura y comandos de verificación.
- **Carga perezosa del detalle**: referencia `@docs/<topic>.md` e instruye al agente a
  `Read` solo cuando la tarea toca esa área.
- Declara la **precedencia** explícitamente cuando existan AGENTS.md anidados (las reglas
  del sub-proyecto ganan a las de la raíz).
- Termina con **MUST ASK triggers** — las decisiones no cubiertas por las reglas deben
  preguntarse.

### 2.2 Agentes personalizados (`.opencode/agents/<name>.md`)

Forma del archivo (preferida sobre config en línea):

```markdown
---
description: Una frase: quién es este agente y cuándo delegarle.
mode: subagent            # primary | subagent | all
model: anthropic/claude-sonnet-5
permission:
  edit: deny
  bash:
    "git status*": allow
    "*": ask
---

Eres un <rol>. ... (prompt del sistema — el cuerpo es el prompt)
```

- **El cuerpo es el prompt.** Nunca pongas `prompt:` en el frontmatter.
- Una responsabilidad por agente. Ponle nombre por lo que hace.
- **Menor privilegio**: deniega por defecto, permite la mínima superficie de herramientas.
- **Nivel de modelo** según tarea: `opus` para revisión/seguridad/arquitectura; `sonnet`
  para trabajo complejo balanceado; `haiku` para tareas rápidas y deterministas; `inherit`
  para diferir.
- Usa **nombres únicos globales** (`<scopes>-role`) para evitar colisiones.

### 2.3 Skills (`skills/<name>/SKILL`)

Frontmatter requerido:

```yaml
---
name: validating-skills            # kebab-case, minúsculas, coincide con la carpeta
description: Use when <condiciones y venenos>.  # 3.ª person, ≤1024 chars
---
```

**Reglas de `description` (Optimización de descubrimiento de skills):**
- `description` = **cuándo** usarlo, **no** qué hace.
- Empieza con `Use when ...` / `Úsalo cuando ...`. En 3.ª persona. ≤1024 chars; apunta a ≤500.
- Pone al frente palabras clave de trigger concretas: mensajes de error, síntomas, nombres
  de herramientas.
- **Nunca resumas el workflow de la skill** — los agentes toman la descripción como atajo.

**Nombrar:** primero el verbo / gerundio. `creating-skills` no `skill-creation`.

**Divulgación progresiva (3 niveles):**
1. **Frontmatter** — nombre + descripción (siempre se carga).
2. **Cuerpo de SKILL.md** — resumen, cuándo usarlo, referencia rápida, errores comunes.
   ≤500 líneas.
3. **`references/` + `assets/`** — material profundo, carga bajo demanda. Mantén las
   referencias **a un solo nivel de profundidad** de SKILL.md.

**Estructura canónica de SKILL.md:**

```markdown
# Skill Name

## Overview            # principio central en 1-2 oraciones (Visión general)
## Cuándo usar         # síntomas + cuándo NO usar
## Referencia rápida   # tabla para escanear
## Implementación      # código en línea o enlace a references/
## Errores comunes     # lo que sale mal + correcciones
## Trampas              # patrones de fallo para blindar
```

**Grados de libertad:** iguala la especificidad a la fragilidad — alta libertad (orientación),
media (receta parametrizada), baja (comando exacto, sin modificación).

### 2.4 Comandos slash (`.commands/<name>.md`)

```markdown
---
description: Una frase que describe lo que hace el comando.
agent: build
---

(cuerpo del comando = el prompt, con $ARGUMENTS / $1 / $2)
```

- `template` es el cuerpo; **no** agregues una clave `template:` en el frontmatter.
- Usa `$ARGUMENTS` para texto libre; `$1`, `$2` para argumentos posicionales.
- Mantén los nombres consistentes con cualquier skill relacionada (evita colisiones de
  nombres skill/comando).

## 3. Iguala la forma al fallo

Elige la forma de la guía según el **fallo base** observado:

| Fallo base | Forma correcta |
|------------------|-----------|
| Viola una regla bajo presión (lo sabe, aun así lo hace) | Prohibición + tabla de racionalización + señales de alerta |
| Cumple pero la salida tiene la forma incorrecta | Receta positiva / contrato (define lo que SÍ es la salida) |
| Omita un elemento requerido | Estructural: espacio REQUERIDO en una plantilla |
| El comportamiento depende de una condición | Condicional sobre un predictor observable |

**Reglas para cualquier forma:**
- **Sin cláusulas de matiz** ("no hagas X salvo que importe") — reabren negociación.
- Las cláusulas de exención no acotan; reformula para que la regla no pueda llegar a la
  parte exenta.
- Blindea las skills de disciplina con una **tabla de racionalización** y una lista de
  **banderas rojas**.

## 4. Anti-patterns

- Narración tipo historia en lugar de técnica reutilizable.
- Dilución con demasiados ejemplos en varios idiomas (un ejemplo excelente gana cinco mediocres).
- Fuerza-load `@` de referencias (consume contexto) — usa `**REQUIRED:** <skill>`.
- Rutas a la Windows; usa barras diagonales en todas partes.
- Demasiadas opciones sin default; da un default + una puerta de entrada.
- "Constantes vudú" — justifica los valores de configuración.
- Scripts de utilidad que le tiran el trabajo al agente en vez de manejar errores.

## 5. Terminología e higiene

- Terminología consistente dentro de una skill (elige un término por concepto).
- Sin instrucciones sensibles al tiempo; si algo cambia, pon el comportamiento viejo en una
  sección "patrones antiguos".
- Un ejemplo excelente y concreto por patrón.

## 6. Checklist de autoría (por artefacto)

- [ ] La forma del frontmatter cuadra con el esquema (`name`+`description` presentes)
- [ ] La `description` = condiciones de disparo, "Use when ..." / "Úsalo cuando ...", 3.ª persona, keywords
- [ ] Cuerpo de `SKILL.md` < 500 líneas; el detalle en `references/` (un solo nivel)
- [ ] Las referencias > 100 líneas tienen una tabla de contenido
- [ ] La forma de la guía coincide con el tipo de fallo (ver §3)
- [ ] Sin anti-patroles de §4
- [ ] Los workflows tienen pasos claros + puerta de verificación
- [ ] ≥3 evaluaciones/chequeos escritos antes de finalizar (ver quality-model.md)