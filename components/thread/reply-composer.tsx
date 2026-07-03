"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { submitReply } from "@/components/thread/reply-submit";
import { useReplyDraft } from "@/components/thread/use-reply-draft";
import { buildSignInHref } from "@/lib/auth/redirect";
import { copy } from "@/lib/copy";
import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const t = copy.thread.composer;

export type ReplyComposerTarget = {
  parentId?: number;
  replyToAuthor?: string;
};

interface ReplyComposerProps {
  threadId: number;
  leagueSlug: string;
  isSignedIn: boolean;
  hasFanProfileForLeague: boolean;
  canReply: boolean;
  blockMessage?: string | null;
  replyTarget?: ReplyComposerTarget | null;
  onClearReplyTarget?: () => void;
  className?: string;
  sticky?: boolean;
}

// fallow-ignore-next-line complexity
export function ReplyComposer({
  threadId,
  isSignedIn,
  hasFanProfileForLeague,
  canReply,
  blockMessage,
  replyTarget,
  onClearReplyTarget,
  className,
  sticky = false,
}: ReplyComposerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const storedDraft = useReplyDraft(threadId);
  const [pending, startTransition] = useTransition();
  const [localContent, setLocalContent] = useState<string | null>(null);
  const [draftBannerDismissed, setDraftBannerDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const content = localContent ?? storedDraft?.content ?? "";
  const showDraftBanner =
    !draftBannerDismissed &&
    Boolean(storedDraft?.content) &&
    localContent === null;

  function resetForm() {
    setLocalContent("");
    setDraftBannerDismissed(true);
  }

  function submitReplyForm() {
    setError(null);

    startTransition(() => {
      void submitReply({
        threadId,
        content,
        isSignedIn,
        hasFanProfileForLeague,
        canReply,
        blockMessage,
        replyTarget,
        pathname,
        router,
        setError,
        resetForm,
        onClearReplyTarget,
      });
    });
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    submitReplyForm();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      submitReplyForm();
    }
  }

  return (
    <div
      className={cn(
        "border-border bg-background",
        sticky &&
          "fixed right-0 bottom-0 left-0 z-40 border-t px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      {!isSignedIn && (
        <p className="text-muted-foreground mb-2 text-[12px]">
          {copy.thread.conversion.joinDiscussion}{" "}
          <Link
            href={buildSignInHref(pathname)}
            className="text-primary font-medium hover:underline"
          >
            {t.signInLink}
          </Link>
        </p>
      )}

      {isSignedIn && !hasFanProfileForLeague && (
        <p className="border-border bg-muted/30 mb-3 rounded-lg border px-3 py-2 text-sm">
          {t.fanProfilePrompt}{" "}
          <Link
            href="/onboarding"
            className="text-primary font-medium hover:underline"
          >
            {t.fanProfileLink}
          </Link>
        </p>
      )}

      {showDraftBanner && (
        <p className="border-primary/30 bg-primary/5 text-foreground mb-3 rounded-lg border px-3 py-2 text-[12px]">
          {t.draftRestored}
        </p>
      )}

      {replyTarget?.replyToAuthor && (
        <div className="bg-muted/40 mb-2 flex items-center justify-between rounded-md px-3 py-2 text-[12px]">
          <span>{t.replyTo(replyTarget.replyToAuthor)}</span>
          {onClearReplyTarget && (
            <button
              type="button"
              onClick={onClearReplyTarget}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {t.cancelReply}
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`reply-${threadId}`} className="sr-only">
              {t.label}
            </Label>
            <Textarea
              ref={textareaRef}
              id={`reply-${threadId}`}
              value={content}
              onChange={(event) => setLocalContent(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              rows={sticky ? 2 : 4}
              disabled={Boolean(blockMessage && isSignedIn && !canReply)}
              className="min-h-[72px] resize-y text-[13px]"
            />
          </div>

          {error && <FieldError>{error}</FieldError>}

          <div className="mt-2 flex items-center justify-between gap-3">
            {!isSignedIn ? (
              <span className="text-muted-foreground text-[11px]">
                {t.guestSubmitHint}
              </span>
            ) : (
              <span className="text-muted-foreground text-[11px]">
                Ctrl+Enter
              </span>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={
                pending ||
                content.trim().length < 2 ||
                Boolean(isSignedIn && blockMessage && !canReply)
              }
            >
              {pending ? t.submitting : t.submit}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
