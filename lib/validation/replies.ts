import { z } from "zod";

import { postInsertSchema } from "@/lib/validation/db/posts";

export const createReplySchema = postInsertSchema.pick({
  threadId: true,
  content: true,
  parentId: true,
});

export type CreateReplyInput = z.output<typeof createReplySchema>;

export const votePostSchema = z.object({
  postId: z.coerce.number().int().positive(),
  value: z.union([z.literal(1), z.literal(-1)]),
});

export type VotePostInput = z.output<typeof votePostSchema>;
