import type { LogoFileExtension } from "@/lib/logos/transform";

const SAFE_SEGMENT = /[^a-z0-9-]/g;

function sanitizeSegment(segment: string): string {
  return segment.toLowerCase().replace(SAFE_SEGMENT, "-");
}

export function teamLogoKey(
  teamSlug: string,
  extension: LogoFileExtension,
): string {
  return `teams/${sanitizeSegment(teamSlug)}.${extension}`;
}

export function leagueLogoKey(
  leagueSlug: string,
  extension: LogoFileExtension,
): string {
  return `leagues/${sanitizeSegment(leagueSlug)}.${extension}`;
}
