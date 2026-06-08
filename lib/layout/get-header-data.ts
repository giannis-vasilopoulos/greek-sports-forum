import { getSessionUser } from "@/lib/auth/session";
import type { FeedLeague } from "@/components/feed/feed-data";
import type { FanProfile, HeaderProps } from "@/components/layout/site-data";
import { mockHasLiveMatches } from "@/components/layout/site-mock-data";
import { getLeaguesForNav } from "@/lib/leagues/queries";
import { getHeaderNotifications } from "@/lib/notifications/queries";
import {
  getActiveFanProfileForUser,
  getFanProfilesForUser,
} from "@/lib/profiles/queries";

export type HeaderData = HeaderProps & {
  leagues: FeedLeague[];
};

export async function getHeaderData(): Promise<HeaderData> {
  const user = await getSessionUser();
  const leagues = await getLeaguesForNav();

  if (!user) {
    return {
      leagues,
      hasLiveMatches: mockHasLiveMatches,
    };
  }

  const [fanProfiles, activeFanProfile, headerNotifications] =
    await Promise.all([
      getFanProfilesForUser(user.id),
      getActiveFanProfileForUser(user.id),
      getHeaderNotifications(user.id),
    ]);

  return {
    user: {
      name: user.name,
      image: user.image,
      username: user.username,
    },
    fanProfiles,
    activeFanProfile,
    unreadNotifications: headerNotifications.unreadCount,
    notificationItems: headerNotifications.previewItems,
    leagues,
    hasLiveMatches: mockHasLiveMatches,
  };
}

export async function getSessionFanContext(): Promise<{
  user?: HeaderProps["user"];
  activeFanProfile?: FanProfile;
}> {
  const user = await getSessionUser();
  if (!user) return {};

  const activeFanProfile = await getActiveFanProfileForUser(user.id);

  return {
    user: {
      name: user.name,
      image: user.image,
      username: user.username,
    },
    activeFanProfile,
  };
}
