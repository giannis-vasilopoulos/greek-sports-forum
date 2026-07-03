"use client";

import type { ThreadPost } from "@/lib/forum/queries/thread-detail";
import { copy } from "@/lib/copy";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VoteControls } from "@/components/thread/vote-controls";
import { cn } from "@/lib/utils";

const t = copy.thread.post;
const m = copy.moderation;

interface PostCardProps {
  post: ThreadPost;
  isSignedIn: boolean;
  canVote: boolean;
  onReply?: (post: ThreadPost) => void;
  className?: string;
}

// fallow-ignore-next-line complexity
export function PostCard({
  post,
  isSignedIn,
  canVote,
  onReply,
  className,
}: PostCardProps) {
  const collapsed = post.isCollapsed;

  return (
    <article
      className={cn(
        "border-border flex gap-3 border-b px-1 py-3 last:border-b-0",
        post.isOp && "bg-muted/20 rounded-lg border px-3",
        className,
      )}
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

        {post.parentAuthorName && (
          <p className="text-muted-foreground mb-1.5 text-[11px]">
            {copy.thread.composer.replyTo(post.parentAuthorName)}
          </p>
        )}

        {collapsed ? (
          <p className="text-muted-foreground text-[12px] italic">
            {m.postCollapsed}
          </p>
        ) : (
          <p className="text-foreground text-[13px] leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        )}

        {post.isFlagged && (
          <p className="text-muted-foreground mt-1 text-[11px]">
            {m.postFlagged}
          </p>
        )}

        {onReply && !collapsed && (
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
