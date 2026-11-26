/** Pure, dependency-free contact-form rules. Shared by the browser (instant feedback) and the Server Action (the real check). */

export const REASONS = {
  role: "A full-time role",
  freelance: "Freelance",
  custom: "A custom build",
  hi: "Just saying hi",
} as const;
export type ReasonId = keyof typeof REASONS;

export const LIMITS = { nameMin: 2, nameMax: 80, emailMax: 254, messageMin: 10, messageMax: 4000 } as const;

export interface ContactValues {
  reason: ReasonId;
  name: string;
  email: string;
  message: string;
}
export type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;
export type ValidationResult = { ok: true; values: ContactValues } | { ok: false; errors: FieldErrors };

// Control characters other than tab/newline (and all of them for single-line fields).
const CTRL_ANY = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g;
const CTRL_MULTILINE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u2028\u2029]/g;

export function normalizeLine(v: unknown): string {
  return typeof v === "string" ? v.normalize("NFC").replace(CTRL_ANY, " ").replace(/\s+/g, " ").trim() : "";
}
export function normalizeMessage(v: unknown): string {
  return typeof v === "string"
    ? v.normalize("NFC").replace(/\r\n?/g, "\n").replace(CTRL_MULTILINE, "").replace(/\n{3,}/g, "\n\n").trim()
    : "";
}

// Deliberately simple: one @, no spaces, a dot in the domain, sane lengths.
const EMAIL_RE = /^[^\s@,;<>()"]{1,64}@[^\s@,;<>()"]+\.[^\s@,;<>()"]{2,}$/;
export function isEmail(v: string): boolean {
  return v.length <= LIMITS.emailMax && EMAIL_RE.test(v);
}

export function isReason(v: unknown): v is ReasonId {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(REASONS, v);
}

export function validateContact(input: { reason?: unknown; name?: unknown; email?: unknown; message?: unknown }): ValidationResult {
  const name = normalizeLine(input.name);
  const email = normalizeLine(input.email);
  const message = normalizeMessage(input.message);
  const errors: FieldErrors = {};
  if (name.length < LIMITS.nameMin) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.nameMax) errors.name = `Please keep your name under ${LIMITS.nameMax} characters.`;
  if (!isEmail(email)) errors.email = "Please enter a valid email address.";
  if (message.length < LIMITS.messageMin) errors.message = "Please write a few words (at least 10 characters).";
  else if (message.length > LIMITS.messageMax) errors.message = `Please keep your message under ${LIMITS.messageMax} characters.`;
  const reason = isReason(input.reason) ? input.reason : null;
  if (Object.keys(errors).length > 0 || !reason) return { ok: false, errors };
  return { ok: true, values: { reason, name, email, message } };
}

/** Header-safe subject: no newlines or control characters, bounded length. */
export function sanitizeSubject(s: string): string {
  return s.replace(CTRL_ANY, " ").replace(/\s+/g, " ").trim().slice(0, 120);
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildEmail(v: ContactValues): { subject: string; text: string; html: string } {
  const reason = REASONS[v.reason];
  const subject = sanitizeSubject(`Portfolio contact: ${reason}`);
  const text = `Reason: ${reason}\nName: ${v.name}\nEmail: ${v.email}\n\n${v.message}\n`;
  const html =
    `<p><strong>Reason:</strong> ${escapeHtml(reason)}<br>` +
    `<strong>Name:</strong> ${escapeHtml(v.name)}<br>` +
    `<strong>Email:</strong> ${escapeHtml(v.email)}</p>` +
    `<p style="white-space:pre-wrap">${escapeHtml(v.message)}</p>`;
  return { subject, text, html };
}
