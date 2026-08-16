# AGENTS.md — Servicio backend

Blueprint para un servicio backend guiado por estándares. Copia/adapta esto a cualquier proyecto
que necesite desarrollo API-first y dirigido por contratos.

## Identidad
- Tipo: **servicio backend** (API HTTP, adaptador de integración, worker).
- Lenguaje/runtime: **Java 21+** LTS · Quarkus o Spring (elige por proyecto) · Maven Wrapper por proyecto.
- Config: **YAML** solamente; externaliza con `${ENV_VAR:default}` vía MicroProfile/Spring Config. Nunca hardcodees secretos en código ni en archivos `.env` que no estén en el repo.

## Modelo de trabajo
- Implementa **Enterprise Integration Patterns (EIP)** cuando aplique: routeName por operación, `onException` global al inicio de `configure()`.
- Sigue las convenciones de este repo; no inventes un stack nuevo.

## Must / Must Not
- DEBES validar los payloads **solo** con validadores de esquema (json-validator, xml-schema, schematron).
- DEBES modelar como `record` de Java + validación Jakarta para requests/responses.
- DEBES mantener `onException(Throwable.class)` global cerca del inicio de `configure()`.
- DEBES transformar datos solo declarativamente vía `.xslt()`, `.jsonata()`, `.transform()` — no en `.process()`/`.bean()`.
- DEBES usar cero config hardcodeada en Java — property holders en config + `${ENV_VAR:default}`.
- DEBES escribir tests con Maven Wrapper, HTTP black-box y `@QuarkusTest`, y luego `verify`.
- NO DEBES agregar dependencias "por si acaso"; acota cada dependencia.
- NO DEBES quitar deps de infra (health, metrics, tracing, SonarQube) sin instrucción.

## Arquitectura
- Paquete `io.{project}.{artifactId}`:
  - `route/` — puntos de entrada + orquestación + onException global.
  - `dispatch/` — tabla de enrutado SSOT (enums) cuando hay múltiples operaciones.
  - `template/` — RouteTemplate reutilizable cuando el patrón se repite 2+ ops.
  - `subroute/` — fragmentos ad-hoc no reutilizables vía `direct:`.
  - `policy/`, `timer/`, `config/`, `shared/` — según se necesite (solo cuando hay 2+ consumidores).

## Verifica antes de terminar
```bash
./mvnw test
./mvnw verify
```

## Notas
- Fuente de verdad de las operaciones = enums de dispatch; sumar operación = agregar fila de enum + esquema + transforms, nunca tocar `route/`.