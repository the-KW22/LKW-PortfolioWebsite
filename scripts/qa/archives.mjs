// Archive check: /v1 and /v2 pages load without page errors or failed requests (besides Vercel-only scripts) and stay noindex.
import { BASE, launch } from "./browser.mjs";
const b = await launch();
let bad = 0;
for (const route of ["/v1", "/v2", "/v2/projects", "/v2/about-me", "/v2/contact-me"]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
  p.on("response", (r) => { if (r.status() >= 400 && !r.url().includes("/_vercel/")) errs.push(`${r.status()} ${r.url()}`); });
  p.on("console", (m) => { if (m.type() === "error" && !/_vercel|status of 404/.test(m.text())) errs.push("console: " + m.text().slice(0, 100)); });
  const res = await p.goto(BASE + route, { waitUntil: "load" });
  await p.waitForTimeout(2000);
  const robots = await p.evaluate(() => document.querySelector('meta[name="robots"]')?.content);
  const fonts = await p.evaluate(() => getComputedStyle(document.body).fontFamily.slice(0, 40));
  console.log(`${route.padEnd(14)} ${res.status()} robots="${robots}" header="${res.headers()["x-robots-tag"]}" body font: ${fonts} ${errs.length ? "ERRORS " + errs.join(" | ") : "no errors"}`);
  if (errs.length || !/noindex/.test(robots ?? "")) bad++;
  await ctx.close();
}
await b.close();
process.exit(bad ? 1 : 0);
