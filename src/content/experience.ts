import type { ExperienceEntry } from "./types";

// Source: CV v5 (2026-11-19). Generic project names only, never client names.
// The 90% figure must always state its basis (replayed real conversations): spec section 4, 04 Experience.
export const experience: ExperienceEntry[] = [
  {
    id: "nm-media",
    kind: "work",
    role: "Junior Software Developer",
    organisation: "NM Media Sdn. Bhd.",
    period: "May 2026 – Oct 2026",
    points: [],
    projects: [
      {
        id: "ai-auto-reply",
        name: "AI Auto-Reply Platform",
        stack: [
          { name: "Next.js" },
          { name: "TypeScript" },
          { name: "Supabase" },
          { name: "OpenAI API", ai: true },
          { name: "GoHighLevel API" },
          { name: "Zod" },
          { name: "Vitest" },
        ],
        points: [
          "Built a multi-tenant LLM platform that drafts and sends replies to WhatsApp, email, Instagram and Facebook conversations, grounded in each client's own knowledge base.",
          "Designed a multi-step LLM pipeline (reply drafting, confidence scoring and risk evaluation) with server-side gates that auto-send, hold or escalate each reply.",
        ],
        highlights: [
          {
            value: "90%+",
            label: "auto-reply rate on saved real lead conversations replayed through the production model",
          },
        ],
      },
      {
        id: "patient-portal",
        name: "Patient Portal and Clinician Admin",
        stack: [
          { name: "Next.js" },
          { name: "TypeScript" },
          { name: "Supabase" },
          { name: "GoHighLevel API" },
          { name: "Zoom API" },
          { name: "Google Calendar API" },
          { name: "OpenAI API", ai: true },
          { name: "Vercel" },
        ],
        points: [
          "Started and built a production patient portal for intake, health tracking and personalised care guides, used mostly by elderly patients with low digital literacy.",
          "Built online appointment booking from clinicians' Google Calendar availability, with automatic Zoom meetings and scheduled reminders.",
          "Added GPT-4o Vision extraction of health readings from photos, with a review step before saving.",
        ],
        highlights: [{ value: "80+", label: "patients using the portal" }],
      },
      {
        id: "social-media-platform",
        name: "Social Media Management Platform",
        stack: [
          { name: "Next.js" },
          { name: "TypeScript" },
          { name: "Supabase" },
          { name: "Instagram Graph API" },
          { name: "Groq", ai: true },
          { name: "OpenAI API", ai: true },
          { name: "Flask" },
        ],
        points: [
          "Built a multi-account Instagram analytics, scheduling and publishing platform on the Meta Graph API that replaced manual Insights reporting and a third-party scheduler.",
          "Implemented image, carousel and Reel scheduling with a per-minute publishing job, automatic retries and stuck-job recovery.",
          "Added AI content tools: script and caption generation informed by top-performing posts, competitor research and Reel transcription.",
        ],
      },
      {
        id: "marketing-sites",
        name: "SEO Marketing Websites and Blog Admin",
        stack: [
          { name: "Astro" },
          { name: "React" },
          { name: "TypeScript" },
          { name: "Supabase" },
          { name: "Vercel AI Gateway", ai: true },
        ],
        points: [
          "Built two brand marketing sites in an Astro monorepo with a shared Supabase blog backend.",
          "Built an admin area per brand with a rich-text editor, scheduled publishing and AI-assisted content suggestions and cover images.",
        ],
      },
      {
        id: "whatsapp-scheduler",
        name: "WhatsApp Community Scheduler",
        stack: [
          { name: "React" },
          { name: "Vite" },
          { name: "TypeScript" },
          { name: "Fastify" },
          { name: "pg-boss" },
          { name: "Prisma" },
          { name: "Supabase" },
          { name: "Telegram Bot API" },
        ],
        points: [
          "Extended and maintained an internal app that schedules and auto-sends WhatsApp community announcements and webinar reminder campaigns through a job queue.",
          "Added operator alerting and fixed WhatsApp pairing and reconnect failures.",
        ],
      },
    ],
  },
  {
    id: "elite-expo",
    kind: "work",
    role: "IT Intern",
    organisation: "Elite Expo Sdn Bhd",
    period: "Jun 2025 – Dec 2025",
    points: [
      "Managed, maintained and developed exhibition WordPress websites with more than 200 pages.",
      "Developed a WeChat Mini Program to support customer engagement and enquiries.",
      "Ran email marketing campaigns and improved website SEO and performance.",
    ],
  },
  {
    id: "tarumt",
    kind: "education",
    role: "Bachelor of Software Engineering",
    organisation: "Tunku Abdul Rahman University of Management and Technology (TARUMT)",
    period: "2021 – 2025",
    points: [],
  },
];
