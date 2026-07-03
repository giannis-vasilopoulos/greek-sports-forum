"use client";

import { useMemo, useState } from "react";

import type { ThreadPost } from "@/lib/forum/queries/thread-detail";
import { copy } from "@/lib/copy";
import { PostCard } from "@/components/thread/post-card";
import type { ReplyComposerTarget } from "@/components/thread/reply-composer";
import { cn } from "@/lib/utils";

const t = copy.thread.post;

interface PostListProps {
  posts: ThreadPost[];
  isSignedIn: boolean;
  viewerFanProfileId?: number;
  onReply: (post: ThreadPost) => void;
  className?: string;
}

export function PostList({
  posts,
  isSignedIn,
  viewerFanProfileId,
  onReply,
  className,
}: PostListProps) {
  const replyPosts = useMemo(() => posts.filter((post) => !post.isOp), [posts]);

  if (posts.length === 0) {
    return null;
  }

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
          canVote={
            viewerFanProfileId !== undefined &&
            viewerFanProfileId !== post.authorFanProfileId
          }
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
