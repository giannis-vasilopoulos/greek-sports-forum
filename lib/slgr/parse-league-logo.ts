import * as cheerio from "cheerio";

import { SLGR_BASE_URL } from "@/lib/slgr/constants";

function toAbsoluteUrl(src: string): string {
  if (src.startsWith("http")) return src;
  return `${SLGR_BASE_URL}${src.startsWith("/") ? src : `/${src}`}`;
}

export function parseSlgrLeagueLogo(html: string): string | null {
  const $ = cheerio.load(html);
  const src = $("header .logo img.logo_img").first().attr("src")?.trim();

  if (!src) {
    throw new Error("SLGR league logo: no header logo parsed from HTML");
  }

  return toAbsoluteUrl(src);
}
