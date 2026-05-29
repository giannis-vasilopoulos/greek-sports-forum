import {
  classifyPgError,
  DbError,
  isForeignKeyViolation,
  isUniqueViolation,
} from "@/lib/db/errors";
import {
  conflict,
  err,
  ok,
  type AppDbError,
  type Result,
} from "@/lib/db/result";

export type RunDbResultOptions<T> = {
  onUnique?: (cause: unknown) => Result<T, AppDbError> | AppDbError;
  onFk?: (cause: unknown) => Result<T, AppDbError> | AppDbError;
};

function toResult<T>(
  value: Result<T, AppDbError> | AppDbError,
): Result<T, AppDbError> {
  return "ok" in value ? value : err(value);
}

function mapConstraintError<T>(
  cause: unknown,
  options?: RunDbResultOptions<T>,
): Result<T, AppDbError> | null {
  if (isUniqueViolation(cause)) {
    if (options?.onUnique) return toResult(options.onUnique(cause));
    return err(conflict("value"));
  }
  if (isForeignKeyViolation(cause)) {
    if (options?.onFk) return toResult(options.onFk(cause));
    return err(conflict("reference"));
  }
  return null;
}

/** Run a Drizzle query; throw DbError on infrastructure or unmapped failures. */
export async function runDbOrThrow<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (cause) {
    throw classifyPgError(cause);
  }
}

/**
 * Run a Drizzle query; return Result for unique/FK violations (or custom handlers).
 * Throws DbError for connection and other infrastructure failures.
 */
export async function runDbResult<T>(
  fn: () => Promise<T>,
  options?: RunDbResultOptions<T>,
): Promise<Result<T, AppDbError>> {
  try {
    return ok(await fn());
  } catch (cause) {
    const mapped = mapConstraintError<T>(cause, options);
    if (mapped) return mapped;

    const classified = classifyPgError(cause);
    if (classified.code === "constraint") {
      return err(conflict("value"));
    }
    throw classified;
  }
}

export function isDbError(error: unknown): error is DbError {
  return error instanceof DbError;
}
