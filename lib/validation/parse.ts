import type { ZodError, ZodSchema } from "zod";

import { copy } from "@/lib/copy";

export type ParseSuccess<T> = { ok: true; data: T };

export type ParseFailure = {
  ok: false;
  fieldErrors: Record<string, string>;
  formError?: string;
};

export type ParseResult<T> = ParseSuccess<T> | ParseFailure;

export function zodFieldErrors(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string" || key in fieldErrors) continue;
    fieldErrors[key] = issue.message;
  }

  return fieldErrors;
}

export function safeParseInput<T>(
  schema: ZodSchema<T>,
  input: unknown,
): ParseResult<T> {
  const result = schema.safeParse(input);

  if (result.success) {
    return { ok: true, data: result.data };
  }

  return {
    ok: false,
    fieldErrors: zodFieldErrors(result.error),
  };
}

export function parseFormData<T>(
  schema: ZodSchema<T>,
  formData: FormData,
): ParseResult<T> {
  const raw: Record<string, FormDataEntryValue> = {};

  for (const [key, value] of formData.entries()) {
    raw[key] = value;
  }

  return safeParseInput(schema, raw);
}

export async function parseJsonBody<T>(
  schema: ZodSchema<T>,
  request: Request,
): Promise<ParseResult<T>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      ok: false,
      fieldErrors: {},
      formError: copy.validation.requestInvalid,
    };
  }

  return safeParseInput(schema, body);
}
