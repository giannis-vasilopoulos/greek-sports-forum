"use client";

import { PostCard } from "@/components/thread/post-card";
import {
  BestFirstExpandButton,
  BestFirstHelper,
} from "@/components/thread/post-list/best-first-controls";
import { canVoteOnPost } from "@/components/thread/post-list/can-vote-on-post";
import { PostTreeBranch } from "@/components/thread/post-list/post-tree-branch";
import { copy } from "@/lib/copy";
import type { ThreadPost } from "@/lib/forum/queries/thread-detail";
import { cn } from "@/lib/utils";
import { useNestedReplyTree } from "@/hooks/thread/use-nested-reply-tree";
import { useThreadCollapse } from "@/hooks/thread/use-thread-collapse";

const t = copy.thread.post;

interface NestedPostListProps {
  posts: ThreadPost[];
  isSignedIn: boolean;
  viewerFanProfileId?: number;
  onReply: (post: ThreadPost) => void;
  className?: string;
}

export function NestedPostList({
  posts,
  isSignedIn,
  viewerFanProfileId,
  onReply,
  className,
}: NestedPostListProps) {
  const {
    op,
    replyTree,
    visible,
    shouldShowExpand,
    showAllTopLevel,
    setShowAllTopLevel,
  } = useNestedReplyTree(posts);
  const { toggleThreadCollapse, isThreadCollapsed } =
    useThreadCollapse(replyTree);

  if (!op) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <PostCard
        post={op}
        isSignedIn={isSignedIn}
        canVote={canVoteOnPost(viewerFanProfileId, op)}
        onReply={onReply}
        nested
      />

      <section aria-label={t.listAriaLabel} className="flex flex-col gap-1">
        <BestFirstHelper
          visibleCount={visible.length}
          totalCount={replyTree.length}
          shouldShowExpand={shouldShowExpand}
          showAllTopLevel={showAllTopLevel}
        />

        <PostTreeBranch
          nodes={visible}
          depth={1}
          isSignedIn={isSignedIn}
          viewerFanProfileId={viewerFanProfileId}
          onReply={onReply}
          isThreadCollapsed={isThreadCollapsed}
          toggleThreadCollapse={toggleThreadCollapse}
        />

        <BestFirstExpandButton
          totalCount={replyTree.length}
          shouldShowExpand={shouldShowExpand}
          showAllTopLevel={showAllTopLevel}
          onShowAll={() => setShowAllTopLevel(true)}
        />

        {replyTree.length === 0 && (
          <p className="text-muted-foreground py-6 text-center text-[13px]">
            {copy.feed.matchThreads.emptyFiltered}
          </p>
        )}
      </section>
    </div>
  );
}
