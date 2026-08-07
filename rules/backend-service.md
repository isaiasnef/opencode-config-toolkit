# herders/deploy
# AGENTS.md — Backend service

Blueprint for a standards-driven backend service. Copy/adapt this into any project
that needs API-first, contract-driven development.

## Identity
- Type: **backend service** (HTTP API, integration adapter, worker).
- Language/runtime: **Java 21+** LTS · Quarkus or Spring (choose per project) · Maven Wrapper per project.
- Config: **YAML** only; externalize with `${ENV_VAR:default}` via MicroProfile/Spring Config. Never hardcode secrets in code or non-repo `.env` files.

## Working model
- Implement **Enterprise Integration Patterns (EIP)** where applicable: routeName by operation, onException global at top of `configure()`.
- Follow this repo's conventions; do not invent new stack.

## Must / Must Not
- Must validate payloads **only** via schema validators (json-validator, xml-schema, schematron).
- Must style as Java `record` + Jakarta validation for requests/responses.
- Must keep `onException(Throwable.class)` global near the top of `configure()`.
- Must transform data only declaratively via `.xslt()`, `.jsonata()`, `.transform()` — not in `.process()`/`.bean()`.
- Must use zero hardcoded config in Java — property holders in config + `${ENV_VAR:default}`.
- Must write tests with Maven Wrapper, black-box HTTP and `@QuarkusTest`, then `verify`.
- Must NOT aggregate dependencies "just in case"; scope every dependency.
- Must NOT remove infra deps (health, metrics, tracing, SonarQube) without instruction.

## Architecture
- Package `io.{project}.{artifactId}`:
  - `route/` — entry points + orchestration + global onException.
  - `dispatch/` — routing table SSOT (enums) when multiple operations.
  - `template/` — reusable RouteTemplate when pattern repeats 2+ ops.
  - `subroute/` — ad-hoc non-reusable fragments via `direct:`.
  - `policy/`, `timer/`, `config/`, `shared/` — as needed (only when 2+ consumers).

## Verify before finishing
```bash
./mvnw test
./mvnw verify
```

## Notes
- Source of truth for operations = dispatch enums; add operation = add enum row + schema + transforms, never touch `route/`.