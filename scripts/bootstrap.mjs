#!/usr/bin/env node
/**
 * Distribuye los artefactos de este toolkit a la config de usuario de OpenCode.
 * Los agentes y comandos se descubren solo desde rutas locales, así que deben
 * instalarse; las skills/reglas pueden quedarse remotas. Copia los artefactos
 * empaquetados a `~/.config/opencode/` para que cualquier proyecto de esta
 * máquina los vea.
 *
 * Fuente de verdad: `manifest.json` (el índice `artifacts`).
 *
 * Uso:
 *   node scripts/bootstrap.mjs [agents|commands|skills|all] [--dry-run]
 */
import { readFileSync, copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEST = join(homedir(), ".config", "opencode");

function parseArgs(argv) {
  const target = argv.find((a) => !a.startsWith("--")) || "all";
  return { target, dryRun: argv.includes("--dry-run") };
}

function manifest() {
  return JSON.parse(readFileSync(join(ROOT, "manifest.json"), "utf8"));
}

// Resuelve las rutas de artefactos de un tipo desde manifest.json.
function artifacts(kind, manifestData) {
  return (manifestData.artifacts[kind] || []).filter((p) => !String(p).includes("_template"));
}

function isDir(p) {
  return statSync(p).isDirectory();
}

function install(kind, paths, dryRun) {
  for (const rel of paths) {
    const src = join(ROOT, rel);
    if (!existsSync(src)) {
      console.warn(`  ! falta ${rel}`);
      continue;
    }
    if (kind === "skills") {
      // manifest lista .../skills/<nombre>/SKILL.md → instala toda la carpeta de la skill
      const skillDir = dirname(src);
      const name = basename(skillDir);
      const dst = join(DEST, "skills", name);
      if (dryRun) {
        console.log(`  [dry] cp ${skillDir} → ${dst}`);
        continue;
      }
      copyDeep(skillDir, dst);
    } else {
      const dst = join(DEST, kind, basename(src));
      if (dryRun) {
        console.log(`  [dry] cp ${rel} → ${dst}`);
        continue;
      }
      mkdirSync(dirname(dst), { recursive: true });
      copyFileSync(src, dst);
    }
  }
}

function copyDeep(src, dst) {
  mkdirSync(dst, { recursive: true });
  statSync(src).isDirectory()
    ? readdirSync(src).forEach((e) => copyDeep(join(src, e), join(dst, e)))
    : copyFileSync(src, dst);
}

const opts = parseArgs(process.argv.slice(2));
const mf = manifest();
const kinds = opts.target === "all" ? ["agents", "commands", "skills"] : [opts.target];

console.log(`instalando config: ${opts.target} → ${DEST}`);
for (const kind of kinds) {
  const list = artifacts(kind, mf);
  console.log(`  ${kind}: ${list.length} artefacto(s)`);
  install(kind, list, opts.dryRun);
}
console.log("listo. reinicia opencode para que los nuevos agentes/comandos/skills se detecten.");