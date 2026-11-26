"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { reasonsFor } from "@/content/home";
import { site } from "@/content/site";
import { Magnetic } from "@/components/motion/Magnetic";
import { btnSolid } from "./ui";

type Status = "idle" | "submitting" | "success" | "error";
interface Values {
  reason: string;
  name: string;
  email: string;
  message: string;
}
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.message.trim().length < 10) e.message = "Please write a few words (at least 10 characters).";
  return e;
}

/**
 * PHASE 8: replace with the Resend server action. Phase 2 sends nothing anywhere: it just waits a
 * moment and reports that sending is not connected yet, so a visitor is never told a message went out.
 */
async function sendMessage(): Promise<{ ok: boolean }> {
  await new Promise((r) => setTimeout(r, 900));
  return { ok: false };
}

const subscribe = () => () => {};
/** PHASE 8: remove. `?form-state=invalid|submitting|success|error` shows a state for design review. */
function usePreviewState(): Status | "invalid" | null {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  const v = new URLSearchParams(search).get("form-state");
  return v === "invalid" || v === "submitting" || v === "success" || v === "error" ? v : null;
}

const fieldCls =
  "w-full border-0 border-b border-[#2e2d3a] bg-transparent py-2.5 text-xl text-ink outline-none transition-colors placeholder:text-[#4b4a5b] focus:border-lime aria-[invalid=true]:border-[#ff6b7a]";

function Field({
  label,
  error,
  id,
  children,
}: {
  label: string;
  error?: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="mono-label text-mute">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="text-[13px] text-[#ff8a96]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * 07 Contact form, UI only (Phase 2). Client-side validation and the five visible states from spec
 * 7.1: default, invalid, submitting, success, error. It does not post data anywhere. The fields are
 * disabled until hydration, so without JS nothing can be submitted (the email link above is the
 * fallback).
 */
export function ContactForm() {
  const uid = useId();
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const preview = usePreviewState();
  const reasons = reasonsFor(site.availability);
  const [values, setValues] = useState<Values>({ reason: reasons[0]?.id ?? "hi", name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const shownStatus: Status = preview && preview !== "invalid" ? preview : status;
  const shownErrors: Errors = preview === "invalid" ? validate({ ...values, name: "", email: "", message: "" }) : errors;
  const busy = shownStatus === "submitting";
  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (k !== "reason" && errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    if (status === "success" || status === "error") setStatus("idle");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const er = validate(values);
    setErrors(er);
    if (Object.keys(er).length > 0) {
      setStatus("idle");
      const first = (["name", "email", "message"] as const).find((k) => er[k]);
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setStatus("submitting");
    const res = await sendMessage();
    setStatus(res.ok ? "success" : "error");
  };

  const invalidCount = Object.values(shownErrors).filter(Boolean).length;
  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-[22px]" aria-label="Contact form">
      <fieldset disabled={!hydrated || busy} className="grid gap-[22px] border-0 p-0">
        <legend className="sr-only">Contact form</legend>
        <div className="grid gap-2">
          <span className="mono-label text-mute" id={`${uid}-reason`}>
            I&apos;m reaching out about
          </span>
          <div role="radiogroup" aria-labelledby={`${uid}-reason`} className="flex flex-wrap gap-2">
            {reasons.map((r) => (
              <span key={r.id} className="relative">
                <input
                  type="radio"
                  name="reason"
                  id={`${uid}-r-${r.id}`}
                  value={r.id}
                  checked={values.reason === r.id}
                  onChange={set("reason")}
                  className="peer sr-only"
                />
                <label
                  htmlFor={`${uid}-r-${r.id}`}
                  className="block cursor-pointer rounded-full border border-[#2e2d3a] px-4 py-2.5 text-sm transition-colors peer-checked:border-violet peer-checked:bg-violet peer-checked:text-[#0b0a12] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-lime hover:border-violet"
                >
                  {r.label}
                </label>
              </span>
            ))}
          </div>
        </div>
        <Field label="Your name" id={`${uid}-name`} error={shownErrors.name}>
          <input
            id={`${uid}-name`}
            name="name"
            autoComplete="name"
            placeholder="Jane Tan"
            value={values.name}
            onChange={set("name")}
            aria-invalid={shownErrors.name ? true : undefined}
            aria-describedby={shownErrors.name ? `${uid}-name-err` : undefined}
            className={fieldCls}
          />
        </Field>
        <Field label="Your email" id={`${uid}-email`} error={shownErrors.email}>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@company.com"
            value={values.email}
            onChange={set("email")}
            aria-invalid={shownErrors.email ? true : undefined}
            aria-describedby={shownErrors.email ? `${uid}-email-err` : undefined}
            className={fieldCls}
          />
        </Field>
        <Field label="Message" id={`${uid}-message`} error={shownErrors.message}>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={3}
            placeholder="Tell me about the project or role"
            value={values.message}
            onChange={set("message")}
            aria-invalid={shownErrors.message ? true : undefined}
            aria-describedby={shownErrors.message ? `${uid}-message-err` : undefined}
            className={`${fieldCls} resize-none`}
          />
        </Field>
      </fieldset>

      <div className="flex flex-wrap items-center gap-5">
        <Magnetic>
          <button type="submit" disabled={!hydrated || busy} className={`${btnSolid} disabled:cursor-not-allowed disabled:opacity-60`}>
            {busy ? "Sending…" : "Send message"} <span aria-hidden="true">{busy ? "" : "→"}</span>
          </button>
        </Magnetic>
        {/* Inline status, announced to assistive tech (spec 7.1). */}
        <p role="status" aria-live="polite" className="text-sm">
          {invalidCount > 0 ? (
            <span className="text-[#ff8a96]">
              {invalidCount === 1 ? "One field needs attention." : `${invalidCount} fields need attention.`}
            </span>
          ) : shownStatus === "submitting" ? (
            <span className="text-mute">Sending your message…</span>
          ) : shownStatus === "success" ? (
            <span className="text-lime">Message sent. Thank you, I&apos;ll be in touch.</span>
          ) : shownStatus === "error" ? (
            <span className="text-[#ff8a96]">
              Sending isn&apos;t connected yet, so nothing was sent. Please email me at{" "}
              <a href={`mailto:${site.email}`} className="underline underline-offset-4">
                {site.email}
              </a>
              .
            </span>
          ) : null}
        </p>
      </div>
      <noscript>
        <p className="text-sm text-mute">
          The form needs JavaScript. Please email me at{" "}
          <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
      </noscript>
    </form>
  );
}
