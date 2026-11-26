import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";

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

/** Class names that define the three font CSS variables. Shared by the site layout and global-not-found. */
export const fontVariables = [interTight.variable, instrumentSerif.variable, jetbrainsMono.variable].join(" ");
