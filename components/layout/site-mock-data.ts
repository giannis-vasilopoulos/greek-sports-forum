/**
 * Temporary layout/header fixtures. Replace with Better Auth session and
 * notification API data when auth and notifications are wired.
 */

import type {
  FanProfile,
  NotificationItem,
} from "@/components/layout/site-data";

export const mockUser = {
  name: "Νίκος Π.",
  username: "GreenEagle_Pao",
  image: undefined,
};

export const mockActiveFanProfile: FanProfile = {
  leagueName: "Super League",
  teamName: "Παναθηναϊκός",
  teamEmoji: "🍀",
};

export const mockFanProfiles: FanProfile[] = [
  mockActiveFanProfile,
  {
    leagueName: "Premier League",
    teamName: "Arsenal",
    teamEmoji: "🔴",
  },
  {
    leagueName: "Euroleague",
    teamName: "Ολυμπιακός",
    teamEmoji: "🔴",
  },
];

export const mockUnreadNotifications = 3;

export const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    text: "Ο GreenArmy22 απάντησε στο post σου",
    time: "2λ",
    actorInitials: "GA",
  },
  {
    id: 2,
    text: "Το post σου πήρε 12 likes",
    time: "15λ",
    actorInitials: "ΚΕ",
  },
  {
    id: 3,
    text: "ΠΑΟΚ vs ΑΕΚ ξεκινά σε 30 λεπτά",
    time: "28λ",
    actorInitials: "ΜΑ",
  },
];

export const mockHasLiveMatches = true;
