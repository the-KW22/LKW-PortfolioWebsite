---
type: feature
updated: 2026-11-27
sources: [raw/sessions/2026-11-27-ver3-redesign-build.md]
---
# Contact form (ver 3.0)

UI in `src/components/sections/home/ContactForm.tsx` (reason chips: full-time role, freelance, custom build, just saying hi; name, email, message). Logic in `src/lib/contact/` (`actions.ts`, `rules.ts`, `guard.ts`, `timing.ts`, tests in `contact.test.ts`).

## How it sends
A Server Action (`useActionState`) validates on the server and sends one email with Resend to the owner. `reply_to` is the visitor's email; the subject is "Portfolio contact: <reason>" with newlines stripped; the body is plain text plus escaped HTML. Message bodies and visitor emails are never logged or stored. Success shows only after Resend accepts the message.

## Spam guards
Hidden honeypot field (a filled one returns the normal success shape and sends nothing); signed fill-time token (rejects submits under 3 seconds, asks to resend after 2 hours); rate limit per hashed IP: 3/hour, 6/day, and 40/day for the whole site. The limiter is Upstash if both Upstash vars are set, otherwise an in-memory per-instance limiter (best effort, resets on cold starts). If a configured Upstash store errors, the form fails closed.

## Environment variable names (values live only in `.env.local` and Vercel)
- Required: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`.
- Optional: `CONTACT_FROM_EMAIL` (default sender `LKW22 Studio Contact <onboarding@resend.dev>`), `CONTACT_FORM_SECRET` (derived from the Resend key if unset), `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (set both or neither), `CONTACT_DRY_RUN=1` (development only, ignored in production).
- `.env.example` lists names only; other `.env*` files are git-ignored.

## Resend rules to remember
- An unverified Resend account can only send to the email address the account is registered with, so `CONTACT_TO_EMAIL` must match it until a domain is verified.
- The sender cannot be the visitor's address (it must be on a verified domain); hence `reply_to`.
- Use a Sending-access API key. Verifying `lkw22studio.com` is optional and lifts the recipient limit.

## No keys
Missing required vars give a calm "the form isn't available, nothing was sent, email me" message and one server log line naming the missing variables; it never claims success.

## Status
Verified with no keys and in dev dry-run, 13 unit tests pass. A real send and Vercel env vars are still to do ([[open-follow-ups]]). Related: [[ver3-redesign]], [[ver3-owner-decisions]].
