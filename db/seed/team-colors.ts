/**
 * Club colours for the TeamAvatar ring, keyed by DB team slug (`teamSlug(league, name)`).
 * Tuple is [primary, secondary]. Teams not listed get null colours and render without a ring.
 * slgr names carry sponsor suffixes (e.g. "ΑΕΛ NOVIBET"), so a rename changes the slug; the seed warns.
 */
export const TEAM_COLORS: Record<string, [string, string]> = {
  "super-league-aek": ["#FFD200", "#000000"],
  "super-league-ael-novibet": ["#7A1F2B", "#FFFFFF"],
  "super-league-aris": ["#FFD200", "#000000"],
  "super-league-asteras-aktor": ["#FFD200", "#1E3A8A"],
  "super-league-atromitos-ath": ["#0055A4", "#FFFFFF"],
  "super-league-kifisia": ["#3B82C4", "#FFFFFF"],
  "super-league-levadeiakos": ["#00843D", "#FFFFFF"],
  "super-league-ofi": ["#000000", "#FFFFFF"],
  "super-league-olympiakos": ["#D71920", "#FFFFFF"],
  "super-league-panaitolikos": ["#FFD200", "#003DA5"],
  "super-league-panathinaikos": ["#007A3D", "#FFFFFF"],
  "super-league-panserraikos": ["#D71920", "#FFFFFF"],
  "super-league-paok": ["#000000", "#FFFFFF"],
  "super-league-volos-nps": ["#1F4E9E", "#D7262E"],
};
