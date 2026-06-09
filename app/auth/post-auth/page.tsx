import { redirect } from "next/navigation";

import {
  AUTH_REDIRECT_QUERY_PARAM,
  buildSignInHref,
  sanitizeAuthRedirectPath,
} from "@/lib/auth/redirect";
import { getPostAuthRedirectPath } from "@/lib/profiles/post-auth";

interface PostAuthPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PostAuthPage({
  searchParams,
}: PostAuthPageProps) {
  const params = await searchParams;
  const redirectPath = sanitizeAuthRedirectPath(
    params[AUTH_REDIRECT_QUERY_PARAM],
  );
  const defaultPath = await getPostAuthRedirectPath();

  if (defaultPath === "/sign-in") {
    redirect(redirectPath ? buildSignInHref(redirectPath) : defaultPath);
  }

  if (redirectPath) {
    redirect(redirectPath);
  }

  redirect(defaultPath);
}
