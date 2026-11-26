import { test } from "node:test";
import assert from "node:assert/strict";
import { validateContact, sanitizeSubject, escapeHtml, buildEmail, normalizeMessage } from "./rules.ts";
import { signToken, verifyToken, isHoneypotFilled, hashIp, decideRate, memoryLimiter, MIN_FILL_MS, MAX_AGE_MS, type Limiter } from "./guard.ts";

const good = { reason: "freelance", name: "  Jane   Tan ", email: " jane@company.com ", message: "Hello there, a project idea." };

test("valid input is trimmed and normalised", () => {
  const r = validateContact(good);
  assert.ok(r.ok);
  if (r.ok) assert.deepEqual(r.values, { reason: "freelance", name: "Jane Tan", email: "jane@company.com", message: "Hello there, a project idea." });
});
test("rejects bad fields and unknown reason", () => {
  const r = validateContact({ reason: "x", name: "J", email: "nope", message: "short" });
  assert.ok(!r.ok);
  if (!r.ok) assert.deepEqual(Object.keys(r.errors).sort(), ["email", "message", "name"]);
  assert.ok(!validateContact({ ...good, reason: "__proto__" }).ok);
  assert.ok(!validateContact({ ...good, reason: undefined }).ok);
});
test("rejects header-injection style emails and oversize input", () => {
  assert.ok(!validateContact({ ...good, email: "a@b.com\nBcc: x@y.com" }).ok);
  assert.ok(!validateContact({ ...good, email: "a@b.com, c@d.com" }).ok);
  assert.ok(!validateContact({ ...good, message: "x".repeat(4001) }).ok);
  assert.ok(!validateContact({ ...good, name: 5 as unknown }).ok);
});
test("message keeps newlines, drops control chars", () => {
  assert.equal(normalizeMessage("a\r\nb\u0000c\n\n\n\nd"), "a\nbc\n\nd");
});
test("subject has no newlines and is bounded", () => {
  const s = sanitizeSubject("Portfolio contact: x\r\nBcc: evil@x.com" + "y".repeat(500));
  assert.ok(!/[\r\n]/.test(s));
  assert.ok(s.length <= 120);
  const e = buildEmail({ reason: "hi", name: "A\nB".replace("\n", " "), email: "a@b.co", message: "m" });
  assert.equal(e.subject, "Portfolio contact: Just saying hi");
});
test("html is escaped", () => {
  assert.equal(escapeHtml(`<a href="x">&'</a>`), "&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;");
  const e = buildEmail({ reason: "hi", name: "<b>x</b>", email: "a@b.co", message: "<script>alert(1)</script>" });
  assert.ok(!e.html.includes("<script>") && !e.html.includes("<b>"));
  assert.ok(e.text.includes("<script>")); // plain text is not escaped
});

test("honeypot", () => {
  assert.ok(!isHoneypotFilled("") && !isHoneypotFilled("  ") && !isHoneypotFilled(null));
  assert.ok(isHoneypotFilled("http://spam"));
});
test("token timing: too fast, ok, expired, forged", () => {
  const S = "test-secret";
  const t0 = 1_800_000_000_000;
  const tok = signToken(t0, S);
  assert.equal(verifyToken(tok, S, t0 + 100), "tooFast");
  assert.equal(verifyToken(tok, S, t0 + MIN_FILL_MS), "ok");
  assert.equal(verifyToken(tok, S, t0 + MAX_AGE_MS + 1), "expired");
  assert.equal(verifyToken(tok, "other", t0 + MIN_FILL_MS), "invalid");
  assert.equal(verifyToken(`${t0 - 999999}.${tok.split(".")[1]}`, S, t0 + MIN_FILL_MS), "invalid"); // timestamp tampered
  assert.equal(verifyToken("", S, t0), "invalid");
  assert.equal(verifyToken(undefined, S, t0), "invalid");
  assert.equal(verifyToken(signToken(t0 + 60_000, S), S, t0), "tooFast"); // future
});
test("ip hash is stable, salted and does not contain the ip", () => {
  const h = hashIp("203.0.113.9", "s");
  assert.equal(h, hashIp("203.0.113.9", "s"));
  assert.notEqual(h, hashIp("203.0.113.9", "s2"));
  assert.ok(!h.includes("203"));
});

function fake(name: string, max: number): Limiter & { calls: string[] } {
  const hits = new Map<string, number>();
  const calls: string[] = [];
  return {
    name,
    calls,
    async limit(key) {
      calls.push(key);
      const n = (hits.get(key) ?? 0) + 1;
      hits.set(key, n);
      return { success: n <= max };
    },
  };
}
test("rate limit decisions with a mocked store", async () => {
  const hour = fake("hour", 3);
  const day = fake("day", 5);
  const ls = [hour, day];
  for (let i = 0; i < 3; i++) assert.deepEqual(await decideRate(ls, "ip1"), { allowed: true });
  assert.deepEqual(await decideRate(ls, "ip1"), { allowed: false, blockedBy: "hour" });
  assert.equal(day.calls.length, 3); // day limiter not consumed once hour refuses
  assert.deepEqual(await decideRate(ls, "ip2"), { allowed: true }); // other client unaffected
});
test("daily cap blocks when hourly allows", async () => {
  const ls = [fake("hour", 10), fake("day", 2)];
  await decideRate(ls, "k");
  await decideRate(ls, "k");
  assert.deepEqual(await decideRate(ls, "k"), { allowed: false, blockedBy: "day" });
});

test("in-memory limiter: per-key window, expiry and global cap", async () => {
  let t = 1_000_000;
  const clock = () => t;
  const hour = memoryLimiter("hour", 3, 3_600_000, false, clock);
  const site = memoryLimiter("site", 5, 86_400_000, true, clock);
  for (let i = 0; i < 3; i++) assert.equal((await hour.limit("a")).success, true);
  assert.equal((await hour.limit("a")).success, false);
  assert.equal((await hour.limit("b")).success, true); // other visitor unaffected
  t += 3_600_001;
  assert.equal((await hour.limit("a")).success, true); // window slid
  for (let i = 0; i < 5; i++) assert.equal((await site.limit(`k${i}`)).success, true);
  assert.equal((await site.limit("new")).success, false); // global cap ignores key
});
test("in-memory limiters compose through decideRate", async () => {
  const ls = [memoryLimiter("hour", 3, 3_600_000), memoryLimiter("day", 6, 86_400_000)];
  for (let i = 0; i < 3; i++) assert.deepEqual(await decideRate(ls, "ip"), { allowed: true });
  assert.deepEqual(await decideRate(ls, "ip"), { allowed: false, blockedBy: "hour" });
});
