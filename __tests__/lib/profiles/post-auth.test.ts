import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSessionUser } from "@/lib/auth/session";
import { getPostAuthRedirectPath } from "@/lib/profiles/post-auth";
import { userHasFanProfiles } from "@/lib/profiles/queries";

vi.mock("@/lib/auth/session", () => ({
  getSessionUser: vi.fn(),
}));

vi.mock("@/lib/profiles/queries", () => ({
  userHasFanProfiles: vi.fn(),
}));

describe("getPostAuthRedirectPath", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated users to sign-in", async () => {
    vi.mocked(getSessionUser).mockResolvedValue(undefined);

    await expect(getPostAuthRedirectPath()).resolves.toBe("/sign-in");
  });

  it("redirects users without fan profiles to onboarding", async () => {
    vi.mocked(getSessionUser).mockResolvedValue({
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      role: "user",
    });
    vi.mocked(userHasFanProfiles).mockResolvedValue(false);

    await expect(getPostAuthRedirectPath()).resolves.toBe("/onboarding");
  });

  it("redirects users with fan profiles to home", async () => {
    vi.mocked(getSessionUser).mockResolvedValue({
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      role: "user",
    });
    vi.mocked(userHasFanProfiles).mockResolvedValue(true);

    await expect(getPostAuthRedirectPath()).resolves.toBe("/");
  });
});
