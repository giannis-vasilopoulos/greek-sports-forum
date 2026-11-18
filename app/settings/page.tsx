import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

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
import { buildSettingsMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildSettingsMetadata();

const t = copy.profile.settings;

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-xl font-semibold">{t.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.title}</CardTitle>
          <CardDescription>{t.comingSoon}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href="/profile">{t.backToProfile}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
