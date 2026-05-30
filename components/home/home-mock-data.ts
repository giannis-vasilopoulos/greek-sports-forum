/**
 * Temporary home page fixtures. Replace with DB/API-backed data when the home
 * route is wired to real community stats, leagues, and member activity.
 */

import type {
  ActiveMember,
  CommunityStats,
  LeagueWithActivity,
} from "@/components/home/home-data";

export const mockCommunityStats: CommunityStats = {
  memberCount: 2847,
  postsToday: 156,
};

export const mockActiveMembers: ActiveMember[] = [
  {
    id: "1",
    displayName: "GreenEagle_Pao",
    leagueName: "Super League",
    teamName: "Παναθηναϊκός",
    teamEmoji: "🍀",
    activityLabel: "12 posts σήμερα",
    isOnline: true,
  },
  {
    id: "2",
    displayName: "BlackWhite_Fan",
    leagueName: "Super League",
    teamName: "ΠΑΟΚ",
    teamEmoji: "⚫",
    activityLabel: "Σε live match thread",
    isOnline: true,
  },
  {
    id: "3",
    displayName: "RedDevil_GR",
    leagueName: "Premier League",
    teamName: "Man United",
    teamEmoji: "🔴",
    activityLabel: "5 posts σήμερα",
    isOnline: false,
  },
  {
    id: "4",
    displayName: "EuroRed",
    leagueName: "Euroleague",
    teamName: "Ολυμπιακός",
    teamEmoji: "🔴",
    activityLabel: "Ενεργός πριν 10 λεπτά",
    isOnline: false,
  },
];

export const mockLeaguesWithActivity: LeagueWithActivity[] = [
  {
    slug: "super-league",
    name: "Super League",
    sport: "football",
    hasLiveThreads: true,
  },
  {
    slug: "super-league-2",
    name: "Super League 2",
    sport: "football",
    hasLiveThreads: false,
  },
  {
    slug: "champions-league",
    name: "Champions League",
    sport: "football",
    hasLiveThreads: true,
  },
  {
    slug: "premier-league",
    name: "Premier League",
    sport: "football",
    hasLiveThreads: false,
  },
  {
    slug: "euroleague",
    name: "Euroleague",
    sport: "basketball",
    hasLiveThreads: false,
  },
  { slug: "nba", name: "NBA", sport: "basketball", hasLiveThreads: false },
];
