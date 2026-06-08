import { redirect } from "next/navigation";

import { getPostAuthRedirectPath } from "@/lib/profiles/post-auth";

export default async function PostAuthPage() {
  const path = await getPostAuthRedirectPath();
  redirect(path);
}
