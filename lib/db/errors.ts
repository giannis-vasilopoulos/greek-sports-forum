export type DbErrorCode = "connection" | "constraint" | "unknown";

/** Duck-typed pg driver error (avoids importing `pg` in lib). */
export type PgErrorLike = {
  code?: string;
  message?: string;
};

export class DbError extends Error {
  readonly code: DbErrorCode;
  readonly pgCode?: string;
  readonly cause?: unknown;

  constructor(
    message: string,
    options: { code: DbErrorCode; pgCode?: string; cause?: unknown },
  ) {
    super(message);
    this.name = "DbError";
    this.code = options.code;
    this.pgCode = options.pgCode;
    this.cause = options.cause;
  }
}

const PG_UNIQUE_VIOLATION = "23505";
const PG_FOREIGN_KEY_VIOLATION = "23503";
const PG_CONNECTION_FAILURE = "57P01";

const NODE_CONNECTION_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "ENOTFOUND",
  "EPIPE",
]);

export function getPgError(cause: unknown): PgErrorLike | null {
  if (cause === null || typeof cause !== "object") return null;
  const err = cause as PgErrorLike;
  if (typeof err.code === "string") return err;
  if ("cause" in cause) {
    const nested = (cause as { cause: unknown }).cause;
    return getPgError(nested);
  }
  return null;
}

export function isUniqueViolation(cause: unknown): boolean {
  return getPgError(cause)?.code === PG_UNIQUE_VIOLATION;
}

export function isForeignKeyViolation(cause: unknown): boolean {
  return getPgError(cause)?.code === PG_FOREIGN_KEY_VIOLATION;
}

export function isConnectionError(cause: unknown): boolean {
  const pg = getPgError(cause);
  if (pg?.code === PG_CONNECTION_FAILURE) return true;
  if (pg?.code && NODE_CONNECTION_CODES.has(pg.code)) return true;
  if (cause instanceof Error) {
    const nested = (cause as Error & { code?: string }).code;
    if (nested && NODE_CONNECTION_CODES.has(nested)) return true;
  }
  return false;
}

export function classifyPgError(cause: unknown): DbError {
  const pg = getPgError(cause);
  const pgCode = pg?.code;
  const message =
    pg?.message ??
    (cause instanceof Error ? cause.message : "Database operation failed");

  if (isConnectionError(cause)) {
    return new DbError(message, { code: "connection", pgCode, cause });
  }

  if (pgCode === PG_UNIQUE_VIOLATION || pgCode === PG_FOREIGN_KEY_VIOLATION) {
    return new DbError(message, { code: "constraint", pgCode, cause });
  }

  return new DbError(message, { code: "unknown", pgCode, cause });
}
