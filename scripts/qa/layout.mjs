// Layout/overflow at 375, 768, 1280, 1920; hero canvas per profile; reduced-motion state; JS weight of the home route.
import { BASE, launch } from "./browser.mjs";
import { mkdirSync } from "node:fs";

const OUT = process.env.SHOTS ?? "";
if (OUT) mkdirSync(OUT, { recursive: true });
const browser = await launch();
const routes = ["/", "/projects", "/projects/coreex", "/projects/moonwave", "/nope"];
let bad = 0;

console.log("## Horizontal overflow and canvas");
for (const w of [375, 768, 1280, 1920]) {
  for (const route of routes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 812 : 900 }, hasTouch: w < 500, isMobile: w < 500 });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(BASE + route, { waitUntil: "load" });
    await page.waitForTimeout(2800);
    const r = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
      canvas: document.querySelectorAll("canvas").length,
      wide: [...document.querySelectorAll("body *")].filter((e) => { const b = e.getBoundingClientRect(); return b.right > innerWidth + 2 && b.width > 0 && getComputedStyle(e).position !== "fixed" && !e.closest("[data-lenis-prevent-wheel],.overflow-x-auto,[class*=overflow]"); }).slice(0, 3).map((e) => e.tagName + "." + String(e.className).slice(0, 50)),
    }));
    const flag = r.sw > r.cw + 1;
    if (flag) bad++;
    console.log(`${String(w).padStart(4)} ${route.padEnd(18)} scrollW ${r.sw}/${r.cw} ${flag ? "OVERFLOW " + r.wide.join(",") : "ok"} canvas:${r.canvas}${errors.length ? "  ERRORS: " + errors.slice(0, 2).join(" | ") : ""}`);
    if (OUT) await page.screenshot({ path: `${OUT}/${route.replace(/\W+/g, "_")}-${w}.png`, fullPage: false });
    await ctx.close();
  }
}

console.log("\n## Reduced motion (emulated prefers-reduced-motion: reduce), desktop 1280");
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => ({
    preload: document.documentElement.hasAttribute("data-preload"),
    preloaderShown: getComputedStyle(document.getElementById("preloader")).display !== "none",
    lenis: document.documentElement.classList.contains("lenis"),
    canvas: document.querySelectorAll("canvas").length,
    bodyCursor: getComputedStyle(document.body).cursor,
    cursorDots: [...document.querySelectorAll("[data-cursor-ring],[data-cursor-dot],#cursor")].filter((e) => getComputedStyle(e).display !== "none").length,
    runningAnimations: document.getAnimations().filter((a) => a.playState === "running").map((a) => a.animationName || a.constructor.name).slice(0, 8),
    hiddenInitial: [...document.querySelectorAll("main *")].filter((e) => getComputedStyle(e).opacity === "0" && e.getBoundingClientRect().width > 0 && !e.closest("[aria-hidden=true]")).length,
  }));
  console.log(r);
  // Scroll through the page and make sure scroll-driven text ends visible and the ring/atlas fall back.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(40); }
  const after = await page.evaluate(() => ({
    dimmed: [...document.querySelectorAll("[data-unit]")].filter((e) => parseFloat(getComputedStyle(e).opacity) < 1).length,
    transformedUnits: [...document.querySelectorAll("[data-unit]")].filter((e) => getComputedStyle(e).transform !== "none").length,
    atlasView: document.querySelector("#projects")?.querySelectorAll("ol a").length + " list links",
    ringTiles: document.querySelectorAll("[data-tile]").length,
  }));
  console.log("after full scroll:", after);
  // Warp: click a project, make sure there is no warp overlay animating (navigates directly).
  await page.evaluate(() => window.scrollTo(0, 0));
  await ctx.close();
}

console.log("\n## JavaScript weight of / (desktop and phone), production build");
for (const [label, vp, mobile] of [["desktop 1280", { width: 1280, height: 800 }, false], ["phone 375", { width: 375, height: 812 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  const files = new Map();
  page.on("response", async (res) => {
    const u = res.url();
    if (!/\.js(\?|$)/.test(u)) return;
    try { const b = await res.body(); files.set(u, { raw: b.length, enc: Number(res.headers()["content-length"] ?? b.length) }); } catch {}
  });
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForTimeout(1500);
  const atLoad = [...files.values()].reduce((a, f) => a + f.raw, 0);
  await page.waitForTimeout(3500);
  for (let y = 0; y < 6000; y += 800) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(150); }
  const total = [...files.values()].reduce((a, f) => a + f.raw, 0);
  const big = [...files.entries()].sort((a, b) => b[1].raw - a[1].raw).slice(0, 5).map(([u, f]) => `${(f.raw / 1024).toFixed(0)}KB ${u.split("/").pop().slice(0, 30)}`);
  console.log(`${label}: JS at load ${(atLoad / 1024).toFixed(0)} KB raw (${files.size} files), after scroll ${(total / 1024).toFixed(0)} KB; largest: ${big.join("; ")}`);
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
