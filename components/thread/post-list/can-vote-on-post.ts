import type { ThreadPost } from "@/lib/forum/queries/thread-detail";

export function canVoteOnPost(
  viewerFanProfileId: number | undefined,
  post: ThreadPost,
): boolean {
  return (
    viewerFanProfileId !== undefined &&
    viewerFanProfileId !== post.authorFanProfileId
  );
}
