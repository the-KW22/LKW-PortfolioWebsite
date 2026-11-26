// REDUCED=1 emulates prefers-reduced-motion (settled, non-animated state). Runs axe-core (WCAG 2.0/2.1 A and AA plus best practices) on the key routes at two widths.
import AxeBuilder from "@axe-core/playwright";
import { BASE, launch } from "./browser.mjs";

const routes = ["/", "/projects", "/projects/coreex", "/projects/petcare", "/resume", "/nope"];
const widths = [{ w: 1280, h: 800 }, { w: 375, h: 812 }];
const browser = await launch();
let total = 0;
for (const { w, h } of widths) {
  for (const route of routes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: process.env.REDUCED ? "reduce" : "no-preference" });
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: "load" });
    await page.waitForTimeout(3500); // preloader + intro animations
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
    console.log(`\n## ${route} @${w}: ${r.violations.length} violations, ${r.incomplete.length} needs-review, ${r.passes.length} passes`);
    for (const v of r.violations) {
      total += v.nodes.length;
      console.log(`- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);
      for (const n of v.nodes.slice(0, 4)) console.log(`    ${n.target.join(" ")}\n      ${n.failureSummary?.split("\n").slice(0, 3).join(" | ")}`);
    }
    for (const v of r.incomplete) console.log(`  ? needs review: ${v.id} (${v.nodes.length}) ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" ; ")}`);
    await ctx.close();
  }
}
await browser.close();
console.log(`\nTOTAL violating nodes: ${total}`);
process.exit(total ? 1 : 0);
