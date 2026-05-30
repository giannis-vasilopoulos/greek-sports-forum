import { describe, expect, it } from "vitest";

import {
  classifyPgError,
  DbError,
  getPgError,
  isConnectionError,
  isForeignKeyViolation,
  isUniqueViolation,
} from "@/lib/db/errors";

describe("getPgError", () => {
  it("returns null for non-objects", () => {
    expect(getPgError(null)).toBeNull();
    expect(getPgError("error")).toBeNull();
  });

  it("returns pg error when code is present", () => {
    const pgError = { code: "23505", message: "duplicate key" };
    expect(getPgError(pgError)).toEqual(pgError);
  });

  it("unwraps nested cause", () => {
    const pgError = { code: "23503", message: "fk violation" };
    expect(getPgError({ cause: pgError })).toEqual(pgError);
  });
});

describe("isUniqueViolation", () => {
  it("detects unique constraint code", () => {
    expect(isUniqueViolation({ code: "23505" })).toBe(true);
    expect(isUniqueViolation({ code: "23503" })).toBe(false);
  });
});

describe("isForeignKeyViolation", () => {
  it("detects foreign key constraint code", () => {
    expect(isForeignKeyViolation({ code: "23503" })).toBe(true);
    expect(isForeignKeyViolation({ code: "23505" })).toBe(false);
  });
});

describe("isConnectionError", () => {
  it("detects pg connection failure", () => {
    expect(isConnectionError({ code: "57P01" })).toBe(true);
  });

  it("detects node connection codes on Error", () => {
    const error = new Error("connection refused") as Error & { code: string };
    error.code = "ECONNREFUSED";
    expect(isConnectionError(error)).toBe(true);
  });

  it("returns false for constraint errors", () => {
    expect(isConnectionError({ code: "23505" })).toBe(false);
  });
});

describe("classifyPgError", () => {
  it("classifies connection errors", () => {
    const result = classifyPgError({ code: "57P01", message: "shutdown" });
    expect(result).toBeInstanceOf(DbError);
    expect(result.code).toBe("connection");
    expect(result.pgCode).toBe("57P01");
  });

  it("classifies constraint errors", () => {
    const result = classifyPgError({ code: "23505", message: "duplicate" });
    expect(result.code).toBe("constraint");
    expect(result.pgCode).toBe("23505");
  });

  it("classifies unknown errors", () => {
    const result = classifyPgError({ code: "99999", message: "weird" });
    expect(result.code).toBe("unknown");
  });

  it("uses Error message when pg message is missing", () => {
    const result = classifyPgError(new Error("boom"));
    expect(result.message).toBe("boom");
    expect(result.code).toBe("unknown");
  });
});
