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

export function standingsPath(): string {
  return "/standings";
}

export function leagueStandingsPath(slug: string): string {
  return `/leagues/${slug}/standings`;
}

export function teamTransfersPath(
  leagueSlug: string,
  teamUrlSlug: string,
): string {
  return `/leagues/${leagueSlug}/teams/${teamUrlSlug}/transfers`;
}

export function teamTransferRumorsPath(
  leagueSlug: string,
  teamUrlSlug: string,
): string {
  return `/leagues/${leagueSlug}/teams/${teamUrlSlug}/transfer-rumors`;
}

export function transfersPath(): string {
  return "/transfers";
}

export function leagueTransfersPath(slug: string): string {
  return `/leagues/${slug}/transfers`;
}

export function transferRumorsPath(): string {
  return "/transfer-rumors";
}

export function leagueTransferRumorsPath(slug: string): string {
  return `/leagues/${slug}/transfer-rumors`;
}
