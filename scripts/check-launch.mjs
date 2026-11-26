#!/usr/bin/env node
// Launch gate: lists everything that must be resolved before lkw22studio.com serves ver 3.0.
// Run `npm run check:launch`. Exits 1 while anything remains. Deliberately NOT part of `npm run build`.
// Flags: --verbose prints every hit, not only the first few per file.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const verbose = process.argv.includes("--verbose");
const rel = (p) => relative(root, p).split(sep).join("/");

function* walk(dir, skip = () => false) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (skip(rel(p))) continue;
    if (statSync(p).isDirectory()) yield* walk(p, skip);
    else yield p;
  }
}

const archived = (r) => r.startsWith("src/app/v2") || r.startsWith("public/v1") || r.startsWith("public/v2");
const CODE = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".md", ".mdx"]);
const TEXT = new Set([".txt", ".html", ".json", ".svg", ".xml", ".webmanifest", ".md"]);

// Remove comments so docs that merely mention a marker are not counted as unfinished work.
function stripComments(src) {
  return src
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1");
}

// Components that DEFINE the markers or render them only while content is still flagged. Their hits
// disappear on their own once the content is final, so they are not counted.
// (CaseHero and Placeholder show "TODO(owner)" / "Screenshot coming" only for content that is still unfinished.)
const MACHINERY = new Set([
  "src/components/case/TodoText.tsx",
  "src/components/case/CaseHero.tsx",
  "src/components/case/Placeholder.tsx",
  "src/components/xray/XrayFrame.tsx",
  "src/content/types.ts",
]);

const findings = { content: [], code: [], placeholders: [], publicText: [] };
const MARKER = /TODO\(owner\)|\bDRAFT\b/;

// 1. Content files: every marker, including trailing `// DRAFT` comments and `draft: true` flags.
for (const f of walk(join(root, "src/content"))) {
  const r = rel(f);
  if (!CODE.has(extname(f)) || MACHINERY.has(r)) continue;
  const lines = readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    if (r.endsWith("/media.ts")) return; // helper that defines placeholderMedia/isTodo
    if (MARKER.test(line) || /\bdraft:\s*true\b/.test(line)) findings.content.push({ file: r, line: i + 1, text: line.trim() });
    if (/placeholderMedia\(/.test(line) && !/^\s*(\/\/|\*)/.test(line)) findings.placeholders.push({ file: r, line: i + 1, text: line.trim() });
  });
}

// 2. Components and app code (not the archived /v2): markers that survive comment stripping,
//    i.e. text that could reach a visitor.
for (const dir of ["src/components", "src/app", "src/lib", "src/hooks"]) {
  for (const f of walk(join(root, dir), archived)) {
    const r = rel(f);
    if (!/\.(tsx?|css|mdx?)$/.test(f) || MACHINERY.has(r) || /\.test\.ts$/.test(f)) continue;
    stripComments(readFileSync(f, "utf8")).split(/\r?\n/).forEach((line, i) => {
      if (MARKER.test(line) || /Screenshot coming/.test(line) && !/^\s*[*{]/.test(line))
        findings.code.push({ file: r, line: i + 1, text: line.trim() });
    });
  }
}

// 3. Public text files (not v1, v2, project images/videos).
for (const f of walk(join(root, "public"), (r) => archived(r) || r.startsWith("public/images/") || r.startsWith("public/video"))) {
  if (!TEXT.has(extname(f))) continue;
  readFileSync(f, "utf8").split(/\r?\n/).forEach((line, i) => {
    if (MARKER.test(line) || /Screenshot coming/.test(line)) findings.publicText.push({ file: rel(f), line: i + 1, text: line.trim().slice(0, 120) });
  });
}

// 4. The CV file behind /resume.
const resumeOk = existsSync(join(root, "public/resume.pdf"));

// ---- report
const perFile = (list) => {
  const m = new Map();
  for (const h of list) m.set(h.file, [...(m.get(h.file) ?? []), h]);
  return m;
};
function show(title, list, hint) {
  console.log(`\n${list.length ? "✗" : "✓"} ${title}: ${list.length}${hint && list.length ? "  (" + hint + ")" : ""}`);
  for (const [file, hits] of perFile(list)) {
    console.log(`    ${file}  ×${hits.length}`);
    for (const h of verbose ? hits : hits.slice(0, 2)) console.log(`      ${h.line}: ${h.text.slice(0, 110)}`);
    if (!verbose && hits.length > 2) console.log(`      … ${hits.length - 2} more (run with --verbose)`);
  }
}

console.log("LAUNCH GATE: ver 3.0 (lkw22studio.com)");
show("TODO(owner) / DRAFT markers in src/content", findings.content, "owner facts and copy approvals (Phase 7 pass)");
show("Markers that can reach visitors from components/app code", findings.code);
show("Screenshot placeholders (\"Screenshot coming\") in project content", findings.placeholders, "supply screenshots in public/images/projects/<slug>/");
show("Markers in public text files", findings.publicText);
console.log(`\n${resumeOk ? "✓" : "✗"} CV file at public/resume.pdf: ${resumeOk ? "found" : "missing; /resume shows the \"on request\" page and the CV buttons are hidden"}`);

const total = findings.content.length + findings.code.length + findings.placeholders.length + findings.publicText.length + (resumeOk ? 0 : 1);
console.log(`\n${total ? `NOT READY: ${total} item${total === 1 ? "" : "s"} remaining.` : "READY: nothing left to resolve."}`);
process.exit(total ? 1 : 0);
