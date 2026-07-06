"use client";

import { useCallback, useMemo, useState } from "react";

import type { ThreadDisplayMode } from "@/lib/forum/display-mode";
import type { ThreadPost } from "@/lib/forum/queries/thread-detail";
import {
  buildPostTree,
  collectDefaultCollapsedPostIds,
  countPostTreeDescendants,
  partitionTopLevelReplies,
  type PostTreeNode,
} from "@/lib/forum/post-tree";
import { copy } from "@/lib/copy";
import { PostCard } from "@/components/thread/post-card";
import type { ReplyComposerTarget } from "@/components/thread/reply-composer";
import { cn } from "@/lib/utils";

const t = copy.thread.post;

interface PostListProps {
  posts: ThreadPost[];
  displayMode: ThreadDisplayMode;
  isSignedIn: boolean;
  viewerFanProfileId?: number;
  onReply: (post: ThreadPost) => void;
  className?: string;
}

function canVoteOnPost(
  viewerFanProfileId: number | undefined,
  post: ThreadPost,
): boolean {
  return (
    viewerFanProfileId !== undefined &&
    viewerFanProfileId !== post.authorFanProfileId
  );
}

function useNestedReplyTree(posts: ThreadPost[]) {
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

function useThreadCollapse(replyTree: PostTreeNode[]) {
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

interface BestFirstHelperProps {
  visibleCount: number;
  totalCount: number;
  shouldShowExpand: boolean;
  showAllTopLevel: boolean;
}

function BestFirstHelper({
  visibleCount,
  totalCount,
  shouldShowExpand,
  showAllTopLevel,
}: BestFirstHelperProps) {
  if (!shouldShowExpand || showAllTopLevel) {
    return null;
  }

  return (
    <p className="text-muted-foreground text-[12px]">
      {t.showingBestReplies(visibleCount, totalCount)}
    </p>
  );
}

interface BestFirstExpandButtonProps {
  totalCount: number;
  shouldShowExpand: boolean;
  showAllTopLevel: boolean;
  onShowAll: () => void;
}

function BestFirstExpandButton({
  totalCount,
  shouldShowExpand,
  showAllTopLevel,
  onShowAll,
}: BestFirstExpandButtonProps) {
  if (!shouldShowExpand || showAllTopLevel) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onShowAll}
      className="text-primary hover:text-primary/80 cursor-pointer self-start text-[12px] font-medium transition-colors duration-200"
    >
      {t.showAllReplies(totalCount)}
    </button>
  );
}

interface PostTreeBranchProps {
  nodes: PostTreeNode[];
  depth: number;
  isSignedIn: boolean;
  viewerFanProfileId?: number;
  onReply: (post: ThreadPost) => void;
  isThreadCollapsed: (postId: number) => boolean;
  toggleThreadCollapse: (postId: number) => void;
}

function PostTreeBranch({
  nodes,
  depth,
  isSignedIn,
  viewerFanProfileId,
  onReply,
  isThreadCollapsed,
  toggleThreadCollapse,
}: PostTreeBranchProps) {
  return (
    <>
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const threadCollapsed = isThreadCollapsed(node.post.id);

        return (
          <div key={node.post.id} className="flex flex-col gap-0.5">
            <PostCard
              post={node.post}
              isSignedIn={isSignedIn}
              canVote={canVoteOnPost(viewerFanProfileId, node.post)}
              onReply={onReply}
              nested
              depth={depth}
              hasChildren={hasChildren}
              descendantCount={countPostTreeDescendants(node)}
              threadCollapsed={threadCollapsed}
              onToggleThreadCollapse={
                hasChildren
                  ? () => toggleThreadCollapse(node.post.id)
                  : undefined
              }
            />
            {hasChildren && !threadCollapsed && (
              <PostTreeBranch
                nodes={node.children}
                depth={depth + 1}
                isSignedIn={isSignedIn}
                viewerFanProfileId={viewerFanProfileId}
                onReply={onReply}
                isThreadCollapsed={isThreadCollapsed}
                toggleThreadCollapse={toggleThreadCollapse}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

function FlatPostList({
  posts,
  isSignedIn,
  viewerFanProfileId,
  onReply,
  className,
}: Omit<PostListProps, "displayMode">) {
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

function NestedPostList({
  posts,
  isSignedIn,
  viewerFanProfileId,
  onReply,
  className,
}: Omit<PostListProps, "displayMode">) {
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
