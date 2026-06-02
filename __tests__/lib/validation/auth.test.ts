import { describe, expect, it } from "vitest";

import { signInSchema, signUpSchema } from "@/lib/validation/auth";

describe("signUpSchema", () => {
  it("accepts valid sign-up input", () => {
    const result = signUpSchema.safeParse({
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "TestPass123!",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email and weak password", () => {
    const result = signUpSchema.safeParse({
      name: "Test User",
      username: "testuser",
      email: "not-an-email",
      password: "weak",
    });

    expect(result.success).toBe(false);
  });
});

describe("signInSchema", () => {
  it("accepts non-empty password without complexity", () => {
    const result = signInSchema.safeParse({
      email: "test@example.com",
      password: "legacypassword",
    });

    expect(result.success).toBe(true);
  });
});
