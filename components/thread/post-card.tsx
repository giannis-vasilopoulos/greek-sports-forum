"use client";

import { Minus, Plus } from "lucide-react";

import type { ThreadPost } from "@/lib/forum/queries/thread-detail";
import { copy } from "@/lib/copy";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VoteControls } from "@/components/thread/vote-controls";
import { getNestedIndentPx } from "@/lib/forum/post-tree";
import { cn } from "@/lib/utils";

const t = copy.thread.post;
const m = copy.moderation;

interface PostCardProps {
  post: ThreadPost;
  isSignedIn: boolean;
  canVote: boolean;
  onReply?: (post: ThreadPost) => void;
  nested?: boolean;
  depth?: number;
  hasChildren?: boolean;
  descendantCount?: number;
  threadCollapsed?: boolean;
  onToggleThreadCollapse?: () => void;
  className?: string;
}

export function PostCard({
  post,
  isSignedIn,
  canVote,
  onReply,
  nested = false,
  depth = 0,
  hasChildren = false,
  descendantCount = 0,
  threadCollapsed = false,
  onToggleThreadCollapse,
  className,
}: PostCardProps) {
  const moderationCollapsed = post.isCollapsed;
  const isNestedReply = nested && depth >= 1;
  const showCollapseControl =
    depth >= 1 && hasChildren && onToggleThreadCollapse;
  const hideContent = moderationCollapsed || threadCollapsed;

  return (
    <article
      className={cn(
        "border-border flex gap-3 px-1 py-3 transition-colors duration-200",
        !nested && "border-b last:border-b-0",
        post.isOp && "bg-muted/20 rounded-lg border px-3",
        isNestedReply && "border-l pl-3",
        threadCollapsed && "py-2",
        className,
      )}
      style={
        isNestedReply
          ? { marginInlineStart: `${getNestedIndentPx(depth)}px` }
          : undefined
      }
    >
      <VoteControls
        postId={post.id}
        score={post.score}
        viewerVote={post.viewerVote}
        isSignedIn={isSignedIn}
        canVote={canVote && post.authorFanProfileId !== undefined}
      />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          {showCollapseControl && (
            <button
              type="button"
              onClick={onToggleThreadCollapse}
              aria-expanded={!threadCollapsed}
              aria-label={threadCollapsed ? t.expandBranch : t.collapseBranch}
              className="text-muted-foreground hover:text-primary border-border flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border transition-colors duration-200"
            >
              {threadCollapsed ? (
                <Plus className="size-3" aria-hidden />
              ) : (
                <Minus className="size-3" aria-hidden />
              )}
            </button>
          )}

          <Avatar size="sm">
            <AvatarFallback className="text-[10px]">
              {post.authorInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-foreground text-[13px] font-medium">
            {post.authorName}
          </span>
          <span className="text-muted-foreground text-[11px]">
            {post.relativeTime}
          </span>
          {post.isOp && (
            <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
              {t.op}
            </Badge>
          )}
        </div>

        {moderationCollapsed ? (
          <p className="text-muted-foreground text-[12px] italic">
            {m.postCollapsed}
          </p>
        ) : (
          <>
            <p className="text-foreground text-[13px] leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
            {threadCollapsed && (
              <button
                type="button"
                onClick={onToggleThreadCollapse}
                className="text-muted-foreground hover:text-primary cursor-pointer text-[12px] font-medium transition-colors duration-200"
              >
                {t.hiddenReplies(descendantCount)}
              </button>
            )}
          </>
        )}

        {post.isFlagged && !hideContent && (
          <p className="text-muted-foreground mt-1 text-[11px]">
            {m.postFlagged}
          </p>
        )}

        {onReply && !hideContent && (
          <button
            type="button"
            onClick={() => onReply(post)}
            className="text-muted-foreground hover:text-primary mt-2 cursor-pointer text-[11px] font-medium transition-colors duration-200"
          >
            {t.reply}
          </button>
        )}
      </div>
    </article>
  );
}
