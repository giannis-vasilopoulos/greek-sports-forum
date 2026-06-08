import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import {
  getLogoCdnPublicUrl,
  getR2Config,
  isLogoMirrorEnabled,
  isR2Configured,
} from "@/lib/logos/config";
import { leagueLogoKey, teamLogoKey } from "@/lib/logos/keys";
import { normalizeLogoBytes } from "@/lib/logos/transform";
import { slgrRequestHeaders } from "@/lib/slgr/constants";

const MAX_BYTES = 2 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15_000;

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];
const JPEG_MAGIC = [0xff, 0xd8, 0xff];
const WEBP_MAGIC = [0x52, 0x49, 0x46, 0x46];
const GIF_MAGIC = [0x47, 0x49, 0x46];

function matchesMagic(bytes: Uint8Array, magic: number[]): boolean {
  return magic.every((byte, index) => bytes[index] === byte);
}

function sniffContentType(bytes: Uint8Array): string | null {
  if (matchesMagic(bytes, PNG_MAGIC)) return "image/png";
  if (matchesMagic(bytes, JPEG_MAGIC)) return "image/jpeg";
  if (bytes.length >= 12 && matchesMagic(bytes, WEBP_MAGIC)) {
    const webp = String.fromCharCode(...bytes.slice(8, 12));
    if (webp === "WEBP") return "image/webp";
  }
  if (matchesMagic(bytes, GIF_MAGIC)) return "image/gif";
  if (bytes.length > 0 && bytes[0] === 0x3c) return "image/svg+xml";
  return null;
}

function isAllowedHeaderContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  const normalized = contentType.split(";")[0]?.trim().toLowerCase();
  if (!normalized) return false;
  if (normalized.startsWith("image/")) return true;
  return normalized === "application/octet-stream";
}

function logoFetchHeaders(sourceUrl: string): HeadersInit {
  try {
    const host = new URL(sourceUrl).hostname;
    if (host === "www.slgr.gr" || host.endsWith(".slgr.gr")) {
      return slgrRequestHeaders();
    }
  } catch {
    // ignore invalid URL
  }
  return { Accept: "image/*" };
}

function resolveImageContentType(
  body: Uint8Array,
  headerType: string | null,
): string | null {
  const sniffed = sniffContentType(body);
  if (sniffed) return sniffed;

  if (isAllowedHeaderContentType(headerType)) {
    return headerType!.split(";")[0]!.trim().toLowerCase();
  }

  return null;
}

let s3Client: S3Client | undefined;

function getS3Client(): S3Client {
  if (s3Client) return s3Client;

  const config = getR2Config();
  if (!config) {
    throw new Error("R2 is not configured");
  }

  s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return s3Client;
}

async function fetchImageBytes(
  sourceUrl: string,
): Promise<{ body: Uint8Array; contentType: string } | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(sourceUrl, {
      signal: controller.signal,
      headers: logoFetchHeaders(sourceUrl),
    });

    if (!res.ok) {
      console.warn(`Logo mirror: HTTP ${res.status} for ${sourceUrl}`);
      return null;
    }

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength === 0 || buffer.byteLength > MAX_BYTES) {
      console.warn(`Logo mirror: size out of range for ${sourceUrl}`);
      return null;
    }

    const body = new Uint8Array(buffer);
    const headerType = res.headers.get("content-type");
    const contentType = resolveImageContentType(body, headerType);

    if (!contentType) {
      console.warn(
        `Logo mirror: not an image for ${sourceUrl} (content-type: ${headerType ?? "none"})`,
      );
      return null;
    }

    return { body, contentType };
  } catch (error) {
    console.warn(`Logo mirror: fetch failed for ${sourceUrl}`, error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function uploadToR2(input: {
  objectKey: string;
  body: Buffer;
  contentType: string;
}): Promise<string> {
  const publicBase = getLogoCdnPublicUrl()!;
  const config = getR2Config()!;

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: input.objectKey,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${publicBase}/${input.objectKey}`;
}

/** Low-level mirror with a precomputed object key (must match normalized extension). */
export async function mirrorLogoFromUrl({
  sourceUrl,
  objectKey,
}: {
  sourceUrl: string;
  objectKey: string;
}): Promise<string | null> {
  if (!isLogoMirrorEnabled()) {
    return sourceUrl;
  }

  if (!isR2Configured()) {
    return sourceUrl;
  }

  const downloaded = await fetchImageBytes(sourceUrl);
  if (!downloaded) {
    return null;
  }

  const normalized = await normalizeLogoBytes(downloaded);
  if (!normalized) {
    return null;
  }

  return uploadToR2({
    objectKey,
    body: normalized.body,
    contentType: normalized.contentType,
  });
}

export async function resolveLogoUrl({
  sourceUrl,
  slug,
  kind,
}: {
  sourceUrl: string | null | undefined;
  slug: string;
  kind: "team" | "league";
}): Promise<string | null> {
  if (!sourceUrl) return null;

  if (!isLogoMirrorEnabled() || !isR2Configured()) {
    return sourceUrl;
  }

  const downloaded = await fetchImageBytes(sourceUrl);
  if (!downloaded) {
    return null;
  }

  const normalized = await normalizeLogoBytes(downloaded);
  if (!normalized) {
    return null;
  }

  const objectKey =
    kind === "team"
      ? teamLogoKey(slug, normalized.extension)
      : leagueLogoKey(slug, normalized.extension);

  return uploadToR2({
    objectKey,
    body: normalized.body,
    contentType: normalized.contentType,
  });
}
