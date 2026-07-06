"use client";

import { FlatPostList } from "@/components/thread/post-list/flat-post-list";
import { NestedPostList } from "@/components/thread/post-list/nested-post-list";
import type { ThreadDisplayMode } from "@/lib/forum/display-mode";
import type { ThreadPost } from "@/lib/forum/queries/thread-detail";

interface PostListProps {
  posts: ThreadPost[];
  displayMode: ThreadDisplayMode;
  isSignedIn: boolean;
  viewerFanProfileId?: number;
  onReply: (post: ThreadPost) => void;
  className?: string;
}

export function PostList({
  posts,
  displayMode,
  isSignedIn,
  viewerFanProfileId,
  onReply,
  className,
}: PostListProps) {
  if (posts.length === 0) {
    return null;
  }

  if (displayMode === "nested") {
    const op = posts.find((post) => post.isOp);
    return (
      <NestedPostList
        key={op?.id ?? "nested"}
        posts={posts}
        isSignedIn={isSignedIn}
        viewerFanProfileId={viewerFanProfileId}
        onReply={onReply}
        className={className}
      />
    );
  }

  return (
    <FlatPostList
      posts={posts}
      isSignedIn={isSignedIn}
      viewerFanProfileId={viewerFanProfileId}
      onReply={onReply}
      className={className}
    />
  );
}
