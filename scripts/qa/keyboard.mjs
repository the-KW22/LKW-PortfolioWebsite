// Keyboard-only pass: Tab order, focus visibility, traps, menu dialog, X-ray key, preloader skip.
import { BASE, launch } from "./browser.mjs";

const browser = await launch();
const problems = [];
const note = (m) => { problems.push(m); console.log("  PROBLEM:", m); };

const describe = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return { tag: "BODY" };
  const cs = getComputedStyle(el);
  const outline = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
  const shadow = cs.boxShadow !== "none";
  const r = el.getBoundingClientRect();
  const cx = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1), cy = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
  return {
    tag: el.tagName, name: (el.getAttribute("aria-label") || el.innerText || el.getAttribute("href") || el.id || "").trim().replace(/\s+/g, " ").slice(0, 40),
    visibleFocus: outline || shadow || el.matches("[data-focus-ok]"), inViewport: r.bottom > 0 && r.top < innerHeight && r.width > 0,
    covered: (() => { const t = document.elementFromPoint(cx, cy); return !!t && t !== el && !el.contains(t) && !t.contains(el); })(),
  };
};

async function tabSequence(page, label, max = 140) {
  const seq = [];
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(300);
    const d = await page.evaluate(describe);
    seq.push(d);
    if (d.tag === "BODY" && i > 3) break; // wrapped out of the document
  }
  console.log(`\n## Tab sequence ${label}: ${seq.length} stops`);
  seq.forEach((d, i) => console.log(`${String(i + 1).padStart(3)} ${d.tag} ${d.name ?? ""}${d.visibleFocus === false ? "  [NO FOCUS STYLE]" : ""}${d.covered ? "  [COVERED]" : ""}`));
  const bad = seq.filter((d) => d.visibleFocus === false);
  if (bad.length) note(`${label}: ${bad.length} stops without visible focus style: ${bad.map((b) => b.name).join(" | ")}`);
  const names = seq.map((d) => `${d.tag}:${d.name}`);
  const dup = names.find((n, i) => names.indexOf(n) !== i && !n.startsWith("BODY"));
  if (dup) console.log(`  (note: repeated stop ${dup})`);
  return seq;
}

// ---- Preloader: a fresh session shows it; a key press must end it quickly
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  const shown = await page.evaluate(() => document.documentElement.hasAttribute("data-preload"));
  console.log(`
Preloader active on first visit: ${shown}`);
  const t0 = Date.now();
  await page.keyboard.press("Tab");
  await page.waitForFunction(() => !document.documentElement.hasAttribute("data-preload"), null, { timeout: 4000 });
  console.log(`Preloader ended ${Date.now() - t0}ms after Tab (exit animation is ~0.9s)`);
  await ctx.close();
}

// ---- Home: repeat visit (no preloader), full Tab sequence
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => sessionStorage.setItem("lkw-preloaded", "1"));
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForTimeout(1500);
  const first = await tabSequence(page, "home 1280", 120);
  if (!/Skip/i.test(first[0].name ?? "")) note("first Tab stop on / is not the skip link: " + first[0].name);

  // ---- Menu dialog
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.focus("#menu-button");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1300);
  const inMenu = await page.evaluate(() => !!document.activeElement?.closest("#site-menu"));
  console.log(`\nMenu opened with Enter; focus inside dialog: ${inMenu}`);
  if (!inMenu) note("menu: focus not moved into dialog on open");
  const seen = new Set();
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press("Tab");
    const id = await page.evaluate(() => { const a = document.activeElement; return (a?.closest("#site-menu") ? "menu:" : a?.id === "menu-button" ? "btn:" : "OUT:") + (a?.textContent || "").trim().slice(0, 20); });
    seen.add(id);
    if (id.startsWith("OUT")) note("menu: focus escaped the dialog to " + id);
  }
  console.log("  menu Tab cycle stops:", [...seen].join(" | "));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  const back = await page.evaluate(() => document.activeElement?.id);
  console.log(`  Esc closed menu; focus returned to: #${back}`);
  if (back !== "menu-button") note("menu: focus did not return to the Menu button");
  await ctx.close();
}

// ---- Projects list and a case study
for (const [route, w] of [["/projects", 1280], ["/projects/coreex", 1280], ["/projects/coreex", 375], ["/nope", 1280]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, reducedMotion: "no-preference" });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "load" });
  await page.waitForTimeout(1800);
  await tabSequence(page, `${route} ${w}`, 60);
  if (route === "/projects/coreex" && w === 1280) {
    // X-ray key
    await page.evaluate(() => document.activeElement?.blur());
    const btn = page.locator('button[aria-pressed]:has-text("X-ray")');
    if (await btn.count()) {
      await page.keyboard.press("x");
      await page.waitForTimeout(400);
      const on = await btn.getAttribute("aria-pressed");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      const off = await btn.getAttribute("aria-pressed");
      console.log(`  X key -> aria-pressed=${on}; Esc -> ${off}`);
      if (on !== "true" || off !== "false") note("X-ray: X / Escape keys did not toggle aria-pressed");
    } else console.log("  (no X-ray toggle on this case study)");
  }
  await ctx.close();
}
await browser.close();
console.log(`\n${problems.length} keyboard problems`);
process.exit(problems.length ? 1 : 0);
