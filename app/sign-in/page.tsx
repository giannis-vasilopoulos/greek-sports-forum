import type { Metadata } from "next";

import { SignInForm } from "@/components/auth/sign-in-form";
import { buildSignInMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildSignInMetadata();

export default function SignInPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-12">
      <SignInForm />
    </div>
  );
}
