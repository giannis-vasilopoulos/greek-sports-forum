"use client";

import { useCallback, useMemo, useState } from "react";

import {
  collectDefaultCollapsedPostIds,
  type PostTreeNode,
} from "@/lib/forum/post-tree";

export function useThreadCollapse(replyTree: PostTreeNode[]) {
  const defaultCollapsedIds = useMemo(
    () => new Set(collectDefaultCollapsedPostIds(replyTree)),
    [replyTree],
  );
  const [overrides, setOverrides] = useState<{
    expanded: Set<number>;
    collapsed: Set<number>;
  }>(() => ({
    expanded: new Set(),
    collapsed: new Set(),
  }));

  const isThreadCollapsed = useCallback(
    (postId: number) => {
      if (overrides.expanded.has(postId)) {
        return false;
      }

      if (overrides.collapsed.has(postId)) {
        return true;
      }

      return defaultCollapsedIds.has(postId);
    },
    [defaultCollapsedIds, overrides],
  );

  const toggleThreadCollapse = useCallback(
    (postId: number) => {
      setOverrides((previous) => {
        const expanded = new Set(previous.expanded);
        const collapsed = new Set(previous.collapsed);
        const currentlyCollapsed =
          !expanded.has(postId) &&
          (collapsed.has(postId) || defaultCollapsedIds.has(postId));

        if (currentlyCollapsed) {
          expanded.add(postId);
          collapsed.delete(postId);
        } else {
          expanded.delete(postId);
          collapsed.add(postId);
        }

        return { expanded, collapsed };
      });
    },
    [defaultCollapsedIds],
  );

  return { toggleThreadCollapse, isThreadCollapsed };
}
