import sharp from "sharp";

import {
  getLogoMaxEdgePx,
  getLogoWebpQuality,
  MAX_TRANSFORMED_LOGO_BYTES,
} from "@/lib/logos/config";

export type LogoFileExtension = "webp" | "svg";

export type NormalizedLogo = {
  body: Buffer;
  contentType: string;
  extension: LogoFileExtension;
};

function isSvg(contentType: string): boolean {
  return contentType === "image/svg+xml";
}

function isGif(contentType: string): boolean {
  return contentType === "image/gif";
}

export async function normalizeLogoBytes(input: {
  body: Uint8Array;
  contentType: string;
}): Promise<NormalizedLogo | null> {
  const contentType = input.contentType.split(";")[0]?.trim().toLowerCase();

  if (isSvg(contentType)) {
    const body = Buffer.from(input.body);
    if (body.byteLength > MAX_TRANSFORMED_LOGO_BYTES) {
      console.warn("Logo transform: SVG exceeds size cap");
      return null;
    }
    return { body, contentType: "image/svg+xml", extension: "svg" };
  }

  if (isGif(contentType)) {
    const meta = await sharp(input.body, { animated: true }).metadata();
    if ((meta.pages ?? 1) > 1) {
      console.warn("Logo transform: skipping animated GIF");
      return null;
    }
  }

  const maxEdge = getLogoMaxEdgePx();
  const quality = getLogoWebpQuality();

  try {
    const body = await sharp(input.body, { animated: false })
      .resize(maxEdge, maxEdge, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();

    if (body.byteLength > MAX_TRANSFORMED_LOGO_BYTES) {
      console.warn("Logo transform: WebP output exceeds size cap");
      return null;
    }

    return { body, contentType: "image/webp", extension: "webp" };
  } catch (error) {
    console.warn("Logo transform: sharp failed", error);
    return null;
  }
}
