import { getReputationDelta } from "@/lib/forum/reputation";

export function getVoteReputationDelta(
  previous: 1 | -1 | null,
  next: 1 | -1 | null,
): number {
  if (previous === next) return 0;

  let delta = 0;

  if (previous === 1) {
    delta -= getReputationDelta("post_liked");
  } else if (previous === -1) {
    delta -= getReputationDelta("post_downvoted");
  }

  if (next === 1) {
    delta += getReputationDelta("post_liked");
  } else if (next === -1) {
    delta += getReputationDelta("post_downvoted");
  }

  return delta;
}
