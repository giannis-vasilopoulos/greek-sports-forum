import { describe, expect, it } from "vitest";

import {
  buildPostTree,
  collectDefaultCollapsedPostIds,
  countPostTreeDescendants,
  getNestedIndentDepth,
  getNestedIndentPx,
  partitionTopLevelReplies,
  sortTopLevelByScore,
  TOP_LEVEL_BEST_FIRST_THRESHOLD,
} from "@/lib/forum/post-tree";
import type { PostTreeNode } from "@/lib/forum/post-tree";
import type { ThreadPost } from "@/lib/forum/queries/thread-detail";

function makePost(
  overrides: Partial<ThreadPost> & Pick<ThreadPost, "id" | "content">,
): ThreadPost {
  return {
    score: 0,
    likeCount: 0,
    isCollapsed: false,
    isFlagged: false,
    isEdited: false,
    parentId: null,
    parentAuthorName: null,
    authorName: "Author",
    authorInitials: "AU",
    authorFanProfileId: 1,
    createdAt: new Date("2026-01-01T12:00:00Z"),
    relativeTime: "1η",
    viewerVote: null,
    isOp: false,
    ...overrides,
  };
}

function makeNode(
  post: ThreadPost,
  children: PostTreeNode[] = [],
): PostTreeNode {
  return { post, children };
}

describe("buildPostTree", () => {
  const op = makePost({
    id: 1,
    content: "OP",
    isOp: true,
    createdAt: new Date("2026-01-01T12:00:00Z"),
  });

  it("places parentId-null replies under the OP", () => {
    const reply = makePost({
      id: 2,
      content: "Top-level",
      parentId: null,
      createdAt: new Date("2026-01-01T12:01:00Z"),
    });

    const tree = buildPostTree([op, reply], op.id);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.post.id).toBe(2);
    expect(tree[0]?.children).toEqual([]);
  });

  it("nests reply-to-reply under its parent", () => {
    const parent = makePost({
      id: 2,
      content: "Parent",
      parentId: null,
      createdAt: new Date("2026-01-01T12:01:00Z"),
    });
    const child = makePost({
      id: 3,
      content: "Child",
      parentId: 2,
      createdAt: new Date("2026-01-01T12:02:00Z"),
    });

    const tree = buildPostTree([op, parent, child], op.id);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.post.id).toBe(2);
    expect(tree[0]?.children).toHaveLength(1);
    expect(tree[0]?.children[0]?.post.id).toBe(3);
  });

  it("sorts siblings by createdAt ascending", () => {
    const later = makePost({
      id: 3,
      content: "Later",
      parentId: null,
      createdAt: new Date("2026-01-01T12:03:00Z"),
    });
    const earlier = makePost({
      id: 2,
      content: "Earlier",
      parentId: null,
      createdAt: new Date("2026-01-01T12:01:00Z"),
    });

    const tree = buildPostTree([op, later, earlier], op.id);

    expect(tree.map((node) => node.post.id)).toEqual([2, 3]);
  });

  it("falls back to OP when parent is missing from visible posts", () => {
    const orphan = makePost({
      id: 4,
      content: "Orphan",
      parentId: 999,
      createdAt: new Date("2026-01-01T12:04:00Z"),
    });

    const tree = buildPostTree([op, orphan], op.id);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.post.id).toBe(4);
  });

  it("accepts explicit replies to the OP", () => {
    const replyToOp = makePost({
      id: 2,
      content: "Reply to OP",
      parentId: op.id,
      createdAt: new Date("2026-01-01T12:01:00Z"),
    });

    const tree = buildPostTree([op, replyToOp], op.id);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.post.id).toBe(2);
  });
});

describe("countPostTreeDescendants", () => {
  it("counts all descendants in the subtree", () => {
    const child = makeNode(makePost({ id: 3, content: "Child" }));
    const parent = makeNode(makePost({ id: 2, content: "Parent" }), [child]);
    const sibling = makeNode(makePost({ id: 4, content: "Sibling" }));

    expect(countPostTreeDescendants(parent)).toBe(1);
    expect(countPostTreeDescendants(sibling)).toBe(0);
  });
});

