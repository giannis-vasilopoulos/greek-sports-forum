"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { copy } from "@/lib/copy";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const t = copy.auth.signOut;

interface SignOutButtonProps {
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  children?: React.ReactNode;
}

export function SignOutButton({
  className,
  variant = "ghost",
  size = "sm",
  children = t.label,
}: SignOutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
    setPending(false);
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={pending}
      onClick={handleSignOut}
    >
      {pending ? t.pending : children}
    </Button>
  );
}
