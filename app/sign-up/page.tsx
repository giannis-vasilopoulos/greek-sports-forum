import type { Metadata } from "next";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { buildSignUpMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildSignUpMetadata();

export default function SignUpPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-12">
      <SignUpForm />
    </div>
  );
}
