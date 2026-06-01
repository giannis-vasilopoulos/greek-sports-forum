import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { notifications } from "@/db/schema";
import { runDbOrThrow } from "@/lib/db/run";

export async function getUnreadNotificationCount(
  userId: string,
): Promise<number> {
  return runDbOrThrow(async () => {
    const rows = await db.query.notifications.findMany({
      where: and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false),
      ),
      columns: { id: true },
    });
    return rows.length;
  });
}
