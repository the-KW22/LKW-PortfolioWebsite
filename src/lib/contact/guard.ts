import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/** Server-only anti-spam helpers: signed form-render timestamp, honeypot, IP hashing, rate-limit decision. */

import { MIN_FILL_MS } from "./timing.ts";
export { MIN_FILL_MS };
export const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export function isHoneypotFilled(v: unknown): boolean {
  return typeof v === "string" ? v.trim().length > 0 : v != null;
}

function sig(ts: string, secret: string): string {
  return createHmac("sha256", secret).update(`contact:${ts}`).digest("hex");
}

/** Token handed to the browser when the form renders: "<ms timestamp>.<hmac>". */
export function signToken(now: number, secret: string): string {
  const ts = String(now);
  return `${ts}.${sig(ts, secret)}`;
}

export type TokenCheck = "ok" | "invalid" | "tooFast" | "expired";
export function verifyToken(token: unknown, secret: string, now: number): TokenCheck {
  if (typeof token !== "string") return "invalid";
  const [ts, mac, extra] = token.split(".");
  if (!ts || !mac || extra !== undefined || !/^\d{10,15}$/.test(ts)) return "invalid";
  const a = Buffer.from(mac);
  const b = Buffer.from(sig(ts, secret));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return "invalid";
  const age = now - Number(ts);
  if (age < MIN_FILL_MS) return "tooFast"; // also covers timestamps from the future
  if (age > MAX_AGE_MS) return "expired";
  return "ok";
}

/** The raw IP is never used as a key or stored: only this salted hash. */
export function hashIp(ip: string, secret: string): string {
  return createHash("sha256").update(`${secret}:${ip}`).digest("hex").slice(0, 32);
}

export interface Limiter {
  name: string;
  limit(key: string): Promise<{ success: boolean }>;
}
/** Runs limiters in order and stops at the first one that refuses. */
export async function decideRate(limiters: Limiter[], key: string): Promise<{ allowed: true } | { allowed: false; blockedBy: string }> {
  for (const l of limiters) {
    const r = await l.limit(key);
    if (!r.success) return { allowed: false, blockedBy: l.name };
  }
  return { allowed: true };
}

/**
 * In-memory sliding-window limiter, used only when Upstash is not configured. Per server instance, resets
 * on restart/cold start. `global` ignores the key (one shared bucket, for the whole-site cap).
 */
export function memoryLimiter(name: string, max: number, windowMs: number, global = false, now: () => number = Date.now): Limiter {
  const hits = new Map<string, number[]>();
  return {
    name,
    async limit(key) {
      const t = now();
      const k = global ? "all" : key;
      const recent = (hits.get(k) ?? []).filter((x) => t - x < windowMs);
      if (recent.length >= max) {
        hits.set(k, recent);
        return { success: false };
      }
      recent.push(t);
      hits.set(k, recent);
      if (hits.size > 5000) for (const [kk, v] of hits) if (v.every((x) => t - x >= windowMs)) hits.delete(kk);
      return { success: true };
    },
  };
}
