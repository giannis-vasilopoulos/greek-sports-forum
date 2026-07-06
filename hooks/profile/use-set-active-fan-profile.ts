"use client";

import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";

import { setActiveFanProfile } from "@/lib/profiles/actions";

export function useSetActiveFanProfile() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const setActive = useCallback(
    (profileId: number) => {
      startTransition(async () => {
        await setActiveFanProfile(profileId);
        router.refresh();
      });
    },
    [router],
  );

  return { setActive, pending };
}
