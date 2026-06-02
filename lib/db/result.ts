export type AppDbError =
  | { kind: "not_found"; resource: string; message: string }
  | { kind: "conflict"; field: string; message: string }
  | { kind: "forbidden"; message: string };

export type Result<T, E = AppDbError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export function notFound(resource: string): AppDbError {
  return {
    kind: "not_found",
    resource,
    message: `${resource} not found`,
  };
}

export function conflict(field: string): AppDbError {
  return {
    kind: "conflict",
    field,
    message: `A record with this ${field} already exists`,
  };
}

export function forbidden(message: string): AppDbError {
  return { kind: "forbidden", message };
}
