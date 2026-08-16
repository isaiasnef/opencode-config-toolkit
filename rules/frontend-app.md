# AGENTS.md — Frontend app

Blueprint para una web frontend guiada por estándares.

## Identidad
- Tipo: **frontend app** (React, Vue, Svelte, o server-rendered).
- Tooling bake: elegido por proyecto (Vite/Next), mantente aburrido — quédate con la toolchain que el equipo ya usa.

## Modelo de trabajo
- Coloca los componentes juntos; una sola fuente de verdad para el estado; progressive enhancement primero.
- Accesibilidad && rendimiento son parte de la definición de terminación.

## Must / Must-not
- DEBES usar APIs/contratos tipados; valida antes de renderizar.
- DEBES mantener componentes pequeños y cohesivos; extrae hooks/composables cuando la lógica se repite 2+ veces.
- DEBES renderizar declarativamente; nunca mutar el modelo desde los templates.
- NO DEBES dejar secretos en el bundle del cliente (env vars solo para config de runtime no secreta).
- NO DEBES agregar deps nuevas sin una necesidad explícita.

## Verifica antes de terminar
```bash
npm run lint && npm test && npm run build
```

## Notas
- SSOT de rutas/componentes = el propio manifest; actualiza el manifest al agregar pantallas.