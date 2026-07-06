"use client";

import { useMemo } from "react";

import { PostCard } from "@/components/thread/post-card";
import { canVoteOnPost } from "@/components/thread/post-list/can-vote-on-post";
import { copy } from "@/lib/copy";
import type { ThreadPost } from "@/lib/forum/queries/thread-detail";
import { cn } from "@/lib/utils";

const t = copy.thread.post;

interface FlatPostListProps {
  posts: ThreadPost[];
  isSignedIn: boolean;
  viewerFanProfileId?: number;
  onReply: (post: ThreadPost) => void;
  className?: string;
}

export function FlatPostList({
  posts,
  isSignedIn,
  viewerFanProfileId,
  onReply,
  className,
}: FlatPostListProps) {
  const replyPosts = useMemo(() => posts.filter((post) => !post.isOp), [posts]);

  return (
    <section
      aria-label={t.listAriaLabel}
      className={cn("flex flex-col", className)}
    >
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isSignedIn={isSignedIn}
          canVote={canVoteOnPost(viewerFanProfileId, post)}
          onReply={onReply}
        />
      ))}

      {replyPosts.length === 0 && posts.length === 1 && (
        <p className="text-muted-foreground py-6 text-center text-[13px]">
          {copy.feed.matchThreads.emptyFiltered}
        </p>
      )}
    </section>
  );
}
