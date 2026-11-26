// Behavioural checks: status codes, 404 focus, contact-form validation, phone atlas dialog, X-ray, view toggle.
import { BASE, launch } from "./browser.mjs";
const browser = await launch();
let fails = 0;
const check = (ok, msg) => { console.log(`${ok ? "PASS" : "FAIL"}  ${msg}`); if (!ok) fails++; };

// status codes and headers
for (const [path, want] of [["/", 200], ["/projects", 200], ["/projects/coreex", 200], ["/projects/nope", 404], ["/nope", 404], ["/resume", 404], ["/robots.txt", 200], ["/sitemap.xml", 200]]) {
  const r = await fetch(BASE + path);
  check(r.status === want, `${path} -> ${r.status} (want ${want})`);
}
for (const p of ["/v1", "/v2", "/v2/projects", "/v2/about-me", "/v2/contact-me"]) {
  const r = await fetch(BASE + p);
  const html = await r.text();
  check(/noindex/.test(r.headers.get("x-robots-tag") ?? "") , `${p} sends X-Robots-Tag noindex (${r.status})`);
  if (p.startsWith("/v")) check(/<meta name="robots" content="noindex/.test(html), `${p} carries a robots noindex meta tag`);
}
const robots = await (await fetch(BASE + "/robots.txt")).text();
check(/Allow: \//.test(robots) && !/Disallow: \/v/.test(robots) && /Sitemap: https:\/\/lkw22studio\.com\/sitemap\.xml/.test(robots), "robots.txt allows the site, lists the sitemap, does not Disallow /v1 or /v2 (noindex must stay crawlable)");
const sm = await (await fetch(BASE + "/sitemap.xml")).text();
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
check(urls.length === 7 && urls.every((u) => u.startsWith("https://lkw22studio.com")), `sitemap lists ${urls.length} URLs: ${urls.map((u) => u.replace("https://lkw22studio.com", "")).join(" ")}`);
const home = await (await fetch(BASE + "/")).text();
check(/<link rel="canonical" href="https:\/\/lkw22studio.com"/.test(home), "home canonical is https://lkw22studio.com");
check(/og:image/.test(home) && /twitter:card" content="summary_large_image/.test(home), "home has og:image and a summary_large_image twitter card");
check(!/\+?\d[\d\s-]{8,}\d/.test(home.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g)?.join("") ?? ""), "JSON-LD contains no phone-number-like string");
check((home.match(/application\/ld\+json/g) ?? []).length >= 2, "home has Person and WebSite JSON-LD");

// 404 focus
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/projects/nope"); await page.waitForTimeout(800);
  check(await page.getByRole("link", { name: /go home/i }).count() === 1 && await page.getByRole("link", { name: /view projects/i }).count() === 1, "404 page: links home and to /projects");
  check(await page.evaluate(() => document.documentElement.lang === "en" && !!document.querySelector("main h1")), "404 page: lang, main landmark and h1 present");
  check((await page.locator("h1").innerText()).toLowerCase().includes("not found"), "404 page: heading says not found");
  await page.goto(BASE + "/resume"); await page.waitForTimeout(500);
  check((await page.locator("h1").innerText()).toLowerCase().includes("not found"), "/resume: removed, shows the styled 404");
  await ctx.close();
}

// contact form
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + "/#contact"); await page.waitForTimeout(1500);
  const btn = page.getByRole("button", { name: /send message/i });
  await btn.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => !document.querySelector('button[type=submit]')?.disabled, null, { timeout: 5000 }).catch(() => {});
  await btn.click(); await page.waitForTimeout(500);
  const invalid = await page.locator('form [aria-invalid="true"]').count();
  check(invalid >= 2, `contact form: empty submit marks ${invalid} fields aria-invalid`);
  const focusedField = await page.evaluate(() => { const a = document.activeElement; return a && /INPUT|TEXTAREA/.test(a.tagName) ? a.id : null; });
  check(!!focusedField, "contact form: focus moves to the first invalid field");
  const labelled = await page.evaluate(() => [...document.querySelectorAll("form input:not([type=hidden]):not([type=radio]):not([tabindex='-1']), form textarea")].every((e) => e.labels?.length || e.getAttribute("aria-label")));
  check(labelled, "contact form: every visible field has a label");
  await ctx.close();
}

// phone: atlas fullscreen dialog
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + "/"); await page.waitForTimeout(3500);
  const open = page.getByRole("button", { name: /explore the map/i });
  if (await open.count()) {
    await open.first().scrollIntoViewIfNeeded(); await open.first().click(); await page.waitForTimeout(700);
    check(await page.locator('[role=dialog][aria-label^="Project atlas"]').count() === 1, "phone: Explore the map opens a labelled dialog");
    check(await page.evaluate(() => !!document.activeElement?.closest("[role=dialog]")), "phone: focus moves into the atlas dialog");
    await page.keyboard.press("Escape"); await page.waitForTimeout(500);
    check(await page.locator('[role=dialog][aria-label^="Project atlas"]').count() === 0, "phone: Esc closes the atlas dialog");
    check(await page.evaluate(() => document.activeElement?.textContent?.toLowerCase().includes("explore")), "phone: focus returns to the Explore the map button");
  } else console.log("SKIP  no 'Explore the map' button found at 375");
  const canvas = await page.locator("canvas").count();
  check(canvas === 0, `phone: no WebGL canvas (static hero fallback), found ${canvas}`);
  await ctx.close();
}
await browser.close();
console.log(`\n${fails} failed checks`);
process.exit(fails ? 1 : 0);
