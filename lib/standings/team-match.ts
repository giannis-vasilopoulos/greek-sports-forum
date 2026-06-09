function normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** Collapse dotted Greek initials (α ε κ → αεκ). */
function compactGreekKey(normalized: string): string {
  return normalized.replace(/\s+/g, "");
}

/** Canonical keys use compact Greek where SLGR names are Greek. */
const TEAM_ALIASES: Record<string, string> = {
  olympiacos: "ολυμπιακος",
  "olympiacos fc": "ολυμπιακος",
  olympiakos: "ολυμπιακος",
  osfp: "ολυμπιακος",
  "ae athens": "αεκ",
  "aek athen": "αεκ",
  "aek athens": "αεκ",
  aek: "αεκ",
  αεκ: "αεκ",
  paok: "παοκ",
  "paok fc": "παοκ",
  παοκ: "παοκ",
  "panathinaikos fc": "παναθηναικος",
  panathinaikos: "παναθηναικος",
  pao: "παναθηναικος",
  "asteras tripolis": "asteras aktor",
  asteras: "asteras aktor",
  "atromitos athinon": "ατρομητος αθ",
  atromitos: "ατρομητος αθ",
  ofi: "οφη",
  "volos nfc": "βολος νπσ",
  volos: "βολος νπσ",
  "levadiakos fc": "λεβαδειακος",
  "panserraikos fc": "πανσερραικος",
  "panaitolikos agrinio": "παναιτωλικος",
  "ael fc": "ael novibet",
  ael: "ael novibet",
  aris: "αρης",
  kifisia: "κηφισια",
};

function aliasKey(normalized: string): string {
  const compact = compactGreekKey(normalized);
  return TEAM_ALIASES[compact] ?? TEAM_ALIASES[normalized] ?? compact;
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

export function teamNamesMatch(
  transferTeamName: string,
  dbTeamName: string,
): boolean {
  return (
    findTeamIdByName(transferTeamName, [{ id: 1, name: dbTeamName }]) === 1
  );
}
