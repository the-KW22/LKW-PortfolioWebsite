import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import LenisProvider from "@/app/v2/_components/layout/LenisProvider";
import { PageTransitionProvider } from "@/app/v2/_components/layout/PageTransitionProvider";
import { cn } from "@/app/v2/_lib/utils";
import Nav from "@/app/v2/_components/layout/Nav";
import Footer from "@/app/v2/_components/layout/Footer";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});


const chromaSans = localFont({
  src: [
    { path: "../../../public/v2/font/chroma-sans-font/ChromaSans-Thin.otf", weight: "100" },
    { path: "../../../public/v2/font/chroma-sans-font/ChromaSans-ExtraLight.otf", weight: "200" },
    { path: "../../../public/v2/font/chroma-sans-font/ChromaSans-Light.otf", weight: "300" },
    { path: "../../../public/v2/font/chroma-sans-font/ChromaSans-Regular.otf", weight: "400" },
    { path: "../../../public/v2/font/chroma-sans-font/ChromaSans-Medium.otf", weight: "500" },
    { path: "../../../public/v2/font/chroma-sans-font/ChromaSans-Bold.otf", weight: "700" },
    { path: "../../../public/v2/font/chroma-sans-font/ChromaSans-UltraBold.otf", weight: "800" },
    { path: "../../../public/v2/font/chroma-sans-font/ChromaSans-Black.otf", weight: "900" },
  ],
  variable: "--font-chroma",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://leowkaiwen.dev";

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
      { url: "/v2/icons/kw22-logo-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/v2/icons/kw22-logo-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/v2/icons/kw22-logo.ico",
  },
  openGraph: {
    siteName: "Leow Kai Wen Portfolio",
    locale: "en_MY",
    type: "website",
  },
  robots: { index: false, follow: false }, // archived version: keep search engines on the current site
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        nunitoSans.variable,
        chromaSans.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <PageTransitionProvider>
          <Nav />

          <LenisProvider>
            {children}
          </LenisProvider>
          
          <Footer />
        </PageTransitionProvider>

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
