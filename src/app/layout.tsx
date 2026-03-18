import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { CursorGlow } from "@/components/cursor-glow";
import { SmoothScroll } from "@/components/smooth-scroll";

import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Suraj Singh | Frontend Portfolio",
  description:
    "Frontend and full-stack portfolio for Suraj Singh featuring premium UI engineering, motion systems, and curated production work."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-body text-ink`}>
        <SmoothScroll>
          <CursorGlow />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
