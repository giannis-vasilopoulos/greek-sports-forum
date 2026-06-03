/** Greek digraphs must be replaced before single-character rules. */
const GREEK_DIGRAPHS: ReadonlyArray<[RegExp, string]> = [
  [/μπ/gi, "mp"],
  [/ντ/gi, "nt"],
  [/γκ/gi, "gk"],
  [/γγ/gi, "ng"],
  [/αυ/gi, "av"],
  [/ευ/gi, "ev"],
  [/ου/gi, "ou"],
  [/αι/gi, "ai"],
  [/ει/gi, "ei"],
  [/οι/gi, "oi"],
];

const GREEK_CHAR: Record<string, string> = {
  α: "a",
  β: "v",
  γ: "g",
  δ: "d",
  ε: "e",
  ζ: "z",
  η: "i",
  θ: "th",
  ι: "i",
  κ: "k",
  λ: "l",
  μ: "m",
  ν: "n",
  ξ: "x",
  ο: "o",
  π: "p",
  ρ: "r",
  σ: "s",
  ς: "s",
  τ: "t",
  υ: "y",
  φ: "f",
  χ: "ch",
  ψ: "ps",
  ω: "o",
};

/** Optional conventional slugs after transliteration (compact key). */
const TEAM_SLUG_OVERRIDES: Record<string, string> = {
  osfp: "olympiakos",
  pao: "panathinaikos",
};

export function greekToLatin(input: string): string {
  let s = input.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  for (const [re, rep] of GREEK_DIGRAPHS) {
    s = s.replace(re, rep);
  }
  return [...s].map((ch) => GREEK_CHAR[ch] ?? ch).join("");
}

export function slugifyTeamName(name: string): string {
  const latin = greekToLatin(name);
  const compact = latin.replace(/[^a-z0-9]/g, "");
  const override = TEAM_SLUG_OVERRIDES[compact];
  if (override) {
    return override;
  }

  return latin
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function teamSlug(leagueSlug: string, name: string): string {
  const base = slugifyTeamName(name);
  if (!base) {
    throw new Error(`teamSlug: empty slug for "${name}"`);
  }
  return `${leagueSlug}-${base}`;
}
