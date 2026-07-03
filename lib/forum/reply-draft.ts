const DRAFT_PREFIX = "kerkida:reply-draft:";
const MAX_DRAFT_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export type ReplyDraft = {
  content: string;
  parentId?: number;
  replyToAuthor?: string;
  savedAt: number;
};

function draftKey(threadId: number): string {
  return `${DRAFT_PREFIX}${threadId}`;
}

export function replyDraftStorageKey(threadId: number): string {
  return draftKey(threadId);
}

export function saveReplyDraft(
  threadId: number,
  draft: Omit<ReplyDraft, "savedAt">,
) {
  if (typeof window === "undefined") return;

  const payload: ReplyDraft = {
    ...draft,
    savedAt: Date.now(),
  };

  try {
    window.localStorage.setItem(draftKey(threadId), JSON.stringify(payload));
  } catch {
    // Ignore quota or private-mode errors.
  }
}

export function readReplyDraft(threadId: number): ReplyDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(draftKey(threadId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ReplyDraft;
    if (!parsed.content || typeof parsed.savedAt !== "number") {
      return null;
    }

    if (Date.now() - parsed.savedAt > MAX_DRAFT_AGE_MS) {
      clearReplyDraft(threadId);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearReplyDraft(threadId: number) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(draftKey(threadId));
  } catch {
    // Ignore storage errors.
  }
}
