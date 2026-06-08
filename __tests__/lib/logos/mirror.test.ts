import sharp from "sharp";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const sendMock = vi.fn().mockResolvedValue({});

vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: class MockS3Client {
    send = sendMock;
  },
  PutObjectCommand: class MockPutObjectCommand {
    constructor(public input: unknown) {}
  },
}));

let tinyPng: Buffer;

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

describe("mirrorLogoFromUrl", () => {
  const env = process.env;

  beforeEach(() => {
    vi.resetModules();
    sendMock.mockClear();
    process.env = {
      ...env,
      LOGO_MIRROR_ENABLED: "true",
      LOGO_CDN_PUBLIC_URL: "https://cdn.test",
      R2_ACCOUNT_ID: "acc",
      R2_ACCESS_KEY_ID: "key",
      R2_SECRET_ACCESS_KEY: "secret",
      R2_BUCKET_NAME: "logos",
    };
  });

  afterEach(() => {
    process.env = env;
    vi.unstubAllGlobals();
  });

  it("returns source URL when mirror is disabled", async () => {
    process.env.LOGO_MIRROR_ENABLED = "false";
    const { mirrorLogoFromUrl } = await import("@/lib/logos/mirror");

    const url = await mirrorLogoFromUrl({
      sourceUrl: "https://example.com/a.png",
      objectKey: "teams/x.webp",
    });

    expect(url).toBe("https://example.com/a.png");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("uploads normalized webp to R2 and returns CDN URL", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "image/png" }),
        arrayBuffer: async () =>
          tinyPng.buffer.slice(
            tinyPng.byteOffset,
            tinyPng.byteOffset + tinyPng.byteLength,
          ),
      }),
    );

    const { mirrorLogoFromUrl } = await import("@/lib/logos/mirror");
    const url = await mirrorLogoFromUrl({
      sourceUrl: "https://example.com/a.png",
      objectKey: "teams/test.webp",
    });

    expect(url).toBe("https://cdn.test/teams/test.webp");
    expect(sendMock).toHaveBeenCalledOnce();
    const command = sendMock.mock.calls[0]?.[0] as {
      input?: { ContentType?: string };
    };
    expect(command.input?.ContentType).toBe("image/webp");
  });

  it("accepts PNG when response has no content-type header", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers(),
        arrayBuffer: async () =>
          tinyPng.buffer.slice(
            tinyPng.byteOffset,
            tinyPng.byteOffset + tinyPng.byteLength,
          ),
      }),
    );

    const { mirrorLogoFromUrl } = await import("@/lib/logos/mirror");
    const url = await mirrorLogoFromUrl({
      sourceUrl: "https://www.slgr.gr/img/uploads/big/156284491142.png",
      objectKey: "teams/slgr-test.webp",
    });

    expect(url).toBe("https://cdn.test/teams/slgr-test.webp");
  });

  it("returns null when download fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );

    const { mirrorLogoFromUrl } = await import("@/lib/logos/mirror");
    const url = await mirrorLogoFromUrl({
      sourceUrl: "https://example.com/missing.png",
      objectKey: "teams/missing.webp",
    });

    expect(url).toBeNull();
  });
});

describe("resolveLogoUrl", () => {
  const env = process.env;

  beforeEach(() => {
    vi.resetModules();
    sendMock.mockClear();
    process.env = {
      ...env,
      LOGO_MIRROR_ENABLED: "true",
      LOGO_CDN_PUBLIC_URL: "https://cdn.test",
      R2_ACCOUNT_ID: "acc",
      R2_ACCESS_KEY_ID: "key",
      R2_SECRET_ACCESS_KEY: "secret",
      R2_BUCKET_NAME: "logos",
    };
  });

  afterEach(() => {
    process.env = env;
    vi.unstubAllGlobals();
  });

  it("uses slug-based webp key for teams", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "image/png" }),
        arrayBuffer: async () =>
          tinyPng.buffer.slice(
            tinyPng.byteOffset,
            tinyPng.byteOffset + tinyPng.byteLength,
          ),
      }),
    );

    const { resolveLogoUrl } = await import("@/lib/logos/mirror");
    const url = await resolveLogoUrl({
      sourceUrl: "https://example.com/a.png",
      slug: "super-league-aek",
      kind: "team",
    });

    expect(url).toBe("https://cdn.test/teams/super-league-aek.webp");
  });
});
