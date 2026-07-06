"use client";

import { Button } from "@/components/ui/button";
import { useSetActiveFanProfile } from "@/hooks/profile/use-set-active-fan-profile";
import { copy } from "@/lib/copy";

const t = copy.profile.fanProfiles;

interface SetActiveFanProfileButtonProps {
  profileId: number;
  disabled?: boolean;
}

export function SetActiveFanProfileButton({
  profileId,
  disabled = false,
}: SetActiveFanProfileButtonProps) {
  const { setActive, pending } = useSetActiveFanProfile();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled || pending}
      onClick={() => setActive(profileId)}
    >
      {pending ? t.setActivePending : t.setActive}
    </Button>
  );
}
