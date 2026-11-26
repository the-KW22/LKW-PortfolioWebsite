import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ShellProvider } from "@/components/shell/ShellProvider";
import { ScrollProvider } from "@/components/motion/ScrollProvider";
import { WarpProvider } from "@/components/warp/WarpProvider";
import { Preloader } from "@/components/shell/Preloader";
import { Cursor } from "@/components/shell/Cursor";
import { Header } from "@/components/shell/Header";
import { Menu } from "@/components/shell/Menu";
import { PageFrame, SkipLink } from "@/components/shell/PageFrame";
import { Footer } from "@/components/shell/Footer";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { SITE_URL as siteUrl } from "@/content/site";

// ver 3.0 fonts (design spec section 2). Mapped to Tailwind in globals.css:
// font-display (Inter Tight), font-serif (Instrument Serif), font-mono (JetBrains Mono).
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Leow Kai Wen — Full Stack Developer",
    template: "%s | Leow Kai Wen",
  },
  description:
    "Portfolio of Leow Kai Wen, a fresh graduate Full Stack Developer from Kuala Lumpur, Malaysia.",
  keywords: [
    "Full Stack Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Kuala Lumpur",
    "Malaysia",
    "Junior Developer",
    "Web Developer",
    "Software Engineer",
  ],
  authors: [{ name: "Leow Kai Wen", url: siteUrl }],
  creator: "Leow Kai Wen",
  icons: {
    icon: [
      { url: "/icons/kw22-logo-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/kw22-logo-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/icons/kw22-logo.ico",
  },
  openGraph: {
    siteName: "Leow Kai Wen Portfolio",
    locale: "en_MY",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Runs before first paint. Decides whether the preloader shows: first visit of the session only,
// never with reduced motion, never on direct hits to /projects/*. Without JS it never runs, and the
// overlay stays display:none, so the page is never blocked.
const PRELOAD_SCRIPT = `try{var d=document.documentElement;if(!sessionStorage.getItem("lkw-preloaded")&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&location.pathname.indexOf("/projects/")!==0){d.setAttribute("data-preload","1");sessionStorage.setItem("lkw-preloaded","1")}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        interTight.variable,
        instrumentSerif.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: PRELOAD_SCRIPT }} />
        <ShellProvider>
          <ScrollProvider>
            <WarpProvider>
            <Preloader />
            <Cursor />
            <SkipLink />
            <Header />
            <Menu />
            <PageFrame footer={<Footer />}>{children}</PageFrame>
            </WarpProvider>
          </ScrollProvider>
        </ShellProvider>

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
