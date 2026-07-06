import type { VoteSubject, VoteTarget } from "./types";

export function canVote(voter: VoteSubject, post: VoteTarget): boolean {
  if (!voter.userId || !voter.fanProfile) {
    return false;
  }

  if (voter.fanProfile.id === post.authorFanProfileId) {
    return false;
  }

  return voter.fanProfile.leagueId === post.thread.leagueId;
}
