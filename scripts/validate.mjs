#!/usr/bin/env node
/**
 * Valida una configuración de OpenCode contra el quality model (docs/quality-model.md).
 *
 * Uso:
 *   node scripts/validate.mjs [target] [--strict] [--format json]
 *
 * Códigos de salida:
 *   0  pasar
 *   1  errores encontrados / warnings en --strict
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

const BODY_LIMIT = 500;
const DESC_LIMIT = 1024;

function parseArgs(argv) {
  return {
    target: argv.find((a) => !a.startsWith("--")) || ".",
    strict: argv.includes("--strict"),
    format: argv.indexOf("--format") >= 0 ? argv[argv.indexOf("--format") + 1] : "text",
  };
}

function splitFrontmatter(text) {
  if (!text.startsWith("---")) return { meta: {}, body: text };
  const close = text.indexOf("\n---", 4);
  if (close < 0) return { meta: {}, body: text };
  const raw = text.slice(4, close);
  const meta = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: text.slice(close + 4) };
}

function classify(path) {
  if (path.endsWith("SKILL.md")) return "skill";
  if (/(^|\/)(agents?|\.opencode\/agents)\//.test(path.replace(/\\/g, "/"))) return "agent";
  if (/(^|\/)(commands?|\.opencode\/commands)\//.test(path.replace(/\\/g, "/"))) return "command";
  return "regular-md";
}

function collect(path) {
  const stat = statSync(path);
  if (stat.isFile()) return [path];
  const out = [];
  const walk = (dir, root) => {
    for (const entry of readdirSync(dir)) {
      if (root && [".git", "node_modules", "dist", "build"].includes(entry)) continue;
      const p = join(dir, entry);
      const s = statSync(p);
      if (s.isDirectory()) walk(p, root);
      else if (s.isFile()) out.push(p);
    }
  };
  walk(path, true);
  return out;
}

const findings = [];
function report(severity, rule, message, file) {
  findings.push({ severity, rule, message, file });
}

function checkSkill(file, text) {
  const { meta, body } = splitFrontmatter(text);
  if (!meta.name || !meta.description) {
    report("error", "frontmatter", "faltan los campos requeridos 'name' o 'description'", file);
  }
  const desc = meta.description || "";
  if (desc.length > DESC_LIMIT) {
    report("error", "description", `la description tiene ${desc.length} caracteres (>${DESC_LIMIT})`, file);
  }
  if (desc && !/Use when|Use this skill|Use proactively|Trigger when|Úsalo cuando|Usa cuando|Activa cuando|Útil cuando/i.test(desc)) {
    report("warning", "description", "la description no tiene una frase disparadora 'Use when ...'/'Úsalo cuando ...'", file);
  }
  const lines = text.split("\n").length;
  if (lines > BODY_LIMIT) {
    report("warning", "file-size", `el cuerpo tiene ${lines} líneas (>${BODY_LIMIT}); divide en references/`, file);
  }
  if (!/Common Mistakes|Gotchas|failure patterns|Anti-pattern|Errores comunes|Patrones de fallo|Banderas rojas/i.test(text)) {
    report("warning", "gotchas", "falta una sección 'Common Mistakes'/'Gotchas' o de patrones de fallo", file);
  }
  if (lines >= 250 && !existsSync(join(dirname(file), "references"))) {
    report("warning", "structure", "SKILL.md grande sin directorio references/", file);
  }
}

function checkAgentCommand(file, text, kind) {
  const { meta } = splitFrontmatter(text);
  if (!meta.description) {
    report("error", "frontmatter", `${kind} sin la 'description' requerida`, file);
  }
  if (kind === "agent" && !meta.mode && !meta.model && !meta.permission) {
    report("warning", "structure", "el agente no tiene pistas de mode/model/permission", file);
  }
}

function main(opts) {
  const files = collect(opts.target);
  const seen = new Map();
  for (const file of files) {
    const kind = classify(file);
    if (kind === "regular-md") continue;
    const text = readFileSync(file, "utf8");
    if (kind === "skill") checkSkill(file, text);
    else checkAgentCommand(file, text, kind);
    const { meta } = splitFrontmatter(text);
    if (meta.name) {
      if (seen.has(meta.name)) {
        report("error", "conflicts", `nombre duplicado '${meta.name}' (también en ${seen.get(meta.name)})`, file);
      } else {
        seen.set(meta.name, file);
      }
    }
  }

  const errors = findings.filter((f) => f.severity === "error").length;
  const warns = findings.filter((f) => f.severity === "warning").length;
  const score = Math.max(0, Math.round(100 - (errors * 6 + warns * 2)));

  if (opts.format === "json") {
    process.stdout.write(JSON.stringify({ target: opts.target, score, errors, warnings: warns, findings }) + "\n");
  } else {
    console.log(`\ntarget: ${opts.target}`);
    console.log(`score: ${score}/100  ·  ✗ ${errors} errores  ·  ⚠ ${warns} warnings`);
    for (const f of findings) {
      console.log(`  [${f.severity}][${f.rule}] ${f.message}`);
      console.log(`    → ${f.file}`);
    }
    if (!findings.length) console.log("  ✓ limpio");
  }

  const ok = errors === 0 && !(opts.strict && warns > 0);
  process.exit(ok ? 0 : 1);
}

main(parseArgs(process.argv.slice(2)));