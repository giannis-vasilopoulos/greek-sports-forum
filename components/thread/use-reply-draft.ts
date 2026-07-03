"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  readReplyDraft,
  replyDraftStorageKey,
  type ReplyDraft,
} from "@/lib/forum/reply-draft";

type DraftSnapshotCache = {
  raw: string | null;
  value: ReplyDraft | null;
};

const snapshotCache = new Map<number, DraftSnapshotCache>();

function getCachedReplyDraft(threadId: number): ReplyDraft | null {
  if (typeof window === "undefined") return null;

  const key = replyDraftStorageKey(threadId);
  const raw = window.localStorage.getItem(key);
  const cached = snapshotCache.get(threadId);

  if (cached && cached.raw === raw) {
    return cached.value;
  }

  const value = readReplyDraft(threadId);
  const rawAfter = window.localStorage.getItem(key);
  snapshotCache.set(threadId, { raw: rawAfter, value });
  return value;
}

export function useReplyDraft(threadId: number): ReplyDraft | null {
  const getSnapshot = useCallback(
    () => getCachedReplyDraft(threadId),
    [threadId],
  );

  return useSyncExternalStore(
    () => () => {},
    getSnapshot,
    () => null,
  );
}
