export type Sport = "football" | "basketball";

export interface CommunityStats {
  memberCount: number;
  postsToday: number;
}

export interface ActiveMember {
  id: string;
  displayName: string;
  leagueName: string;
  teamName: string;
  teamEmoji: string;
  activityLabel: string;
  isOnline: boolean;
}

export interface LeagueWithActivity {
  slug: string;
  name: string;
  sport: Sport;
  hasLiveThreads: boolean;
}

export function formatMemberCount(count: number): string {
  return count.toLocaleString("el-GR");
}
