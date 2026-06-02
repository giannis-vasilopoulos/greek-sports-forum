"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { copy } from "@/lib/copy";
import { createFanProfile } from "@/lib/profiles/actions";
import {
  createFanProfileSchema,
  type CreateFanProfileFormValues,
  type CreateFanProfileInput,
} from "@/lib/validation/profiles";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const t = copy.auth.onboarding;

type LeagueOption = {
  id: number;
  slug: string;
  name: string;
};

type TeamOption = {
  id: number;
  leagueId: number;
  name: string;
};

interface OnboardingFormProps {
  leagues: LeagueOption[];
  teams: TeamOption[];
  defaultDisplayName?: string;
}

export function OnboardingForm({
  leagues,
  teams,
  defaultDisplayName = "",
}: OnboardingFormProps) {
  const [formError, setFormError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);

  const defaultLeagueId = leagues[0]?.id;

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
      displayName: defaultDisplayName,
    },
  });

  const leagueId = useWatch({ control, name: "leagueId" });

  const teamsForLeague = useMemo(
    () => teams.filter((team) => team.leagueId === Number(leagueId)),
    [teams, leagueId],
  );

  async function onSubmit(values: CreateFanProfileInput) {
    setFormError(undefined);
    setPending(true);

    const result = await createFanProfile(values);

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
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>
          <h1 className="text-base font-medium">{t.title}</h1>
        </CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.leagueId}>
              <FieldLabel htmlFor="leagueId">{t.leagueLabel}</FieldLabel>
              <Controller
                control={control}
                name="leagueId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                      setValue("favoriteTeamId", 0);
                    }}
                  >
                    <SelectTrigger
                      id="leagueId"
                      aria-invalid={!!errors.leagueId}
                      className={cn(errors.leagueId && "border-destructive")}
                    >
                      <SelectValue placeholder={t.leaguePlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {leagues.map((league) => (
                        <SelectItem key={league.id} value={String(league.id)}>
                          {league.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.leagueId]} />
            </Field>
            <Field data-invalid={!!errors.favoriteTeamId}>
              <FieldLabel htmlFor="favoriteTeamId">
                {t.favoriteTeamLabel}
              </FieldLabel>
              <Controller
                control={control}
                name="favoriteTeamId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                    }}
                  >
                    <SelectTrigger
                      id="favoriteTeamId"
                      aria-invalid={!!errors.favoriteTeamId}
                      className={cn(
                        errors.favoriteTeamId && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder={t.favoriteTeamPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {teamsForLeague.map((team) => (
                        <SelectItem key={team.id} value={String(team.id)}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.favoriteTeamId]} />
            </Field>
            <Field data-invalid={!!errors.displayName}>
              <FieldLabel htmlFor="displayName">
                {t.displayNameLabel}
              </FieldLabel>
              <FieldDescription>{t.displayNameHint}</FieldDescription>
              <Input
                id="displayName"
                type="text"
                aria-invalid={!!errors.displayName}
                className={cn(errors.displayName && "border-destructive")}
                {...register("displayName")}
              />
              <FieldError errors={[errors.displayName]} />
            </Field>
            {formError && <FieldError>{formError}</FieldError>}
          </FieldGroup>
        </CardContent>
        <CardFooter className="border-t-0 bg-transparent">
          <Button
            type="submit"
            variant="cta"
            className="w-full"
            disabled={pending}
          >
            {pending ? t.submitPending : t.submit}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
