export function leaguePath(slug: string): string {
  return `/leagues/${slug}`;
}

export function leagueThreadsPath(leagueSlug: string): string {
  return `/leagues/${leagueSlug}/threads`;
}

export function threadPath(
  leagueSlug: string,
  threadId: number,
  threadSlug: string,
): string {
  return `/leagues/${leagueSlug}/threads/${threadId}-${threadSlug}`;
}

export function teamPath(leagueSlug: string, teamSlug: string): string {
  return `/leagues/${leagueSlug}/teams/${teamSlug}`;
}

export function memberPath(username: string): string {
  return `/members/${username}`;
}
