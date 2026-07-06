import type { ThreadPost } from "@/lib/forum/queries/thread-detail";

export type PostTreeNode = {
  post: ThreadPost;
  children: PostTreeNode[];
};

export const TOP_LEVEL_BEST_FIRST_THRESHOLD = 12;

/** PostTreeBranch starts at depth 1; branches at this depth and below collapse by default. */
export const DEFAULT_COLLAPSED_MIN_DEPTH = 2;

const MAX_NEST_INDENT_DEPTH = 6;
const NEST_INDENT_PX = 12;

export function getNestedIndentDepth(
  depth: number,
  max = MAX_NEST_INDENT_DEPTH,
): number {
  return Math.min(Math.max(depth, 0), max);
}

export function getNestedIndentPx(
  depth: number,
  max = MAX_NEST_INDENT_DEPTH,
): number {
  return getNestedIndentDepth(depth, max) * NEST_INDENT_PX;
}

export function countPostTreeDescendants(node: PostTreeNode): number {
  return node.children.reduce(
    (total, child) => total + 1 + countPostTreeDescendants(child),
    0,
  );
}

export function collectDefaultCollapsedPostIds(
  nodes: PostTreeNode[],
  depth = 1,
  minDepth = DEFAULT_COLLAPSED_MIN_DEPTH,
): number[] {
  const ids: number[] = [];

  for (const node of nodes) {
    if (depth >= minDepth && node.children.length > 0) {
      ids.push(node.post.id);
    }

    if (node.children.length > 0) {
      ids.push(
        ...collectDefaultCollapsedPostIds(node.children, depth + 1, minDepth),
      );
    }
  }

  return ids;
}

export function sortTopLevelByScore(nodes: PostTreeNode[]): PostTreeNode[] {
  return [...nodes].sort((left, right) => {
    if (right.post.score !== left.post.score) {
      return right.post.score - left.post.score;
    }

    return left.post.createdAt.getTime() - right.post.createdAt.getTime();
  });
}

export function partitionTopLevelReplies(
  nodes: PostTreeNode[],
  showAll: boolean,
  threshold = TOP_LEVEL_BEST_FIRST_THRESHOLD,
): {
  visible: PostTreeNode[];
  hiddenCount: number;
  shouldShowExpand: boolean;
} {
  if (showAll || nodes.length <= threshold) {
    return {
      visible: nodes,
      hiddenCount: 0,
      shouldShowExpand: false,
    };
  }

  const ranked = sortTopLevelByScore(nodes);

  return {
    visible: ranked.slice(0, threshold),
    hiddenCount: nodes.length - threshold,
    shouldShowExpand: true,
  };
}

export function buildPostTree(
  posts: ThreadPost[],
  opPostId: number,
): PostTreeNode[] {
  const visibleIds = new Set(posts.map((post) => post.id));
  const replies = posts.filter((post) => !post.isOp);
  const childrenByParentId = new Map<number, ThreadPost[]>();

  for (const reply of replies) {
    const parentKey =
      reply.parentId !== null && visibleIds.has(reply.parentId)
        ? reply.parentId
        : opPostId;

    const siblings = childrenByParentId.get(parentKey) ?? [];
    siblings.push(reply);
    childrenByParentId.set(parentKey, siblings);
  }

  function buildNodes(parentId: number): PostTreeNode[] {
    const siblings = childrenByParentId.get(parentId) ?? [];

    return siblings
      .sort(
        (left, right) => left.createdAt.getTime() - right.createdAt.getTime(),
      )
      .map((post) => ({
        post,
        children: buildNodes(post.id),
      }));
  }

  return buildNodes(opPostId);
}
