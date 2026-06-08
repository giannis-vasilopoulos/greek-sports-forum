"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { EntityLogo } from "@/components/brand/entity-logo";
import {
  FanProfileFormFields,
  type FanProfileTeamOption,
} from "@/components/profile/fan-profile-form-fields";
import { SetActiveFanProfileButton } from "@/components/profile/set-active-fan-profile-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { copy } from "@/lib/copy";
import type { LeagueOption } from "@/lib/leagues/queries";
import { createFanProfile } from "@/lib/profiles/actions";
import type { FanProfileDetail } from "@/lib/profiles/types";
import {
  createFanProfileSchema,
  type CreateFanProfileFormValues,
  type CreateFanProfileInput,
} from "@/lib/validation/profiles";
import { cn } from "@/lib/utils";

const t = copy.profile.fanProfiles;

interface FanProfilesManagerProps {
  profiles: FanProfileDetail[];
  availableLeagues: LeagueOption[];
  teams: FanProfileTeamOption[];
}

export function FanProfilesManager({
  profiles,
  availableLeagues,
  teams,
}: FanProfilesManagerProps) {
  const [formError, setFormError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);

  const defaultLeagueId = availableLeagues[0]?.id;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreateFanProfileFormValues, unknown, CreateFanProfileInput>({
    resolver: zodResolver(createFanProfileSchema),
    defaultValues: {
      leagueId: defaultLeagueId ?? 0,
      favoriteTeamId: 0,
    },
  });

  async function onSubmit(values: CreateFanProfileInput) {
    setFormError(undefined);
    setPending(true);

    const result = await createFanProfile(values, {
      redirectTo: "/fan-profiles",
    });

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as keyof CreateFanProfileFormValues, { message });
      }
      setPending(false);
      return;
    }

    if (result.error) {
      setFormError(result.error);
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.emptyTitle}</CardTitle>
            <CardDescription>{t.emptyDescription}</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {profiles.map((profile) => (
            <li key={profile.id}>
              <Card
                className={cn(
                  profile.isActive && "border-primary/40 bg-primary/5",
                )}
              >
                <CardContent className="flex items-center justify-between gap-4 pt-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <EntityLogo
                      src={profile.teamLogoUrl}
                      alt=""
                      fallback={profile.teamEmoji}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{profile.displayName}</p>
                        {profile.isActive && (
                          <Badge variant="secondary">{t.activeBadge}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {profile.leagueName} · {profile.teamName}
                      </p>
                    </div>
                  </div>
                  {!profile.isActive && (
                    <SetActiveFanProfileButton profileId={profile.id} />
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {availableLeagues.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.addSectionTitle}</CardTitle>
            <CardDescription>{t.addSectionDescription}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardContent>
              <FieldGroup>
                <FanProfileFormFields
                  leagues={availableLeagues}
                  teams={teams}
                  control={control}
                  errors={errors}
                  register={register}
                  setValue={setValue}
                  idPrefix="add-"
                />
                {formError && <FieldError>{formError}</FieldError>}
              </FieldGroup>
            </CardContent>
            <CardFooter className="border-t-0 bg-transparent">
              <Button
                type="submit"
                variant="cta"
                className="w-full sm:w-auto"
                disabled={pending}
              >
                {pending ? t.addSubmitPending : t.addSubmit}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        profiles.length > 0 && (
          <p className="text-sm text-muted-foreground">{t.allLeaguesUsed}</p>
        )
      )}
    </div>
  );
}
