export const AUTH_REDIRECT_QUERY_PARAM = "redirect";

const POST_AUTH_PATH = "/auth/post-auth";

/** Returns a same-origin path safe to use after sign-in, or undefined if invalid. */
export function sanitizeAuthRedirectPath(
  value: string | string[] | null | undefined,
): string | undefined {
  const path = Array.isArray(value) ? value[0] : value;
  if (!path) {
    return undefined;
  }

  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("://") ||
    path.includes("\\")
  ) {
    return undefined;
  }

  return path;
}

export function buildSignInHref(redirectPath: string): string {
  const params = new URLSearchParams();
  params.set(AUTH_REDIRECT_QUERY_PARAM, redirectPath);
  return `/sign-in?${params.toString()}`;
}

export function buildPostAuthHref(redirectPath: string | undefined): string {
  if (!redirectPath) {
    return POST_AUTH_PATH;
  }

  const params = new URLSearchParams();
  params.set(AUTH_REDIRECT_QUERY_PARAM, redirectPath);
  return `${POST_AUTH_PATH}?${params.toString()}`;
}
