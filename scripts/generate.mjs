#!/usr/bin/env node
/**
 * Genera una config de OpenCode conforme al estándar en un proyecto destino.
 *
 * Uso:
 *   node scripts/generate.mjs --name <service> --type <backend|frontend|data-pipeline> \
 *     --out <dir> [--with agents,skills,commands] [--dry-run]
 *
 * Lee `scripts/presets/<type>.json` y `rules/<type>.md`; escribe:
 *   AGENTS.md, opencode.json, .opencode/{agents,commands,skills}/
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const get = (k) => {
    const i = argv.indexOf(k);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const ALIASES = { backend: "backend-service", frontend: "frontend-app", data: "data-pipeline" };
  return {
    name: get("--name") || "my-service",
    type: ALIASES[get("--type")] ?? get("--type") ?? "backend-service",
    out: get("--out") || ".",
    with: get("--with") ? get("--with").split(",") : [],
    dryRun: argv.includes("--dry-run"),
  };
}

function loadJson(p) {
  if (!existsSync(p)) throw new Error(`missing file: ${p}`);
  return JSON.parse(readFileSync(p, "utf8"));
}

function copyDir(src, dst) {
  if (!existsSync(src)) return;
  for (const entry of readdirSync(src)) {
    if (entry.startsWith("_template")) continue;
    const s = join(src, entry);
    const d = join(dst, entry);
    if (existsSync(d)) continue;
    copyFileSync(s, d);
  }
}

function main(opts) {
  const presetPath = join(ROOT, "scripts", "presets", `${opts.type}.json`);
  const preset = loadJson(presetPath);
  const rulePath = join(ROOT, "rules", `${opts.type}.md`);
  if (!existsSync(rulePath)) throw new Error(`no rule blueprint for type '${opts.type}'`);

  const out = join(opts.out, opts.name);
  const plan = [
    ["dir", join(out, ".opencode", "agents")],
    ["dir", join(out, ".opencode", "commands")],
    ["dir", join(out, ".opencode", "skills")],
    ["file", join(out, "AGENTS.md"), readFileSync(rulePath, "utf8")],
    ["file", join(out, "opencode.json"), JSON.stringify({
      $schema: "https://opencode.ai/config.json",
      instructions: ["./AGENTS.md"],
      permission: { edit: "allow", bash: { "*": "ask" } },
    }, null, 2) + "\n"],
  ];

  console.log(`generando '${opts.name}' (${opts.type}) → ${join(opts.out, opts.name)}`);
  for (const step of plan) {
    if (step[0] === "dir") {
      if (opts.dryRun) { console.log(`  [dry] mkdir ${step[1]}`); continue; }
      mkdirSync(step[1], { recursive: true });
    } else {
      if (opts.dryRun) { console.log(`  [dry] write ${step[1]}`); continue; }
      mkdirSync(dirname(step[1]), { recursive: true });
      writeFileSync(step[1], step[2]);
    }
  }

  if (opts.with.length) {
    for (const kind of opts.with) {
      const src = join(ROOT, kind);
      const dst = join(out, ".opencode", kind);
      if (opts.dryRun) { console.log(`  [dry] copy ${src} → ${dst}`); continue; }
      mkdirSync(dst, { recursive: true });
      copyDir(src, dst);
    }
  }

  console.log("listo. valida con: node scripts/validate.mjs " + out);
}

main(parseArgs(process.argv.slice(2)));