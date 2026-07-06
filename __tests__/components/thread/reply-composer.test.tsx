import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ReplyComposer } from "@/components/thread/reply-composer";
import { copy } from "@/lib/copy";

vi.mock("@/hooks/thread/use-reply-draft", () => ({
  useReplyDraft: () => null,
}));

const defaultProps = {
  threadId: 42,
  leagueSlug: "super-league",
  isSignedIn: false,
  hasFanProfileForLeague: false,
  canReply: true,
};

afterEach(() => {
  cleanup();
});

describe("ReplyComposer", () => {
  it("renders collapsed bar when sticky and not expanded", () => {
    render(
      <ReplyComposer
        {...defaultProps}
        sticky
        expanded={false}
        onExpandedChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: copy.thread.composer.expandComposer }),
    ).toHaveTextContent(copy.thread.composer.placeholder);
    expect(
      screen.queryByLabelText(copy.thread.composer.label),
    ).not.toBeInTheDocument();
  });

  it("shows sign-in link in collapsed bar for guests", () => {
    render(
      <ReplyComposer
        {...defaultProps}
        sticky
        expanded={false}
        onExpandedChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("link", { name: copy.thread.composer.signInLink }),
    ).toBeInTheDocument();
  });

  it("calls onExpandedChange when collapsed bar is tapped", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();

    render(
      <ReplyComposer
        {...defaultProps}
        sticky
        expanded={false}
        onExpandedChange={onExpandedChange}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: copy.thread.composer.expandComposer }),
    );

    expect(onExpandedChange).toHaveBeenCalledWith(true);
  });

  it("auto-expands when replyTarget is provided", () => {
    const onExpandedChange = vi.fn();

    render(
      <ReplyComposer
        {...defaultProps}
        sticky
        expanded={false}
        onExpandedChange={onExpandedChange}
        replyTarget={{ parentId: 1, replyToAuthor: "Taktikos_Analyst" }}
      />,
    );

    expect(onExpandedChange).toHaveBeenCalledWith(true);
  });

  it("shows reply-to text in collapsed bar when replyTarget is set", () => {
    render(
      <ReplyComposer
        {...defaultProps}
        sticky
        expanded={false}
        onExpandedChange={vi.fn()}
        replyTarget={{ parentId: 1, replyToAuthor: "Taktikos_Analyst" }}
      />,
    );

    expect(
      screen.getByRole("button", { name: copy.thread.composer.expandComposer }),
    ).toHaveTextContent(copy.thread.composer.replyTo("Taktikos_Analyst"));
  });

  it("renders full form when sticky and expanded", () => {
    render(
      <ReplyComposer
        {...defaultProps}
        sticky
        expanded
        onExpandedChange={vi.fn()}
      />,
    );

    expect(
      screen.getByLabelText(copy.thread.composer.label),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: copy.thread.composer.collapseComposer,
      }),
    ).toBeInTheDocument();
  });
});
