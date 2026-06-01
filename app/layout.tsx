import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { AdsenseScript } from "@/components/ads/adsense-script";
import { ConsentModeBootstrap } from "@/components/ads/consent-mode-bootstrap";
import { Ga4Analytics } from "@/components/ads/ga4-analytics";
import { CookieConsent } from "@/components/ads/cookie-consent";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import {
  mockActiveFanProfile,
  mockFanProfiles,
  mockHasLiveMatches,
  mockUnreadNotifications,
  mockUser,
} from "@/components/layout/site-mock-data";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  OG_LOCALE,
  SITE_NAME,
  TITLE_TEMPLATE,
  TWITTER_SITE,
  getSiteUrl,
} from "@/lib/seo/site";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: DEFAULT_TITLE,
    template: TITLE_TEMPLATE,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: OG_LOCALE,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_SITE,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="el"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ConsentModeBootstrap />
        {/* Mock data — replace when header is wired to Better Auth session / API */}
        <Header
          user={mockUser}
          activeFanProfile={mockActiveFanProfile}
          fanProfiles={mockFanProfiles}
          unreadNotifications={mockUnreadNotifications}
          hasLiveMatches={mockHasLiveMatches}
        />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
        <Ga4Analytics />
        <AdsenseScript />
      </body>
    </html>
  );
}
