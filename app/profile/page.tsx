import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { EntityLogo } from "@/components/brand/entity-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth/session";
import { copy } from "@/lib/copy";
import { getFanProfileDetailsForUser } from "@/lib/profiles/queries";
import { buildProfileMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildProfileMetadata();

const t = copy.profile.overview;

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  const profiles = await getFanProfileDetailsForUser(user.id);
  const activeProfile = profiles.find((profile) => profile.isActive);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-xl font-semibold">{t.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.accountSection}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">{t.nameLabel}</p>
            <p className="font-medium">{user.name}</p>
          </div>
          {user.username && (
            <div>
              <p className="text-muted-foreground">{t.usernameLabel}</p>
              <p className="font-medium">@{user.username}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">{t.emailLabel}</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.fanProfileSection}</CardTitle>
          <CardDescription>
            {activeProfile ? undefined : t.noFanProfile}
          </CardDescription>
        </CardHeader>
        {activeProfile && (
          <CardContent className="flex items-center gap-3">
            <EntityLogo
              src={activeProfile.teamLogoUrl}
              alt=""
              fallback={activeProfile.teamEmoji}
              size="sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{activeProfile.displayName}</p>
                <Badge variant="secondary">
                  {copy.profile.fanProfiles.activeBadge}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {activeProfile.leagueName} · {activeProfile.teamName}
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href="/fan-profiles">{t.manageFanProfiles}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/notifications">{copy.notifications.nav.label}</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/settings">{t.settings}</Link>
        </Button>
      </div>
    </div>
  );
}
