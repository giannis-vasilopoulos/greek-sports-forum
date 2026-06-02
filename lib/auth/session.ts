import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type SessionUser = {
  id: string;
  name: string;
  image?: string;
  username?: string;
  role: "user" | "moderator" | "admin";
};

export async function getSessionUser(): Promise<SessionUser | undefined> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return undefined;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    image: session.user.image ?? undefined,
    username: session.user.username ?? undefined,
    role: normalizeRole((session.user as { role?: string | null }).role),
  };
}

function normalizeRole(role: string | null | undefined): SessionUser["role"] {
  if (role === "moderator" || role === "admin") {
    return role;
  }

  return "user";
}
