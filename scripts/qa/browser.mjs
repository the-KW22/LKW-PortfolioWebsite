// Shared helper for the QA scripts: launches the Chromium that Playwright already downloaded.
// Usage: BASE_URL=http://localhost:3000 node scripts/qa/axe.mjs
import { chromium } from "playwright-core";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

export const BASE = process.env.BASE_URL ?? "http://localhost:3000";

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH ?? join(homedir(), "AppData", "Local", "ms-playwright");
  if (!existsSync(root)) return undefined;
  const dir = readdirSync(root).filter((d) => d.startsWith("chromium-")).sort().pop();
  if (!dir) return undefined;
  for (const sub of ["chrome-win64/chrome.exe", "chrome-win/chrome.exe", "chrome-linux/chrome", "chrome-mac/Chromium.app/Contents/MacOS/Chromium"]) {
    const p = join(root, dir, sub);
    if (existsSync(p)) return p;
  }
}

export async function launch() {
  return chromium.launch({ executablePath: findChrome(), headless: true });
}
