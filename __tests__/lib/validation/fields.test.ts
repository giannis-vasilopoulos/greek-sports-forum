import { describe, expect, it } from "vitest";

import {
  emailSchema,
  isValidPassword,
  isValidUsername,
  PASSWORD_REQUIREMENTS_DESCRIPTION,
  passwordSchema,
  usernameSchema,
} from "@/lib/validation/fields";

describe("usernameSchema", () => {
  it("accepts valid usernames", () => {
    expect(usernameSchema.safeParse("nikos_13").success).toBe(true);
    expect(isValidUsername("TestUser")).toBe(true);
  });

  it("rejects short, long, and invalid charset", () => {
    expect(usernameSchema.safeParse("ab").success).toBe(false);
    expect(usernameSchema.safeParse("a".repeat(31)).success).toBe(false);
    expect(usernameSchema.safeParse("user.name").success).toBe(false);
    expect(usernameSchema.safeParse("γιάννης").success).toBe(false);
    expect(usernameSchema.safeParse("user name").success).toBe(false);
  });
});

describe("emailSchema", () => {
  it("accepts valid emails and rejects invalid", () => {
    expect(emailSchema.safeParse("test@example.com").success).toBe(true);
    expect(emailSchema.safeParse("not-an-email").success).toBe(false);
    expect(emailSchema.safeParse("").success).toBe(false);
  });
});

describe("PASSWORD_REQUIREMENTS_DESCRIPTION", () => {
  it("lists accepted character sets and minimum length", () => {
    expect(PASSWORD_REQUIREMENTS_DESCRIPTION).toContain("a–z, A–Z");
    expect(PASSWORD_REQUIREMENTS_DESCRIPTION).toContain("0–9");
    expect(PASSWORD_REQUIREMENTS_DESCRIPTION).toContain("ειδικούς χαρακτήρες");
    expect(PASSWORD_REQUIREMENTS_DESCRIPTION).toContain(
      "Τουλάχιστον 8 χαρακτήρες",
    );
    expect(PASSWORD_REQUIREMENTS_DESCRIPTION).not.toContain("128");
  });
});

describe("passwordSchema", () => {
  it("accepts a strong password", () => {
    expect(passwordSchema.safeParse("TestPass123!").success).toBe(true);
    expect(isValidPassword("TestPass123!")).toBe(true);
  });

  it("rejects missing complexity rules", () => {
    expect(passwordSchema.safeParse("testpass123!").success).toBe(false);
    expect(passwordSchema.safeParse("TESTPASS123!").success).toBe(false);
    expect(passwordSchema.safeParse("TestPass!").success).toBe(false);
    expect(passwordSchema.safeParse("TestPass123").success).toBe(false);
    expect(passwordSchema.safeParse("Test1!").success).toBe(false);
  });
});
