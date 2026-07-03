"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import { votePost } from "@/lib/forum/actions/vote-post";
import { buildSignInHref } from "@/lib/auth/redirect";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const t = copy.thread.vote;

interface VoteControlsProps {
  postId: number;
  score: number;
  viewerVote: 1 | -1 | null;
  isSignedIn: boolean;
  canVote: boolean;
  className?: string;
}

// fallow-ignore-next-line complexity
export function VoteControls({
  postId,
  score,
  viewerVote,
  isSignedIn,
  canVote,
  className,
}: VoteControlsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleVote(value: 1 | -1) {
    if (!isSignedIn) {
      router.push(buildSignInHref(pathname));
      return;
    }

    if (!canVote) return;

    startTransition(async () => {
      await votePost({ postId, value });
      router.refresh();
    });
  }

  return (
    <div
      className={cn("flex flex-col items-center gap-0.5", className)}
      aria-label={t.score(score)}
    >
      <button
        type="button"
        onClick={() => handleVote(1)}
        disabled={pending || (isSignedIn && !canVote)}
        title={!isSignedIn ? t.signInToVote : undefined}
        aria-label={t.up}
        aria-pressed={viewerVote === 1}
        className={cn(
          "text-muted-foreground hover:text-primary cursor-pointer rounded p-1 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          viewerVote === 1 && "text-primary",
        )}
      >
        <ChevronUpIcon className="size-4" aria-hidden="true" />
      </button>
      <span className="text-foreground min-w-[1.25rem] text-center text-[12px] font-medium tabular-nums">
        {score}
      </span>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        disabled={pending || (isSignedIn && !canVote)}
        title={!isSignedIn ? t.signInToVote : undefined}
        aria-label={t.down}
        aria-pressed={viewerVote === -1}
        className={cn(
          "text-muted-foreground hover:text-destructive cursor-pointer rounded p-1 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          viewerVote === -1 && "text-destructive",
        )}
      >
        <ChevronDownIcon className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
