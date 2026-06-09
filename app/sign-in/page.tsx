import type { Metadata } from "next";

import { SignInForm } from "@/components/auth/sign-in-form";
import {
  AUTH_REDIRECT_QUERY_PARAM,
  sanitizeAuthRedirectPath,
} from "@/lib/auth/redirect";
import { buildSignInMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildSignInMetadata();

interface SignInPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const redirectPath = sanitizeAuthRedirectPath(
    params[AUTH_REDIRECT_QUERY_PARAM],
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-12">
      <SignInForm redirectPath={redirectPath} />
    </div>
  );
}
