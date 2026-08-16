---
name: organize-config
description: Úsalo cuando estructura o limpies un directorio de configuración de OpenCode para mantenerlo DRY, de fuente única y amigable con la divulgación progresiva.
---

# Organizar una Configuración de OpenCode

Mantén una config **limpia, DRY y de fuente única** entre AGENTS.md, agentes, skills y
comandos. Ver `docs/design-standards.md §1` para los principios.

## Cuándo usar
- Montar el layout `.opencode/` de un proyecto nuevo
- Limpiar una config que creció desordenada o duplicada
- Revisar el layout antes de distribuirlo a un equipo

## Principios
1. **Archivo de config = índice.** `AGENTS.md` < ~150 líneas; detalle → `docs/`/`references/`.
2. **Una sola fuente de verdad.** Un artefacto se define una vez; todo lo demás lo referencia.
3. **Componible, no empaquetado.** Unidades granulares que puedes mezclar; instala solo lo necesario.
4. **Divulgación progresiva.** Metadata → cuerpo principal → `references/`/`assets/` bajo demanda.

## Layout (objetivo)
```
AGENTS.md                      # reglas concisas + referencias lazy-load
opencode.json                  # $schema + permisos + instrucciones remotas
.opencode/
├── agents/                    # un archivo por agente
├── commands/                  # un archivo por slash command
└── skills/<name>/SKILL.md     # una carpeta por skill (+ references/ si se necesita)
docs/                          # detalle lazy-load
```

## Movimientos de refactor
- **Extrae**: saca el detalle de `AGENTS.md` a `docs/<topic>.md`, referenciado con `@`.
- **Divide**: un `SKILL.md` > 500 líneas → divídelo en `references/` a un solo nivel.
- **Dedup**: skills/triggers superpuestos → combina o cruza-referencia, nunca dupliques.
- **Alinea**: los nombres de skills y sus slash commands no deben colisionar (renombra uno).

## Errores comunes
- Duplicar la misma regla en AGENTS.md y en una skill
- Una skill/agente monolítico que hace cinco cosas (rompe la composabilidad)
- Olvidar actualizar `manifest.json` al agregar/quitar un artefacto

## Verificación
`node scripts/validate.mjs <target>` pasa; la estructura coincide con el layout de arriba;
ningún artefacto está definido en más de un lugar.