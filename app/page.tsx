import { eq } from "drizzle-orm";

import { db } from "@/db";
import { leagues, teams, user } from "@/db/schema";
import { runDbOrThrow } from "@/lib/db/run";

export const dynamic = "force-dynamic";

export default async function Home() {
  const firstUser = await runDbOrThrow(() =>
    db
      .select({ name: teams.name, slug: teams.slug })
      .from(teams)
      .where(eq(teams.leagueId, 1)),
  );
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 mb-6">
          Fetched user from db:
        </h1>
        <pre className="rounded bg-zinc-100 dark:bg-zinc-900 p-4 text-left text-zinc-800 dark:text-zinc-100 w-full break-words">
          {firstUser.length === 0
            ? "No user found in the database."
            : JSON.stringify(firstUser, null, 2)}
        </pre>
      </main>
    </div>
  );
}
