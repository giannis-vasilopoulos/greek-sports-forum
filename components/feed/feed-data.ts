export type MatchStatus = "live" | "upcoming" | "finished";

export interface FeedMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus;
  leagueSlug: string;
  leagueName: string;
  minute?: string;
  kickoffTime?: string;
}

export type ThreadType =
  | "match_thread"
  | "discussion"
  | "news"
  | "poll"
  | "transfer_rumor";

export interface FeedThread {
  id: number;
  slug: string;
  title: string;
  leagueSlug: string;
  leagueName: string;
  type: ThreadType;
  isLive: boolean;
  authorName: string;
  authorInitials: string;
  replyCount: number;
  lastActivity: string;
}

export interface FeedLeague {
  slug: string;
  name: string;
  emoji: string;
  logoUrl?: string | null;
}

export interface StandingRow {
  rank: number;
  team: string;
  points: number;
  teamLogoUrl?: string | null;
}

export interface TrendingThread {
  id: number;
  slug: string;
  title: string;
  leagueSlug: string;
  replyCount: number;
}

export interface UpcomingMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoffTime: string;
  leagueName: string;
}
