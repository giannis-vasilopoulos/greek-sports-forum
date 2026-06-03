function normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const TEAM_ALIASES: Record<string, string> = {
  olympiacos: "olympiakos",
  "olympiacos fc": "olympiakos",
  "ae athens": "aek athens",
  "aek athen": "aek athens",
  paok: "paok fc",
  "panathinaikos fc": "panathinaikos",
};

function aliasKey(normalized: string): string {
  return TEAM_ALIASES[normalized] ?? normalized;
}

export function findTeamIdByName(
  apiName: string,
  teams: Array<{ id: number; name: string }>,
): number | null {
  const key = aliasKey(normalizeTeamName(apiName));
  if (!key) return null;

  for (const team of teams) {
    const teamKey = aliasKey(normalizeTeamName(team.name));
    if (teamKey === key) return team.id;
    if (teamKey.includes(key) || key.includes(teamKey)) return team.id;
  }

  return null;
}
