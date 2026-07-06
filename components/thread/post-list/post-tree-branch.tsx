import { PostCard } from "@/components/thread/post-card";
import { canVoteOnPost } from "@/components/thread/post-list/can-vote-on-post";
import {
  countPostTreeDescendants,
  type PostTreeNode,
} from "@/lib/forum/post-tree";
import type { ThreadPost } from "@/lib/forum/queries/thread-detail";

interface PostTreeBranchProps {
  nodes: PostTreeNode[];
  depth: number;
  isSignedIn: boolean;
  viewerFanProfileId?: number;
  onReply: (post: ThreadPost) => void;
  isThreadCollapsed: (postId: number) => boolean;
  toggleThreadCollapse: (postId: number) => void;
}

export function PostTreeBranch({
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
