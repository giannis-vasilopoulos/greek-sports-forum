import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { NotificationsList } from "@/components/notifications/notifications-list";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/session";
import { copy } from "@/lib/copy";
import { getFormattedNotificationsForUser } from "@/lib/notifications/queries";
import { buildNotificationsMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildNotificationsMetadata();

const t = copy.notifications.page;

export default async function NotificationsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  const items = await getFormattedNotificationsForUser(user.id);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-xl font-semibold">{t.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t.description}</p>
      </div>

      <NotificationsList items={items} />

      <Button variant="outline" asChild className="w-fit">
        <Link href="/profile">{t.backToProfile}</Link>
      </Button>
    </div>
  );
}
