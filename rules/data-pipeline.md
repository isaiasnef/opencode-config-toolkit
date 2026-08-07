# AGENTS.md — Data pipeline

Blueprint for batch/near-real-time data flows.

## Identity
- Type: **data pipeline** (ETL/ELT, stream or batch, event-driven).
- Runtime/config: Quarkus or Spark — choose per jobs; YAML config with `${ENV_VAR:default}`.

## Working model
- Prefer declarative transformations (SQL, dbt, Camel DSL) over imperative glue.
- Idempotent by design: upserts + unique keys so re-runs are safe.
- Offline-later / compensating pattern for partial failure.

## Must / Must-not
- Must emit human-observable logs with `traceId` at start (`[traceId][job][START]`) and end (`[DONE]`/`[ERROR]`).
- Must validate with schema validators before writing anywhere.
- Must use at-least-once + dedupe by checkpoint/watermark.
- Must NOT run transforms in ad-hoc scrips that bypass schema validation.
- Must NOT store secrets in config files.

## Verify before finishing
```bash
./mvnw test && ./mvnw verify
```

## Notes
- SSOT for DAG = manifest-like source itself; don't hardcode DAG in code.