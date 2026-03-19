import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeToggle } from "@/components/theme-toggle";
import { absoluteUrl, siteConfig } from "@/lib/site";

import "@fontsource-variable/manrope";
import "@fontsource-variable/space-grotesk";
import "./globals.css";

const themeScript = `
(() => {
  try {
    const storageKey = "suraj-portfolio-theme-v2";
    const storedTheme = window.localStorage.getItem(storageKey);
    const theme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "light";
    window.localStorage.removeItem("theme");
    document.documentElement.dataset.theme = theme;
  } catch (error) {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  abstract: siteConfig.abstract,
  applicationName: siteConfig.shortName,
  keywords: [...siteConfig.keywords],
  authors: [{ name: "Suraj Singh", url: siteConfig.links.github }],
  referrer: "origin-when-cross-origin",
  creator: "Suraj Singh",
  publisher: "Suraj Singh",
  classification: siteConfig.classification,
  formatDetection: {
    email: true,
    telephone: true,
    address: false,
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: ["/logo.png"],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.shortName,
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    alternateLocale: ["en_US"],
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    title: siteConfig.name,
    description: siteConfig.description,
    countryName: siteConfig.country,
    emails: [siteConfig.contact.email],
    phoneNumbers: [siteConfig.contact.phoneDisplay],
    images: [
      {
        url: absoluteUrl(siteConfig.ogImage),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [absoluteUrl("/twitter-image")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: siteConfig.category,
  other: {
    "geo.region": siteConfig.region,
    "geo.country": siteConfig.country,
    "geo.placename": siteConfig.country,
    "contact:email": siteConfig.contact.email,
    "contact:phone_number": siteConfig.contact.phoneDisplay,
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": siteConfig.shortName,
    "msapplication-TileColor": "#ffe45e",
    "ai-focus":
      "AI-powered applications, AI systems, AI product engineering, scalable web platforms",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffe45e" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="font-body text-ink">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SmoothScroll>
          {children}
          <ThemeToggle />
        </SmoothScroll>
      </body>
    </html>
  );
}
