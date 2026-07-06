import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  fanProfiles,
  reputationEvents as reputationEventLedger,
} from "@/db/schema";
import {
  type ReputationEventType,
  reputationEventDeltas,
} from "@/lib/forum/constants";

export { reputationEventDeltas as reputationEvents };

export function getReputationDelta(event: ReputationEventType): number {
  return reputationEventDeltas[event];
}

async function applyReputationDelta(
  fanProfileId: number,
  event: ReputationEventType,
  delta: number,
  meta?: { postId?: number },
): Promise<number> {
  return db.transaction(async (tx) => {
    const [profile] = await tx
      .update(fanProfiles)
      .set({ reputation: sql`${fanProfiles.reputation} + ${delta}` })
      .where(eq(fanProfiles.id, fanProfileId))
      .returning({ reputation: fanProfiles.reputation });

    if (!profile) {
      throw new Error(`Fan profile ${fanProfileId} not found`);
    }

    await tx.insert(reputationEventLedger).values({
      fanProfileId,
      eventType: event,
      delta,
      scoreAfter: profile.reputation,
      postId: meta?.postId ?? null,
    });

    return profile.reputation;
  });
}

export async function applyReputationEvent(
  fanProfileId: number,
  event: ReputationEventType,
  meta?: { postId?: number },
): Promise<number> {
  return applyReputationDelta(
    fanProfileId,
    event,
    getReputationDelta(event),
    meta,
  );
}

export async function reverseReputationEvent(
  fanProfileId: number,
  event: ReputationEventType,
  meta?: { postId?: number },
): Promise<number> {
  return applyReputationDelta(
    fanProfileId,
    event,
    -getReputationDelta(event),
    meta,
  );
}
