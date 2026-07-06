"use client";

import { useMemo, useState } from "react";

import { buildPostTree, partitionTopLevelReplies } from "@/lib/forum/post-tree";
import type { ThreadPost } from "@/lib/forum/queries/thread-detail";

export function useNestedReplyTree(posts: ThreadPost[]) {
  const [showAllTopLevel, setShowAllTopLevel] = useState(false);
  const op = posts.find((post) => post.isOp);
  const replyTree = useMemo(
    () => (op ? buildPostTree(posts, op.id) : []),
    [op, posts],
  );
  const { visible, shouldShowExpand } = useMemo(
    () => partitionTopLevelReplies(replyTree, showAllTopLevel),
    [replyTree, showAllTopLevel],
  );

  return {
    op,
    replyTree,
    visible,
    shouldShowExpand,
    showAllTopLevel,
    setShowAllTopLevel,
  };
}
