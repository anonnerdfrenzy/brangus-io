import type { Metadata, Viewport } from "next";
import { Fraunces, Lora, Caveat } from "next/font/google";
import "./affirmr.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "affirmr — words of affirmation, when your mind goes blank",
  description:
    "For when your partner's love language is words of affirmation but you go quiet under stress. Get specific, genuine affirmations tailored to the moment.",
};

export const viewport: Viewport = {
  themeColor: "#f4ece0",
};

export default function AffirmrLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${fraunces.variable} ${lora.variable} ${caveat.variable} affirmr-root`}>
      {children}
    </div>
  );
}
