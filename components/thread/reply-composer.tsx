"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { submitReply } from "@/components/thread/reply-submit";
import { useReplyDraft } from "@/components/thread/use-reply-draft";
import { buildSignInHref } from "@/lib/auth/redirect";
import { copy } from "@/lib/copy";
import { useBottomChromePublisher } from "@/lib/layout/bottom-chrome";
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
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
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
  expanded = true,
  onExpandedChange,
}: ReplyComposerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const storedDraft = useReplyDraft(threadId);
  const [pending, startTransition] = useTransition();
  const [localContent, setLocalContent] = useState<string | null>(null);
  const [draftBannerDismissed, setDraftBannerDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outerRef = useBottomChromePublisher(sticky);

  const fieldId = sticky
    ? `reply-mobile-${threadId}`
    : `reply-desktop-${threadId}`;
  const content = localContent ?? storedDraft?.content ?? "";
  const showDraftBanner =
    !draftBannerDismissed &&
    Boolean(storedDraft?.content) &&
    localContent === null;
  const isCollapsed = sticky && !expanded;

  function resetForm() {
    setLocalContent("");
    setDraftBannerDismissed(true);
    if (sticky) {
      onExpandedChange?.(false);
    }
  }

  function handleClearReplyTarget() {
    onClearReplyTarget?.();
    if (sticky) {
      onExpandedChange?.(false);
    }
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
        onClearReplyTarget: handleClearReplyTarget,
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

  useEffect(() => {
    if (!replyTarget) return;

    onExpandedChange?.(true);
    requestAnimationFrame(() => {
      textareaRef.current?.focus({ preventScroll: !sticky });
    });
  }, [replyTarget, sticky, onExpandedChange]);

  useEffect(() => {
    if (!showDraftBanner) return;
    onExpandedChange?.(true);
  }, [showDraftBanner, onExpandedChange]);

  if (isCollapsed) {
    return (
      <div
        ref={outerRef}
        className={cn(
          "border-border bg-background fixed right-0 bottom-0 left-0 z-40 border-t px-4 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.06)]",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onExpandedChange?.(true)}
            aria-label={t.expandComposer}
            className="text-muted-foreground min-w-0 flex-1 truncate text-left text-[13px]"
          >
            {replyTarget?.replyToAuthor
              ? t.replyTo(replyTarget.replyToAuthor)
              : t.placeholder}
          </button>
          {!isSignedIn && (
            <Link
              href={buildSignInHref(pathname)}
              className="text-primary shrink-0 text-[12px] font-medium hover:underline"
            >
              {t.signInLink}
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={outerRef}
      className={cn(
        "border-border bg-background",
        sticky &&
          "fixed right-0 bottom-0 left-0 z-40 border-t px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      {sticky && onExpandedChange && (
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={() => onExpandedChange(false)}
            className="text-muted-foreground hover:text-foreground cursor-pointer text-[11px] font-medium"
          >
            {t.collapseComposer}
          </button>
        </div>
      )}

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
              onClick={handleClearReplyTarget}
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
            <Label htmlFor={fieldId} className="sr-only">
              {t.label}
            </Label>
            <Textarea
              ref={textareaRef}
              id={fieldId}
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
