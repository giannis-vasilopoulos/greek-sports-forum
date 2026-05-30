import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { leagues, threads } from "@/db/schema";
import { leaguePath, threadPath } from "@/lib/seo/paths";
import { absoluteUrl } from "@/lib/seo/site";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/leagues", changeFrequency: "daily", priority: 0.9 },
  { path: "/match-threads", changeFrequency: "hourly", priority: 0.9 },
  { path: "/standings", changeFrequency: "daily", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.3 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.3 },
];

function staticEntries(): MetadataRoute.Sitemap {
  const now = new Date();

  return STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  }));
}

async function dynamicEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const activeLeagues = await db
      .select({ slug: leagues.slug })
      .from(leagues)
      .where(eq(leagues.isActive, true));

    const leagueEntries: MetadataRoute.Sitemap = activeLeagues.map(
      (league) => ({
        url: absoluteUrl(leaguePath(league.slug)),
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.85,
      }),
    );

    const threadRows = await db
      .select({
        id: threads.id,
        slug: threads.slug,
        lastActivityAt: threads.lastActivityAt,
        leagueSlug: leagues.slug,
      })
      .from(threads)
      .innerJoin(leagues, eq(threads.leagueId, leagues.id))
      .where(eq(leagues.isActive, true));

    const threadEntries: MetadataRoute.Sitemap = threadRows.map((thread) => ({
      url: absoluteUrl(threadPath(thread.leagueSlug, thread.id, thread.slug)),
      lastModified: thread.lastActivityAt,
      changeFrequency: "daily",
      priority: 0.6,
    }));

    return [...leagueEntries, ...threadEntries];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.DATABASE_URL) {
    return staticEntries();
  }

  return [...staticEntries(), ...(await dynamicEntries())];
}

export const revalidate = 3600;
