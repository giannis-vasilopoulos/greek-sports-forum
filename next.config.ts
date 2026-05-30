import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
const adsProvider = process.env.NEXT_PUBLIC_ADS_PROVIDER;
const adsenseCsp =
  isProduction && adsProvider === "adsense"
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

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          ...adsenseCsp,
        ],
      },
    ];
  },
};

export default nextConfig;
