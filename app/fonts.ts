import { Fira_Sans_Extra_Condensed, Inter } from "next/font/google";

// `subsets` only controls preloading. Other subsets (latin-ext, greek-ext for
// polytonic) are still self-hosted and load on demand via unicode-range.
// See design-system/kerkida/MASTER.md §3.

/** Inter: all UI and user-generated text. Variable 400–700; opsz gives the tighter H1–H4 cut. */
export const inter = Inter({
  subsets: ["latin", "greek"],
  axes: ["opsz"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Fira Sans Extra Condensed: system text only (scores, scorebug team names,
 * fixed page H1s). Not preloaded: most routes never use it.
 */
export const firaXC = Fira_Sans_Extra_Condensed({
  subsets: ["latin", "greek"],
  weight: ["700", "800"],
  style: ["italic"],
  variable: "--font-fira-xc",
  display: "swap",
  preload: false,
});
