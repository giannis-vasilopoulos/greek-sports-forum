import type { threads } from "@/db/schema/forum";

type ThreadType = (typeof threads.$inferSelect)["type"];

export type ThreadDisplayMode = "flat" | "nested";

export function getThreadDisplayMode(type: ThreadType): ThreadDisplayMode {
  void type;
  return "flat";
}
