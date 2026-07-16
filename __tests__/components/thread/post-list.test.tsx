import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PostList } from "@/components/thread/post-list";
import { copy } from "@/lib/copy";
import { TOP_LEVEL_BEST_FIRST_THRESHOLD } from "@/lib/forum/post-tree";
import type { ThreadPost } from "@/lib/forum/queries/thread-detail";

vi.mock("@/components/thread/vote-controls", () => ({
  VoteControls: () => <div data-testid="vote-controls" />,
}));

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

afterEach(() => {
  cleanup();
});

describe("PostList nested mode", () => {
  it("renders OP once and nests child replies with cumulative indent", () => {
    const op = makePost({
      id: 1,
      content: "Opening post",
      isOp: true,
    });
    const parent = makePost({
      id: 2,
      content: "Parent reply",
      createdAt: new Date("2026-01-01T12:01:00Z"),
    });
    const child = makePost({
      id: 3,
      content: "Nested reply",
      parentId: 2,
      parentAuthorName: "Author",
      createdAt: new Date("2026-01-01T12:02:00Z"),
    });

    render(
      <PostList
        posts={[op, parent, child]}
        displayMode="nested"
        isSignedIn={false}
        onReply={vi.fn()}
      />,
    );

    expect(screen.getAllByText("Opening post")).toHaveLength(1);
    expect(
      screen.getByRole("region", { name: copy.thread.post.listAriaLabel }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(copy.thread.composer.replyTo("Author")),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Nested reply").closest("article")).toHaveStyle({
      marginInlineStart: "24px",
    });
  });

  it("does not show collapse control on OP even when replies exist", () => {
    const op = makePost({
      id: 1,
      content: "Opening post",
      isOp: true,
    });
    const parent = makePost({
      id: 2,
      content: "Parent reply",
      createdAt: new Date("2026-01-01T12:01:00Z"),
    });
    const child = makePost({
      id: 3,
      content: "Nested reply",
      parentId: 2,
      parentAuthorName: "Author",
      createdAt: new Date("2026-01-01T12:02:00Z"),
    });

    render(
      <PostList
        posts={[op, parent, child]}
        displayMode="nested"
        isSignedIn={false}
        onReply={vi.fn()}
      />,
    );

    const opArticle = screen.getByText("Opening post").closest("article");
    expect(opArticle).not.toBeNull();
    expect(
      within(opArticle!).queryByRole("button", {
        name: copy.thread.post.collapseBranch,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: copy.thread.post.listAriaLabel }),
    ).toBeInTheDocument();
    expect(screen.getByText("Parent reply")).toBeInTheDocument();
  });

  it("shows depth-1 reply body and depth-2 leaf content by default", () => {
    const op = makePost({
      id: 1,
      content: "Opening post",
      isOp: true,
    });
    const parent = makePost({
      id: 2,
      content: "Top-level reply",
      createdAt: new Date("2026-01-01T12:01:00Z"),
    });
    const leaf = makePost({
      id: 3,
      content: "Depth-two leaf",
      parentId: 2,
      parentAuthorName: "Author",
      createdAt: new Date("2026-01-01T12:02:00Z"),
    });

    render(
      <PostList
        posts={[op, parent, leaf]}
        displayMode="nested"
        isSignedIn={false}
        onReply={vi.fn()}
      />,
    );

    expect(screen.getByText("Top-level reply")).toBeInTheDocument();
    expect(screen.getByText("Depth-two leaf")).toBeInTheDocument();
  });

  it("collapses depth-2 branches with children by default", () => {
    const op = makePost({
      id: 1,
      content: "Opening post",
      isOp: true,
    });
    const parent = makePost({
      id: 2,
      content: "Top-level reply",
      authorName: "TopUser",
      authorInitials: "TU",
      createdAt: new Date("2026-01-01T12:01:00Z"),
    });
    const branch = makePost({
      id: 3,
      content: "Nested branch",
      authorName: "BranchUser",
      authorInitials: "BU",
      parentId: 2,
      parentAuthorName: "TopUser",
      createdAt: new Date("2026-01-01T12:02:00Z"),
    });
    const grandchild = makePost({
      id: 4,
      content: "Grandchild reply",
      parentId: 3,
      parentAuthorName: "BranchUser",
      createdAt: new Date("2026-01-01T12:03:00Z"),
    });

    render(
      <PostList
        posts={[op, parent, branch, grandchild]}
        displayMode="nested"
        isSignedIn={false}
        onReply={vi.fn()}
      />,
    );

    expect(screen.getByText("Top-level reply")).toBeInTheDocument();
    expect(screen.getByText("Nested branch")).toBeInTheDocument();
    expect(screen.queryByText("Grandchild reply")).not.toBeInTheDocument();

    const branchArticle = screen.getByText("BranchUser").closest("article");
    expect(branchArticle).not.toBeNull();
    expect(
      within(branchArticle!).getByRole("button", {
        name: copy.thread.post.hiddenReplies(1),
      }),
    ).toBeInTheDocument();
  });

  it("collapses and expands a reply branch", async () => {
    const user = userEvent.setup();
    const op = makePost({
      id: 1,
      content: "Opening post",
      isOp: true,
    });
    const parent = makePost({
      id: 2,
      content: "Parent reply",
      createdAt: new Date("2026-01-01T12:01:00Z"),
    });
    const child = makePost({
      id: 3,
      content: "Nested reply",
      parentId: 2,
      parentAuthorName: "Author",
      createdAt: new Date("2026-01-01T12:02:00Z"),
    });

    render(
      <PostList
        posts={[op, parent, child]}
        displayMode="nested"
        isSignedIn={false}
        onReply={vi.fn()}
      />,
    );

    expect(screen.getByText("Nested reply")).toBeInTheDocument();

    const parentArticle = screen.getByText("Parent reply").closest("article");
    expect(parentArticle).not.toBeNull();

    await user.click(
      within(parentArticle!).getByRole("button", {
        name: copy.thread.post.collapseBranch,
      }),
    );

    expect(screen.queryByText("Nested reply")).not.toBeInTheDocument();
    expect(
      within(parentArticle!).getByRole("button", {
        name: copy.thread.post.hiddenReplies(1),
      }),
    ).toBeInTheDocument();

    await user.click(
      within(parentArticle!).getByRole("button", {
        name: copy.thread.post.expandBranch,
      }),
    );

    expect(screen.getByText("Nested reply")).toBeInTheDocument();
  });

  it("shows best-first top-level replies and expands to chronological", async () => {
    const user = userEvent.setup();
    const op = makePost({
      id: 1,
      content: "Opening post",
      isOp: true,
    });
    const topLevelPosts = Array.from(
      { length: TOP_LEVEL_BEST_FIRST_THRESHOLD + 8 },
      (_, index) =>
        makePost({
          id: index + 2,
          content: `Reply ${index + 1}`,
          score: index + 1,
          createdAt: new Date(
            `2026-01-01T12:${String(index + 1).padStart(2, "0")}:00Z`,
          ),
        }),
    );

    render(
      <PostList
        posts={[op, ...topLevelPosts]}
        displayMode="nested"
        isSignedIn={false}
        onReply={vi.fn()}
      />,
    );

    expect(
      screen.getByText(
        copy.thread.post.showingBestReplies(
          TOP_LEVEL_BEST_FIRST_THRESHOLD,
          topLevelPosts.length,
        ),
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/^Reply \d+$/)).toHaveLength(
      TOP_LEVEL_BEST_FIRST_THRESHOLD,
    );

    await user.click(
      screen.getByRole("button", {
        name: copy.thread.post.showAllReplies(topLevelPosts.length),
      }),
    );

    expect(screen.getAllByText(/^Reply \d+$/)).toHaveLength(
      topLevelPosts.length,
    );
  });
});
