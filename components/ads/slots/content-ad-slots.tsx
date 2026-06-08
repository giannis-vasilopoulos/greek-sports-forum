import { AdSlot } from "@/components/ads/ad-slot";

/** Drop below thread header when thread detail pages ship. */
export function ThreadTopAd() {
  return <AdSlot id="thread-top" />;
}

/** Drop after first post or every N posts in thread detail. */
export function ThreadInContentAd() {
  return <AdSlot id="thread-in-content" className="my-8" />;
}

/** Sidebar slot for thread/list layouts on lg+ viewports. */
export function ListSidebarAd() {
  return <AdSlot id="list-sidebar" className="hidden lg:block" />;
}

/** Top slot for home and /match-threads feed list. */
export function MatchThreadsTopAd() {
  return <AdSlot id="match-threads-top" className="mb-8" />;
}

/** Mid-list slot between match thread items. */
export function MatchThreadsMidAd() {
  return <AdSlot id="match-threads-mid" className="my-8" />;
}

/** Sidebar slot for league hub pages. */
export function LeagueSidebarAd() {
  return <AdSlot id="league-sidebar" className="hidden lg:block" />;
}

/** Top slot for standings overview and league standings pages. */
export function StandingsTopAd() {
  return <AdSlot id="standings-top" className="mb-6" />;
}

/** Bottom slot after standings table when rows are available. */
export function StandingsBottomAd() {
  return <AdSlot id="standings-bottom" className="mt-8" />;
}
