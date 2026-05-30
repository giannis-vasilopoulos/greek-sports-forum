import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { Geist_Mono } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import {
  mockActiveFanProfile,
  mockFanProfiles,
  mockHasLiveMatches,
  mockUnreadNotifications,
  mockUser,
} from "@/components/layout/site-data";

import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ΚΕΡΚΙΔΑ — Greek Sports Forum",
  description: "Η κερκίδα σου για κάθε league",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="el"
      className={`${barlow.variable} ${barlowCondensed.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header
          user={mockUser}
          activeFanProfile={mockActiveFanProfile}
          fanProfiles={mockFanProfiles}
          unreadNotifications={mockUnreadNotifications}
          hasLiveMatches={mockHasLiveMatches}
        />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
