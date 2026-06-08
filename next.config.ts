import { resolve } from "node:path";

import { config as loadEnv } from "dotenv";
import type { NextConfig } from "next";

// next.config is evaluated before Next loads .env* — mirror Next precedence for logo CDN host.
const root = process.cwd();
loadEnv({ path: resolve(root, ".env") });
loadEnv({ path: resolve(root, ".env.local"), override: true });

const isProduction = process.env.NODE_ENV === "production";
const adsProvider = process.env.NEXT_PUBLIC_ADS_PROVIDER;
const needsGoogleCsp =
  isProduction &&
  (adsProvider === "adsense" ||
    Boolean(process.env.NEXT_PUBLIC_GA4_ID?.trim()));
const googleCsp = needsGoogleCsp
  ? [
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.googletagmanager.com https://www.google-analytics.com",
          "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
          "img-src 'self' data: https: blob:",
          "connect-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.google-analytics.com https://www.googletagmanager.com",
          "style-src 'self' 'unsafe-inline'",
        ].join("; "),
      },
    ]
  : [];

function logoImageConfig(): Pick<NextConfig, "images"> {
  const publicUrl = process.env.LOGO_CDN_PUBLIC_URL?.trim();
  if (!publicUrl) return {};

  try {
    const { hostname, protocol } = new URL(publicUrl);
    const scheme = protocol.replace(":", "") as "https" | "http";
    return {
      images: {
        remotePatterns: [
          {
            protocol: scheme,
            hostname,
            pathname: "/**",
          },
        ],
      },
    };
  } catch {
    return {};
  }
}

const nextConfig: NextConfig = {
  ...logoImageConfig(),
  logging: {
    browserToTerminal: true,
    fetches: {
      fullUrl: true,
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          ...googleCsp,
        ],
      },
    ];
  },
};

export default nextConfig;
