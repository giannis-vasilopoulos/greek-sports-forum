"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import type { HubTeamOption } from "@/lib/transfers/page-data";
import {
  createTransferRumor,
  type CreateTransferRumorState,
} from "@/lib/forum/actions/create-transfer-rumor";
import { copy } from "@/lib/copy";
import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const t = copy.transferRumors.form;

interface SubmitRumorFormProps {
  leagueSlug: string;
  teams: HubTeamOption[];
  fixedTeamId?: number;
  isSignedIn: boolean;
  hasFanProfileForLeague: boolean;
}

export function SubmitRumorForm({
  leagueSlug,
  teams,
  fixedTeamId,
  isSignedIn,
  hasFanProfileForLeague,
}: SubmitRumorFormProps) {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<CreateTransferRumorState>({});

  if (!isSignedIn) {
    return (
      <p className="border-border bg-muted/30 mb-6 rounded-lg border px-4 py-3 text-sm">
        {t.signInPrompt}{" "}
        <Link
          href="/sign-in"
          className="text-primary font-medium hover:underline"
        >
          {t.signInLink}
        </Link>
      </p>
    );
  }

  if (!hasFanProfileForLeague) {
    return (
      <p className="border-border bg-muted/30 mb-6 rounded-lg border px-4 py-3 text-sm">
        {t.fanProfilePrompt}{" "}
        <Link
          href="/onboarding"
          className="text-primary font-medium hover:underline"
        >
          {t.fanProfileLink}
        </Link>
      </p>
    );
  }

  const showTeamSelect = fixedTeamId === undefined;

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createTransferRumor({
        leagueSlug,
        teamId: Number(showTeamSelect ? formData.get("teamId") : fixedTeamId),
        title: String(formData.get("title") ?? ""),
        body: String(formData.get("body") ?? ""),
      });
      setState(result);
    });
  }

  return (
    <section
      className="border-border bg-card mb-6 rounded-lg border p-4"
      aria-label={t.sectionAriaLabel}
    >
      <h2 className="mb-3 text-sm font-semibold">{t.heading}</h2>
      <form action={onSubmit}>
        <FieldGroup>
          {showTeamSelect ? (
            <div className="grid gap-2">
              <Label htmlFor="teamId">{t.teamLabel}</Label>
              <select
                id="teamId"
                name="teamId"
                required
                defaultValue=""
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <option value="" disabled>
                  {t.teamPlaceholder}
                </option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {state.fieldErrors?.teamId ? (
                <FieldError>{state.fieldErrors.teamId}</FieldError>
              ) : null}
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="title">{t.titleLabel}</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder={t.titlePlaceholder}
            />
            {state.fieldErrors?.title ? (
              <FieldError>{state.fieldErrors.title}</FieldError>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="body">{t.bodyLabel}</Label>
            <textarea
              id="body"
              name="body"
              required
              rows={4}
              placeholder={t.bodyPlaceholder}
              className={cn(
                "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              )}
            />
            {state.fieldErrors?.body ? (
              <FieldError>{state.fieldErrors.body}</FieldError>
            ) : null}
          </div>

          {state.error ? <FieldError>{state.error}</FieldError> : null}

          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? t.submitting : t.submit}
          </Button>
        </FieldGroup>
      </form>
    </section>
  );
}
