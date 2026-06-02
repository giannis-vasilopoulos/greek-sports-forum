import { describe, expect, it } from "vitest";

import { signInSchema, signUpSchema } from "@/lib/validation/auth";
import { fullNameSchema } from "@/lib/validation/fields";

const validSignUp = {
  name: "Test User",
  username: "testuser",
  email: "test@example.com",
  password: "TestPass123!",
};

describe("fullNameSchema", () => {
  it("accepts Greek and Latin full names", () => {
    expect(fullNameSchema.safeParse("Γιάννης Παπαδόπουλος").success).toBe(true);
    expect(fullNameSchema.safeParse("Mary-Jane Watson").success).toBe(true);
    expect(fullNameSchema.safeParse("Nikos O'Brien").success).toBe(true);
  });

  it("rejects single word, too short, digits, and empty", () => {
    expect(fullNameSchema.safeParse("").success).toBe(false);
    expect(fullNameSchema.safeParse("Nikos").success).toBe(false);
    expect(fullNameSchema.safeParse("A B").success).toBe(false);
    expect(fullNameSchema.safeParse("Nikos 123").success).toBe(false);
  });
});

describe("signUpSchema", () => {
  it("accepts valid sign-up input", () => {
    const result = signUpSchema.safeParse(validSignUp);

    expect(result.success).toBe(true);
  });

  it("rejects invalid full name", () => {
    const result = signUpSchema.safeParse({
      ...validSignUp,
      name: "OnlyOne",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid email and weak password", () => {
    const result = signUpSchema.safeParse({
      ...validSignUp,
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