describe("collectDefaultCollapsedPostIds", () => {
  it("excludes depth-1 branches and leaf nodes", () => {
    const grandchild = makeNode(makePost({ id: 4, content: "Grandchild" }));
    const child = makeNode(makePost({ id: 3, content: "Child" }), [grandchild]);
    const parent = makeNode(makePost({ id: 2, content: "Parent" }), [child]);
    const leaf = makeNode(makePost({ id: 5, content: "Leaf" }));

    expect(collectDefaultCollapsedPostIds([parent, leaf])).toEqual([3]);
  });

  it("includes depth-2+ branches with children at every level", () => {
    const greatGrandchild = makeNode(makePost({ id: 5, content: "Great" }));
    const grandchild = makeNode(makePost({ id: 4, content: "Grandchild" }), [
      greatGrandchild,
    ]);
    const child = makeNode(makePost({ id: 3, content: "Child" }), [grandchild]);
    const parent = makeNode(makePost({ id: 2, content: "Parent" }), [child]);

    expect(collectDefaultCollapsedPostIds([parent])).toEqual([3, 4]);
  });
});

describe("getNestedIndentDepth", () => {
  it("caps depth at the configured maximum", () => {
    expect(getNestedIndentDepth(0)).toBe(0);
    expect(getNestedIndentDepth(3)).toBe(3);
    expect(getNestedIndentDepth(8)).toBe(6);
    expect(getNestedIndentDepth(-1)).toBe(0);
  });
});

describe("getNestedIndentPx", () => {
  it("returns capped depth multiplied by indent step", () => {
    expect(getNestedIndentPx(2)).toBe(24);
    expect(getNestedIndentPx(8)).toBe(72);
  });
});

describe("sortTopLevelByScore", () => {
  it("sorts by score descending with createdAt tie-break", () => {
    const nodes = [
      makeNode(
        makePost({
          id: 1,
          content: "Low",
          score: 1,
          createdAt: new Date("2026-01-01T12:01:00Z"),
        }),
      ),
      makeNode(
        makePost({
          id: 2,
          content: "High",
          score: 10,
          createdAt: new Date("2026-01-01T12:02:00Z"),
        }),
      ),
      makeNode(
        makePost({
          id: 3,
          content: "Tie older",
          score: 5,
          createdAt: new Date("2026-01-01T12:01:00Z"),
        }),
      ),
      makeNode(
        makePost({
          id: 4,
          content: "Tie newer",
          score: 5,
          createdAt: new Date("2026-01-01T12:03:00Z"),
        }),
      ),
    ];

    expect(sortTopLevelByScore(nodes).map((node) => node.post.id)).toEqual([
      2, 3, 4, 1,
    ]);
  });
});

describe("partitionTopLevelReplies", () => {
  it("returns all nodes chronologically when under threshold", () => {
    const nodes = [
      makeNode(makePost({ id: 1, content: "A" })),
      makeNode(makePost({ id: 2, content: "B" })),
    ];

    const result = partitionTopLevelReplies(nodes, false);

    expect(result.visible).toEqual(nodes);
    expect(result.hiddenCount).toBe(0);
    expect(result.shouldShowExpand).toBe(false);
  });

  it("returns top scored nodes when above threshold and collapsed", () => {
    const nodes = Array.from(
      { length: TOP_LEVEL_BEST_FIRST_THRESHOLD + 3 },
      (_, index) =>
        makeNode(
          makePost({
            id: index + 1,
            content: `Reply ${index + 1}`,
            score: index + 1,
            createdAt: new Date(
              `2026-01-01T12:${String(index + 1).padStart(2, "0")}:00Z`,
            ),
          }),
        ),
    );

    const result = partitionTopLevelReplies(nodes, false);

    expect(result.visible).toHaveLength(TOP_LEVEL_BEST_FIRST_THRESHOLD);
    expect(result.hiddenCount).toBe(3);
    expect(result.shouldShowExpand).toBe(true);
    expect(result.visible[0]?.post.score).toBe(
      TOP_LEVEL_BEST_FIRST_THRESHOLD + 3,
    );
  });

  it("returns all nodes chronologically when expanded", () => {
    const nodes = Array.from(
      { length: TOP_LEVEL_BEST_FIRST_THRESHOLD + 3 },
      (_, index) =>
        makeNode(
          makePost({
            id: index + 1,
            content: `Reply ${index + 1}`,
            score: index + 1,
            createdAt: new Date(
              `2026-01-01T12:${String(index + 1).padStart(2, "0")}:00Z`,
            ),
          }),
        ),
    );

    const result = partitionTopLevelReplies(nodes, true);

    expect(result.visible).toHaveLength(nodes.length);
    expect(result.shouldShowExpand).toBe(false);
  });
});
