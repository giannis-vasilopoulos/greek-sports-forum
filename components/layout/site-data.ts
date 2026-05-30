export const LEAGUES = [
  { slug: "super-league", name: "Super League", emoji: "⚽" },
  { slug: "super-league-2", name: "Super League 2", emoji: "⚽" },
  { slug: "champions-league", name: "Champions League", emoji: "⭐" },
  { slug: "premier-league", name: "Premier League", emoji: "⚽" },
  { slug: "euroleague", name: "Euroleague", emoji: "🏀" },
  { slug: "nba", name: "NBA", emoji: "🏀" },
] as const;

export const NAV_LINKS = [
  { href: "/match-threads", label: "Match Threads", liveIndicator: true },
  { href: "/standings", label: "Βαθμολογίες", liveIndicator: false },
] as const;

export const FOOTER_INFO_LINKS = [
  { href: "/about", label: "Σχετικά με εμάς" },
  { href: "/terms", label: "Όροι χρήσης" },
  { href: "/privacy", label: "Πολιτική απορρήτου" },
  { href: "/contact", label: "Επικοινωνία" },
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
}

export interface NotificationItem {
  id: number;
  text: string;
  time: string;
  actorInitials?: string;
}

export const mockUser = {
  name: "Νίκος Π.",
  username: "GreenEagle_Pao",
  image: undefined,
};

export const mockActiveFanProfile: FanProfile = {
  leagueName: "Super League",
  teamName: "Παναθηναϊκός",
  teamEmoji: "🍀",
};

export const mockFanProfiles: FanProfile[] = [
  mockActiveFanProfile,
  {
    leagueName: "Premier League",
    teamName: "Arsenal",
    teamEmoji: "🔴",
  },
  {
    leagueName: "Euroleague",
    teamName: "Ολυμπιακός",
    teamEmoji: "🔴",
  },
];

export const mockUnreadNotifications = 3;

export const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    text: "Ο GreenArmy22 απάντησε στο post σου",
    time: "2λ",
    actorInitials: "GA",
  },
  {
    id: 2,
    text: "Το post σου πήρε 12 likes",
    time: "15λ",
    actorInitials: "ΚΕ",
  },
  {
    id: 3,
    text: "ΠΑΟΚ vs ΑΕΚ ξεκινά σε 30 λεπτά",
    time: "28λ",
    actorInitials: "ΜΑ",
  },
];

export const mockHasLiveMatches = true;

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
