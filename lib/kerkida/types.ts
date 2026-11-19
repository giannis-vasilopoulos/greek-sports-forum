// View-model types shared by kerkida components. Queries in lib/<feature> map DB rows to these.
import type {
  matchStatusEnum,
  notifTypeEnum,
  threadTypeEnum,
} from "@/db/schema";

export type LeagueSlug = string; // league.slug, e.g. "super-league"

export type LeagueGroup = "football" | "basketball" | "tournaments";

export interface League {
  slug: LeagueSlug;
  name: string; // "Super League"
  short: string; // monogram fallback: "SL", "UCL", "EL"
  group: LeagueGroup;
  logoUrl?: string | null; // WebP 64×64
  hasStandings: boolean; // false → <DataUnavailable/> (e.g. NBA not synced)
}

export interface Team {
  id: string;
  slug: string;
  name: string; // "ΠΑΟΚ", "Παναθηναϊκός"
  shortName?: string | null; // 3-letter abbreviation (FUTURE: data not available yet)
  logoUrl?: string | null; // WebP 64×64
  /** Two club colours for the avatar ring, e.g. ["oklch(0.56 0.2 27)", "oklch(0.98 0 0)"]. */
  colors?: [string, string] | null;
}

export type MatchStatus = (typeof matchStatusEnum.enumValues)[number];

export interface Match {
  id: string;
  league: League;
  home: Team;
  away: Team;
  status: MatchStatus;
  kickoff: string; // ISO
  minute?: string | null; // "82′", "45+2′", "Q3 4′"
  homeScore?: number | null;
  awayScore?: number | null;
  threadHref?: string | null;
}

export type ReputationTier = 1 | 2 | 3 | 4; // Νέος · Τακτικός · Βετεράνος · Θρύλος

export interface FanProfile {
  id: string;
  league: League;
  displayName: string;
  team?: Team | null; // null = ουδέτερος
  reputation: number;
  tier: ReputationTier;
  nextTierAt?: number | null;
  isActive?: boolean;
}

export interface Author {
  username: string;
  avatarUrl?: string | null;
  profile: Pick<FanProfile, "displayName" | "team" | "tier">;
}

export type ThreadType = (typeof threadTypeEnum.enumValues)[number];

export interface ThreadSummary {
  id: string;
  href: string;
  type: ThreadType;
  title: string;
  author: Author;
  league: League;
  replyCount: number;
  lastActivityAt: string; // ISO
  pinned?: boolean;
  locked?: boolean;
  unread?: boolean;
  hot?: boolean;
  match?: Pick<Match, "status" | "minute" | "homeScore" | "awayScore"> | null;
  pollVotes?: number | null;
}

export type Vote = "up" | "down" | null;
export type Moderation =
  | "hidden_by_mod"
  | "low_score"
  | "flagged"
  | "deleted"
  | null;

export interface Post {
  id: string;
  author: Author;
  body: string; // sanitized HTML or plain text
  score: number;
  myVote: Vote;
  createdAt: string;
  editedAt?: string | null;
  moderation?: Moderation;
  moderationReason?: string | null;
  replyCount: number; // total descendants
  replies?: Post[];
}

export type FormResult = "W" | "D" | "L";
export type Zone = "playoff" | "mid" | "relegation" | null;

export interface StandingRow {
  rank: number;
  team: Team;
  href: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: FormResult[]; // oldest → newest, max 5
  zone: Zone;
}

export type TransferDirection = "in" | "out";
export type TransferKind =
  | "permanent"
  | "loan"
  | "loan_return"
  | "free"
  | "unknown";

export interface Transfer {
  id: string;
  playerName: string;
  from: Team;
  to: Team;
  direction: TransferDirection; // relative to the team page
  date: string; // ISO
  kind: TransferKind;
  feeEur?: number | null;
}

export type RumorStatus = "open" | "confirmed" | "debunked";

export interface Rumor {
  id: string;
  href: string;
  playerName: string;
  from: Team;
  to: Team;
  status: RumorStatus;
  sourceUrl?: string | null;
  sourceLabel?: string | null;
  credible: number; // votes
  notCredible: number;
  myVote: "credible" | "not_credible" | null;
  author: Author;
  replyCount: number;
  createdAt: string;
}

export type NotificationType = (typeof notifTypeEnum.enumValues)[number];

export interface AppNotification {
  id: string;
  type: NotificationType;
  href: string;
  actor: { name: string; avatarUrl?: string | null } | null;
  text: string; // already-localized remainder: "απάντησε στο σχόλιό σου στο «…»"
  createdAt: string;
  read: boolean;
  league?: League | null; // for match_starting
}
