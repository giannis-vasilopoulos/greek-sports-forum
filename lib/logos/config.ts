const DEFAULT_LOGO_MAX_EDGE_PX = 64;
const DEFAULT_LOGO_WEBP_QUALITY = 85;
const MIN_LOGO_MAX_EDGE_PX = 16;
const MAX_LOGO_MAX_EDGE_PX = 256;

export const MAX_TRANSFORMED_LOGO_BYTES = 512 * 1024;

export function isLogoMirrorEnabled(): boolean {
  return process.env.LOGO_MIRROR_ENABLED !== "false";
}

function parsePositiveInt(
  value: string | undefined,
  fallback: number,
  min: number,
  max: number,
): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

export function getLogoMaxEdgePx(): number {
  return parsePositiveInt(
    process.env.LOGO_MAX_EDGE_PX,
    DEFAULT_LOGO_MAX_EDGE_PX,
    MIN_LOGO_MAX_EDGE_PX,
    MAX_LOGO_MAX_EDGE_PX,
  );
}

export function getLogoWebpQuality(): number {
  return parsePositiveInt(
    process.env.LOGO_WEBP_QUALITY,
    DEFAULT_LOGO_WEBP_QUALITY,
    1,
    100,
  );
}

export function getLogoCdnPublicUrl(): string | undefined {
  const url = process.env.LOGO_CDN_PUBLIC_URL?.trim();
  return url && url.length > 0 ? url.replace(/\/$/, "") : undefined;
}

export function getR2Config():
  | {
      accountId: string;
      accessKeyId: string;
      secretAccessKey: string;
      bucketName: string;
    }
  | undefined {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucketName = process.env.R2_BUCKET_NAME?.trim();

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    return undefined;
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName };
}

export function isR2Configured(): boolean {
  return Boolean(getR2Config() && getLogoCdnPublicUrl());
}
