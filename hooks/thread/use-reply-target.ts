"use client";

import { useState } from "react";

import type { ReplyComposerTarget } from "@/components/thread/reply-composer";
import type { ThreadPost } from "@/lib/forum/queries/thread-detail";

export function useReplyTarget() {
  const [replyTarget, setReplyTarget] = useState<ReplyComposerTarget | null>(
    null,
  );

  function handleReply(post: ThreadPost) {
    setReplyTarget({
      parentId: post.id,
      replyToAuthor: post.authorName,
    });
  }

  function clearReplyTarget() {
    setReplyTarget(null);
  }

  return { replyTarget, handleReply, clearReplyTarget, setReplyTarget };
}
