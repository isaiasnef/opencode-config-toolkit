# AGENTS.md — Frontend app

Blueprint for a standards-driven frontend web app.

## Identity
- Type: **frontend app** (React, Vue, Svelte, or server-rendered).
- Tooling bake: chosen per project (Vite/Next), keep boring — stick to toolchain the team already uses.

## Working model
- Colocate components; single source of truth for state; progressive enhancement first.
- Accessibility && performance are part of definition of done.

## Must / Must-not
- Must use typed APIs/contracts; validate before render.
- Must keep components small and cohesive; extract hooks/composable when logic repeats 2+ times.
- Must render declaratively, never mutate the model from templates.
- Must NOT leave secrets in client bundle (env vars only for non-secret runtime config).
- Must NOT aggregate new deps without explicit need.

## Verify before finishing
```bash
npm run lint && npm test && npm run build
```

## Notes
- SSOT for routes/components = manifest itself; update manifest when adding screens.