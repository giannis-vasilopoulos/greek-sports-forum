import type { FeedThread } from "@/components/feed/feed-data";

export type ThreadPost = {
  id: number;
  content: string;
  score: number;
  likeCount: number;
  isCollapsed: boolean;
  isFlagged: boolean;
  isEdited: boolean;
  parentId: number | null;
  parentAuthorName: string | null;
  authorName: string;
  authorInitials: string;
  authorFanProfileId: number;
  createdAt: Date;
  relativeTime: string;
  viewerVote: 1 | -1 | null;
  isOp: boolean;
};

export type ThreadDetail = FeedThread & {
  leagueId: number;
  teamId: number | null;
  isLocked: boolean;
  matchStatus:
    | "scheduled"
    | "live"
    | "halftime"
    | "finished"
    | "postponed"
    | "cancelled"
    | null;
  createdAt: Date;
  lastActivityAt: Date;
  viewCount: number;
};

export type ThreadDetailBundle = {
  thread: ThreadDetail;
  opContent: string;
  posts: ThreadPost[];
};
