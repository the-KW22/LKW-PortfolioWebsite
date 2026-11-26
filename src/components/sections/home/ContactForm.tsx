"use client";

import { startTransition, useActionState, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { reasonsFor } from "@/content/home";
import { site } from "@/content/site";
import { Magnetic } from "@/components/motion/Magnetic";
import { issueFormToken, sendContact, type ContactState } from "@/lib/contact/actions";
import { validateContact, type FieldErrors } from "@/lib/contact/rules";
import { MIN_FILL_MS } from "@/lib/contact/timing";
import { btnSolid } from "./ui";

interface Values {
  reason: string;
  name: string;
  email: string;
  message: string;
}
const EMPTY = { name: "", email: "", message: "" };
const IDLE: ContactState = { status: "idle" };
const subscribe = () => () => {};
const FIELDS = ["name", "email", "message"] as const;

const fieldCls =
  "w-full border-0 border-b border-[#2e2d3a] bg-transparent py-2.5 text-xl text-ink outline-none transition-colors placeholder:text-mute focus:border-lime focus:shadow-[0_1px_0_0_var(--lime)] aria-[invalid=true]:border-[#ff6b7a]";

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
 * 07 Contact form. Client-side validation for instant feedback, then the `sendContact` Server Action
 * (which re-validates everything). The five states from spec 7.1: default, invalid, submitting,
 * success, error. Success is shown only after the server confirms Resend accepted the message. Fields
 * stay disabled until hydration, so without JS nothing can be submitted (the email link is the fallback).
 */
export function ContactForm() {
  const uid = useId();
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const reasons = reasonsFor(site.availability);
  const [values, setValues] = useState<Values>({ reason: reasons[0]?.id ?? "hi", ...EMPTY });
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [state, formAction, pending] = useActionState(sendContact, IDLE);
  const [acked, setAcked] = useState<ContactState | null>(null);
  const [token, setToken] = useState<{ value: string; at: number } | null>(null);
  const [localFail, setLocalFail] = useState(false);
  const [seen, setSeen] = useState<ContactState>(IDLE);
  const [sending, setSending] = useState(false);
  const statusRef = useRef<HTMLParagraphElement>(null);

  // Adjust state while rendering: clear the message after a confirmed send.
  if (state !== seen) {
    setSeen(state);
    if (state.status === "success") setValues((v) => ({ ...v, ...EMPTY }));
  }

  const loadToken = () =>
    issueFormToken().then(
      (value) => {
        const t = { value, at: performance.now() };
        setToken(t);
        return t;
      },
      () => null,
    );
  useEffect(() => {
    let live = true;
    issueFormToken().then(
      (value) => live && setToken({ value, at: performance.now() }),
      () => {},
    );
    return () => {
      live = false;
    };
  }, []);

  const current: ContactState = state === acked ? IDLE : state;
  const serverErrors: FieldErrors = current.status === "invalid" ? current.errors : {};
  const shownErrors: FieldErrors = { ...serverErrors, ...clientErrors };
  const busy = pending || sending;
  const status: "idle" | "submitting" | "success" | "error" = busy
    ? "submitting"
    : localFail
      ? "error"
      : current.status === "success"
        ? "success"
        : current.status === "error"
          ? "error"
          : "idle";

  // Move focus to the status message when a result arrives (or to the first bad field).
  useEffect(() => {
    if (state.status === "idle") return;
    if (state.status === "invalid") {
      const first = FIELDS.find((k) => state.errors[k]);
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
    } else {
      statusRef.current?.focus();
      if (state.status === "error" && state.reason === "expired") void loadToken();
    }
  }, [state, uid]);
  useEffect(() => {
    if (localFail) statusRef.current?.focus();
  }, [localFail]);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (k !== "reason" && (clientErrors[k] || serverErrors[k])) setClientErrors((er) => ({ ...er, [k]: undefined }));
    if (state.status !== "idle") setAcked(state);
    setLocalFail(false);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const check = validateContact(values);
    if (!check.ok) {
      setClientErrors(check.errors);
      setAcked(state);
      const first = FIELDS.find((k) => check.errors[k]);
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setClientErrors({});
    setLocalFail(false);
    setSending(true);
    const fd = new FormData(e.currentTarget);
    // Keep "Sending…" visible while we make sure the signed timestamp is old enough (autofill can be fast).
    void (async () => {
      try {
        const t = token ?? (await loadToken());
        if (!t) {
          setLocalFail(true);
          return;
        }
        const wait = MIN_FILL_MS + 400 - (performance.now() - t.at);
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
        fd.set("token", t.value);
        startTransition(() => formAction(fd));
      } finally {
        setSending(false);
      }
    })();
  };

  const invalidCount = Object.values(shownErrors).filter(Boolean).length;
  const err = current.status === "error" ? current.reason : null;
  const mail = (
    <a href={`mailto:${site.email}`} className="underline underline-offset-4">
      {site.email}
    </a>
  );
  return (
    <form noValidate onSubmit={onSubmit} className="relative grid gap-[22px]" aria-label="Contact form">
      {/* Honeypot: off-screen (not display:none, which some bots skip), hidden from assistive tech, not tabbable. */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
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
            maxLength={200}
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
            maxLength={320}
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
            maxLength={6000}
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
        {/* Inline status, announced to assistive tech (spec 7.1) and focused when a result arrives. */}
        <p ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="text-sm outline-none">
          {invalidCount > 0 ? (
            <span className="text-[#ff8a96]">
              {invalidCount === 1 ? "One field needs attention." : `${invalidCount} fields need attention.`}
            </span>
          ) : status === "submitting" ? (
            <span className="text-mute">Sending your message…</span>
          ) : status === "success" ? (
            <span className="text-lime">
              {current.status === "success" && current.dryRun
                ? "Dry run: the form checks passed, but nothing was sent (local development only)."
                : "Message sent. Thank you, I'll be in touch."}
            </span>
          ) : status === "error" ? (
            <span className="text-[#ff8a96]">
              {err === "rate-limited"
                ? "You've sent several messages recently, so this one was not sent. Please try again later, or email me at "
                : err === "expired"
                  ? "This form has been open for a long time, so nothing was sent. Please press send again, or email me at "
                  : err === "unavailable"
                    ? "The form isn't available right now, so nothing was sent. Please email me at "
                    : "Something went wrong, so nothing was sent. Please try again, or email me at "}
              {mail}.
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
