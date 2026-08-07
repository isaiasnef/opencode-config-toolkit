#!/usr/bin/env node
/**
 * Validate an OpenCode configuration against the quality model (docs/quality-model.md).
 *
 * Usage:
 *   node scripts/validate.mjs [target] [--strict] [--format json]
 *
 * Exit codes:
 *   0  pass
 *   1  errors found / warnings in --strict
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
    report("error", "frontmatter", "missing required 'name' or 'description'", file);
  }
  const desc = meta.description || "";
  if (desc.length > DESC_LIMIT) {
    report("error", "description", `description is ${desc.length} chars (>${DESC_LIMIT})`, file);
  }
  if (desc && !/Use when|Use this skill|Use proactively|Trigger when/i.test(desc)) {
    report("warning", "description", "description lacks a 'Use when ...' trigger phrase", file);
  }
  const lines = text.split("\n").length;
  if (lines > BODY_LIMIT) {
    report("warning", "file-size", `body is ${lines} lines (>${BODY_LIMIT}); split into references/`, file);
  }
  if (!/Common Mistakes|Gotchas|failure patterns|Anti-pattern/i.test(text)) {
    report("warning", "gotchas", "missing a 'Common Mistakes'/'Gotchas' section", file);
  }
  if (lines >= 250 && !existsSync(join(dirname(file), "references"))) {
    report("warning", "structure", "large SKILL.md has no references/ directory", file);
  }
}

function checkAgentCommand(file, text, kind) {
  const { meta } = splitFrontmatter(text);
  if (!meta.description) {
    report("error", "frontmatter", `${kind} missing required 'description'`, file);
  }
  if (kind === "agent" && !meta.mode && !meta.model && !meta.permission) {
    report("warning", "structure", "agent is missing mode/model/permission hints", file);
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
        report("error", "conflicts", `duplicate name '${meta.name}' (also in ${seen.get(meta.name)})`, file);
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
    console.log(`score: ${score}/100  ·  ✗ ${errors} errors  ·  ⚠ ${warns} warnings`);
    for (const f of findings) {
      console.log(`  [${f.severity}][${f.rule}] ${f.message}`);
      console.log(`    → ${f.file}`);
    }
    if (!findings.length) console.log("  ✓ clean");
  }

  const ok = errors === 0 && !(opts.strict && warns > 0);
  process.exit(ok ? 0 : 1);
}

main(parseArgs(process.argv.slice(2)));