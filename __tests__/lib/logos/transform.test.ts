import sharp from "sharp";
import { beforeAll, describe, expect, it } from "vitest";

import { normalizeLogoBytes } from "@/lib/logos/transform";

const TINY_SVG = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="red"/></svg>',
);

let tinyPng: Buffer;

describe("normalizeLogoBytes", () => {
  beforeAll(async () => {
    tinyPng = await sharp({
      create: {
        width: 2,
        height: 2,
        channels: 4,
        background: { r: 200, g: 0, b: 0, alpha: 1 },
      },
    })
      .png()
      .toBuffer();
  });

  it("converts PNG to webp within max edge", async () => {
    const body = tinyPng;
    const result = await normalizeLogoBytes({
      body,
      contentType: "image/png",
    });

    expect(result).not.toBeNull();
    expect(result!.extension).toBe("webp");
    expect(result!.contentType).toBe("image/webp");
    expect(result!.body.byteLength).toBeGreaterThan(0);
  });

  it("passes through SVG unchanged", async () => {
    const result = await normalizeLogoBytes({
      body: TINY_SVG,
      contentType: "image/svg+xml",
    });

    expect(result?.extension).toBe("svg");
    expect(result?.contentType).toBe("image/svg+xml");
    expect(result?.body.equals(TINY_SVG)).toBe(true);
  });
});
