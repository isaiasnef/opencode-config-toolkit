# Quality Model — OpenCode Configuration Toolkit

Cómo **validar** la calidad de una configuración de OpenCode: `AGENTS.md`, agentes
personalizados, skills y comandos. Impulsa la skill `validate-config` y
`scripts/validate.mjs`.

## 1. Niveles de calidad (tres capas)

Evalúa con costo creciente, como una pirámide:

| Nivel | Tipo | Costo | Qué detecta |
|-------|------|------|-----------------|
| **Estático** | Lint estructural determinista | <2s, gratis | Nombrado, frontmatter, forma del archivo |
| **Juez LLM** | Evaluación semántica (N dimensiones) | ~segundos | Calidad del trigger, claridad de la guía |
| **Eval / Monte-Carlo** | Ejecuciones repetidas reales/de escenario | minutos | Si de verdad funciona en uso |

Los archivos estables pasan estático; los ambiguos o de alto riesgo se juzgan; las skills
nuevas reciben evals.

## 2. Reglas de diagnóstico (el núcleo, implementado por `validate.mjs`)

1. **`frontmatter`** — campos requeridos presentes (`name`, `description`).
2. **`description`** — frase disparadora ("Use when"/"Úsalo cuando"), cobertura de keywords,
   ≤1024 chars.
3. **`file-size`** — cuerpo de `SKILL.md` < 500 líneas.
4. **`structure`** — se usan `references/`/`assets/` cuando la skill crece; referencias a un
   solo nivel de profundidad; ToC en archivos largos.
5. **`gotchas`** — la skill tiene una sección de patrones de fallo ("Common mistakes"/"Gotchas").
6. **`allowed-tools`** — restricciones de herramientas acordes al tipo de artefacto
   (análisis / investigación / generación / ejecución / referencia).
7. **`conflicts`** — `name`s duplicados y keywords de disparo superpuestos entre skills;
   colisiones de nombres agent/skill/command.
8. **`portability`** — seguro para OpenCode: nombres de carpeta kebab-case, refs de
   herramientas en minúsculas, forma correcta de `permission`, sin strings de modelo sin
   proveedor.

## 3. Scoring y prescripción

- Calcula un **score 0–100** a través de las reglas aplicables; clasifica el artefacto por
  tipo para ajustar chequeos y expectativas.
- Por cada hallazgo emite una **prescripción**: *por qué importa* + una plantilla lista.
- Comandos: `--dry-run` (vista previa), `--fix` (aplica con respaldo), `--strict`
  (los warnings cuentan como errores), `--format json|md`.

**Códigos de salida:** `0` pasar · `1` errores encontrados · `2` warnings encontrados
(con `--strict`).

## 5. Evaluaciones (eval-first)

Modelado a partir del desarrollo conducente a evaluación de Anthropic:

1. Escribe **evaluaciones antes** de finalizar una skill/agente: tareas representativas que
   ejerciten el comportamiento que quieres.
2. Corre una **línea base** sin el artefacto; documenta fallos / racionalizaciones.
3. Escribe la guía mínima que cierra esos fallos específicos (**RED→GREEN**).
4. Agrega `assertions` de escenario (`contains`, `starts-with`, `matches`, `min-length`…)
   y monitorea **regresiones** al refactorizar.

**La ley de hierro:** ninguna skill/agente sale sin un chequeo que falle primero. Si no
viste fallar a un agente sin ella, no sabes que enseña lo correcto.

## Checklist de cumplimiento

- [ ] `name` + `description` presentes y válidos
- [ ] trigger en la description ("Use when ..."/"Úsalo cuando ..."), 3.ª persona, ≤1024,
      sin resumen del workflow
- [ ] `SKILL.md` < 500 líneas; detalles en `references/` (un solo nivel)
- [ ] ≥3 evaluaciones escritas; línea base observada; los chequeos pasan
- [ ] la forma de la guía coincide con el fallo observado (ver design-standards §3)
- [ ] sin colisiones de nombres/keywords en toda la config
- [ ] verificado contra los modelos/harness objetivo que planeas usar