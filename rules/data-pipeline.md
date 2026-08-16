# AGENTS.md — Data pipeline

Blueprint para flujos de datos batch o casi en tiempo real.

## Identidad
- Tipo: **data pipeline** (ETL/ELT, stream o batch, event-driven).
- Runtime/config: Quarkus o Spark — elige por job; config YAML con `${ENV_VAR:default}`.

## Modelo de trabajo
- Prefiere transformaciones declarativas (SQL, dbt, Camel DSL) sobre pegamento imperativo.
- Idempotente por diseño: upserts + llaves únicas para que los re-runs sean seguros.
- Patrón offline-later / compensación para fallos parciales.

## Must / Must Not
- DEBES emitir logs observables por humanos con `traceId` al inicio (`[traceId][job][START]`) y al final (`[DONE]`/`[ERROR]`).
- DEBES validar con validadores de esquema antes de escribir en cualquier lado.
- DEBES usar at-least-once + dedupe por checkpoint/watermark.
- NO DEBES ejecutar transformaciones en scripts ad-hoc que evadan la validación de esquema.
- NO DEBES guardar secretos en archivos de config.

## Verifica antes de terminar
```bash
./mvnw test && ./mvnw verify
```

## Notas
- SSOT del DAG = la propia fuente manifest-like; no hardcodees el DAG en el código.