import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import {
  createReply,
  type CreateReplyState,
} from "@/lib/forum/actions/create-reply";
import { buildSignInHref } from "@/lib/auth/redirect";
import { copy } from "@/lib/copy";
import {
  clearReplyDraft,
  readReplyDraft,
  saveReplyDraft,
} from "@/lib/forum/reply-draft";
import type { ReplyComposerTarget } from "@/components/thread/reply-composer";

type SubmitReplyInput = {
  threadId: number;
  content: string;
  isSignedIn: boolean;
  hasFanProfileForLeague: boolean;
  canReply: boolean;
  blockMessage?: string | null;
  replyTarget?: ReplyComposerTarget | null;
  pathname: string;
  router: AppRouterInstance;
  setError: (message: string | null) => void;
  resetForm: () => void;
  onClearReplyTarget?: () => void;
};

function resolveParentId(
  threadId: number,
  replyTarget?: ReplyComposerTarget | null,
) {
  const draft = readReplyDraft(threadId);
  return replyTarget?.parentId ?? draft?.parentId ?? null;
}

export async function submitReply(input: SubmitReplyInput): Promise<void> {
  const trimmed = input.content.trim();
  if (trimmed.length < 2) return;

  const parentId = resolveParentId(input.threadId, input.replyTarget);
  const draft = readReplyDraft(input.threadId);

  if (!input.isSignedIn) {
    saveReplyDraft(input.threadId, {
      content: trimmed,
      parentId: parentId ?? undefined,
      replyToAuthor: input.replyTarget?.replyToAuthor ?? draft?.replyToAuthor,
    });
    input.router.push(buildSignInHref(input.pathname));
    return;
  }

  if (!input.hasFanProfileForLeague) {
    saveReplyDraft(input.threadId, {
      content: trimmed,
      parentId: parentId ?? undefined,
      replyToAuthor: input.replyTarget?.replyToAuthor ?? draft?.replyToAuthor,
    });
    input.router.push("/onboarding");
    return;
  }

  if (!input.canReply) {
    input.setError(input.blockMessage ?? copy.thread.errors.generic);
    return;
  }

  const result: CreateReplyState = await createReply({
    threadId: input.threadId,
    content: trimmed,
    parentId,
  });

  if (result.fieldErrors?.content) {
    input.setError(result.fieldErrors.content);
    return;
  }

  if (result.error) {
    input.setError(result.error);
    return;
  }

  clearReplyDraft(input.threadId);
  input.resetForm();
  input.onClearReplyTarget?.();
  input.router.refresh();
}
