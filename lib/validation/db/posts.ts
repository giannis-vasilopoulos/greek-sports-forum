import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { posts } from "@/db/schema/forum";
import { copy } from "@/lib/copy";

const v = copy.validation.reply;

export const postInsertSchema = createInsertSchema(posts, {
  threadId: z.coerce
    .number({ invalid_type_error: v.threadRequired })
    .int(v.threadRequired)
    .positive(v.threadRequired),
  content: (schema) =>
    schema.trim().min(2, v.contentMinLength).max(5000, v.contentMaxLength),
  parentId: z.coerce.number().int().positive().optional().nullable(),
});
