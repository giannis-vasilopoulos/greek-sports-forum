import type { notifications } from "@/db/schema";

export type NotificationRow = typeof notifications.$inferSelect;

export type NotificationPayload = {
  threadId?: number;
  postId?: number;
  actorProfileId?: number;
  leagueId?: number;
};

export type NotificationDisplayContext = {
  actors: Map<number, { displayName: string }>;
  threads: Map<number, { slug: string; leagueSlug: string }>;
};

export type FormattedNotification = {
  id: number;
  text: string;
  time: string;
  actorInitials?: string;
  href?: string;
  isRead: boolean;
};
