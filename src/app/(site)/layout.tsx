import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
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
import { ConsoleHello } from "@/components/shell/ConsoleHello";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { SITE_URL as siteUrl } from "@/content/site";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/seo";


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07070a",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_TITLE,
    template: "%s | Leow Kai Wen",
  },
  description: SITE_DESCRIPTION,
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
    siteName: SITE_NAME,
    locale: "en_MY",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
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
        fontVariables,
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

        <ConsoleHello />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
