/** Display emoji for nav/feed — DB leagues have no emoji column. */
export const LEAGUE_EMOJI_BY_SLUG: Record<string, string> = {
  "super-league": "⚽",
  "super-league-2": "⚽",
  "champions-league": "⭐",
  "premier-league": "⚽",
  "la-liga": "⚽",
  bundesliga: "⚽",
  "serie-a": "⚽",
  euroleague: "🏀",
  nba: "🏀",
  "basket-league": "🏀",
  "world-cup": "⚽",
  euro: "⚽",
};

export function getLeagueEmoji(
  slug: string,
  sport: "football" | "basketball",
): string {
  return LEAGUE_EMOJI_BY_SLUG[slug] ?? (sport === "basketball" ? "🏀" : "⚽");
}

/** Curated slugs shown in header nav (subset of DB leagues). */
export const NAV_LEAGUE_SLUGS = [
  "super-league",
  "super-league-2",
  "champions-league",
  "premier-league",
  "euroleague",
  "nba",
] as const;
