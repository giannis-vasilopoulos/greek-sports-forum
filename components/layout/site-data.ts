import { copy } from "@/lib/copy";

const l = copy.layout;

export const LEAGUES = [
  { slug: "super-league", name: "Super League", emoji: "⚽" },
  { slug: "super-league-2", name: "Super League 2", emoji: "⚽" },
  { slug: "champions-league", name: "Champions League", emoji: "⭐" },
  { slug: "premier-league", name: "Premier League", emoji: "⚽" },
  { slug: "euroleague", name: "Euroleague", emoji: "🏀" },
  { slug: "nba", name: "NBA", emoji: "🏀" },
] as const;

export const NAV_LINKS = [
  { href: "/match-threads", label: l.nav.matchThreads, liveIndicator: true },
  { href: "/standings", label: l.nav.standings, liveIndicator: false },
] as const;

export const FOOTER_INFO_LINKS = [
  { href: "/about", label: l.footer.about },
  { href: "/terms", label: l.footer.terms },
  { href: "/privacy", label: l.footer.privacy },
  { href: "/contact", label: l.footer.contact },
] as const;

export interface FanProfile {
  leagueName: string;
  teamName: string;
  teamEmoji: string;
}

export interface HeaderProps {
  user?: { name: string; image?: string; username?: string };
  activeFanProfile?: FanProfile;
  fanProfiles?: FanProfile[];
  unreadNotifications?: number;
  hasLiveMatches?: boolean;
  leagues?: Array<{ slug: string; name: string; emoji: string }>;
}

export interface NotificationItem {
  id: number;
  text: string;
  time: string;
  actorInitials?: string;
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

export function getLeagueSlug(leagueName: string): string {
  const league = LEAGUES.find((item) => item.name === leagueName);
  return league?.slug ?? leagueName.toLowerCase().replace(/\s+/g, "-");
}

export function getLeagueHref(slug: string): string {
  return `/leagues/${slug}`;
}
