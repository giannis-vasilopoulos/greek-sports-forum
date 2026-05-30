const MAX_SLUG_LENGTH = 80;

export function slugify(input: string): string {
  const normalized = input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!normalized) {
    return "thread";
  }

  return normalized.slice(0, MAX_SLUG_LENGTH).replace(/-$/, "");
}

export function uniqueSlug(base: string, suffix: number): string {
  const candidate = `${base}-${suffix}`;
  if (candidate.length <= MAX_SLUG_LENGTH) {
    return candidate;
  }
  return `${base.slice(0, MAX_SLUG_LENGTH - String(suffix).length - 1)}-${suffix}`;
}
