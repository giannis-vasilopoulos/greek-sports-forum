import { describe, expect, it } from "vitest";

import {
  AUTH_REDIRECT_QUERY_PARAM,
  buildPostAuthHref,
  buildSignInHref,
  sanitizeAuthRedirectPath,
} from "@/lib/auth/redirect";

describe("sanitizeAuthRedirectPath", () => {
  it("accepts same-origin relative paths", () => {
    expect(sanitizeAuthRedirectPath("/transfer-rumors")).toBe(
      "/transfer-rumors",
    );
    expect(
      sanitizeAuthRedirectPath("/leagues/super-league/transfer-rumors"),
    ).toBe("/leagues/super-league/transfer-rumors");
  });

  it("rejects external and protocol-relative URLs", () => {
    expect(sanitizeAuthRedirectPath("https://evil.test/phish")).toBeUndefined();
    expect(sanitizeAuthRedirectPath("//evil.test/phish")).toBeUndefined();
    expect(sanitizeAuthRedirectPath("\\\\evil.test\\phish")).toBeUndefined();
  });

  it("rejects empty and missing values", () => {
    expect(sanitizeAuthRedirectPath(undefined)).toBeUndefined();
    expect(sanitizeAuthRedirectPath(null)).toBeUndefined();
    expect(sanitizeAuthRedirectPath("")).toBeUndefined();
    expect(sanitizeAuthRedirectPath([])).toBeUndefined();
  });
});

describe("buildSignInHref", () => {
  it("includes the redirect query param", () => {
    expect(buildSignInHref("/transfer-rumors")).toBe(
      `/sign-in?${AUTH_REDIRECT_QUERY_PARAM}=%2Ftransfer-rumors`,
    );
  });
});

describe("buildPostAuthHref", () => {
  it("returns the default post-auth path when redirect is absent", () => {
    expect(buildPostAuthHref(undefined)).toBe("/auth/post-auth");
  });

  it("forwards a safe redirect path", () => {
    expect(buildPostAuthHref("/transfer-rumors")).toBe(
      `/auth/post-auth?${AUTH_REDIRECT_QUERY_PARAM}=%2Ftransfer-rumors`,
    );
  });
});
