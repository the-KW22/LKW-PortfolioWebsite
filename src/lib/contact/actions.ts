"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { buildEmail, validateContact, type FieldErrors } from "./rules";
import { decideRate, hashIp, isHoneypotFilled, signToken, verifyToken, type Limiter } from "./guard";

export type ContactState =
  | { status: "idle" }
  | { status: "success"; dryRun?: boolean }
  | { status: "invalid"; errors: FieldErrors }
  | { status: "error"; reason: "rate-limited" | "unavailable" | "expired" | "failed" };

const DEV_SECRET = "dev-only-not-a-secret";
const isDev = () => process.env.NODE_ENV === "development";
/** Dry run exists only under `next dev`: NODE_ENV is "production" in build/start, so it cannot be switched on there. */
const isDryRun = () => isDev() && process.env.CONTACT_DRY_RUN === "1";

function missingEnv(): string[] {
  const need = isDryRun()
    ? []
    : ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "CONTACT_FORM_SECRET"];
  return need.filter((k) => !process.env[k]?.trim());
}
function secret(): string | null {
  return process.env.CONTACT_FORM_SECRET?.trim() || (isDev() ? DEV_SECRET : null);
}
let warned = false;
function warnMissing(names: string[]) {
  if (warned) return;
  warned = true;
  console.error(`[contact] Form disabled, missing environment variables: ${names.join(", ")}`);
}

/** Called when the form mounts. The signed timestamp proves how long the form has been on screen. */
export async function issueFormToken(): Promise<string> {
  const s = secret();
  return s ? signToken(Date.now(), s) : "";
}

let limiters: Limiter[] | null = null;
function getLimiters(): Limiter[] {
  if (limiters) return limiters;
  const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! });
  const mk = (name: string, n: number, window: "1 h" | "1 d") =>
    new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(n, window), prefix: `contact:${name}` });
  const [hour, day, site] = [mk("hour", 3, "1 h"), mk("day", 6, "1 d"), mk("site", 40, "1 d")];
  limiters = [
    { name: "hour", limit: (k) => hour.limit(k) },
    { name: "day", limit: (k) => day.limit(k) },
    { name: "site", limit: () => site.limit("all") },
  ];
  return limiters;
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || "unknown";
}

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // 1. Honeypot: bots fill every field. Reply with the normal success shape, send nothing.
  if (isHoneypotFilled(formData.get("website"))) return { status: "success" };

  // 2. Configuration. Never claim success when sending is not possible.
  const missing = missingEnv();
  const sec = secret();
  if (missing.length > 0 || !sec) {
    warnMissing(missing.length > 0 ? missing : ["CONTACT_FORM_SECRET"]);
    return { status: "error", reason: "unavailable" };
  }

  // 3. Signed render timestamp: forged/missing or instant submits are treated as bots (silent).
  const tok = verifyToken(formData.get("token"), sec, Date.now());
  if (tok === "invalid" || tok === "tooFast") return { status: "success" };
  if (tok === "expired") return { status: "error", reason: "expired" };

  // 4. Validate and normalise.
  const v = validateContact({
    reason: formData.get("reason"),
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!v.ok) return { status: "invalid", errors: v.errors };

  if (isDryRun()) return { status: "success", dryRun: true };

  // 5. Rate limit by hashed IP (fails closed: if the store is down, nothing is sent).
  try {
    const decision = await decideRate(getLimiters(), hashIp(await clientIp(), sec));
    if (!decision.allowed) return { status: "error", reason: "rate-limited" };
  } catch {
    console.error("[contact] Rate-limit store unreachable; message not sent.");
    return { status: "error", reason: "unavailable" };
  }

  // 6. Send. Success only after Resend accepts it. Nothing about the visitor or message is logged.
  try {
    const mail = buildEmail(v.values);
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.CONTACT_FROM_EMAIL!,
      to: process.env.CONTACT_TO_EMAIL!,
      replyTo: v.values.email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    if (error) {
      console.error(`[contact] Resend rejected the message (${error.name}).`);
      return { status: "error", reason: "failed" };
    }
    return { status: "success" };
  } catch {
    console.error("[contact] Resend request failed.");
    return { status: "error", reason: "failed" };
  }
}
