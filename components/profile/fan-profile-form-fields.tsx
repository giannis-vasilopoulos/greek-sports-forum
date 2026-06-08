"use client";

import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { useMemo } from "react";

import { EntityLogo } from "@/components/brand/entity-logo";
import { copy } from "@/lib/copy";
import type { LeagueOption } from "@/lib/leagues/queries";
import {
  Field,
  FieldDescription,
  FieldError,
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
import type {
  CreateFanProfileFormValues,
  CreateFanProfileInput,
} from "@/lib/validation/profiles";
import { cn } from "@/lib/utils";

const t = copy.auth.onboarding;

export type FanProfileTeamOption = {
  id: number;
  leagueId: number;
  name: string;
  logoUrl?: string | null;
};

interface FanProfileFormFieldsProps {
  leagues: LeagueOption[];
  teams: FanProfileTeamOption[];
  control: Control<CreateFanProfileFormValues, unknown, CreateFanProfileInput>;
  errors: FieldErrors<CreateFanProfileFormValues>;
  register: UseFormRegister<CreateFanProfileFormValues>;
  setValue: UseFormSetValue<CreateFanProfileFormValues>;
  idPrefix?: string;
}

export function FanProfileFormFields({
  leagues,
  teams,
  control,
  errors,
  register,
  setValue,
  idPrefix = "",
}: FanProfileFormFieldsProps) {
  const leagueId = useWatch({ control, name: "leagueId" });

  const teamsForLeague = useMemo(
    () => teams.filter((team) => team.leagueId === Number(leagueId)),
    [teams, leagueId],
  );

  const leagueFieldId = `${idPrefix}leagueId`;
  const teamFieldId = `${idPrefix}favoriteTeamId`;
  const displayNameFieldId = `${idPrefix}displayName`;

  return (
    <>
      <Field data-invalid={!!errors.leagueId}>
        <FieldLabel htmlFor={leagueFieldId}>{t.leagueLabel}</FieldLabel>
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
                id={leagueFieldId}
                aria-invalid={!!errors.leagueId}
                className={cn(errors.leagueId && "border-destructive")}
              >
                <SelectValue placeholder={t.leaguePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {leagues.map((league) => (
                  <SelectItem key={league.id} value={String(league.id)}>
                    <span className="flex items-center gap-2">
                      <EntityLogo
                        src={league.logoUrl}
                        alt={`Λογότυπο ${league.name}`}
                        fallback={league.emoji}
                        size="xs"
                      />
                      {league.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError errors={[errors.leagueId]} />
      </Field>
      <Field data-invalid={!!errors.favoriteTeamId}>
        <FieldLabel htmlFor={teamFieldId}>{t.favoriteTeamLabel}</FieldLabel>
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
                id={teamFieldId}
                aria-invalid={!!errors.favoriteTeamId}
                className={cn(errors.favoriteTeamId && "border-destructive")}
              >
                <SelectValue placeholder={t.favoriteTeamPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {teamsForLeague.map((team) => (
                  <SelectItem key={team.id} value={String(team.id)}>
                    <span className="flex items-center gap-2">
                      <EntityLogo
                        src={team.logoUrl}
                        alt={`Λογότυπο ${team.name}`}
                        fallback={team.name.slice(0, 1)}
                        size="xs"
                      />
                      {team.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError errors={[errors.favoriteTeamId]} />
      </Field>
      <Field data-invalid={!!errors.displayName}>
        <FieldLabel htmlFor={displayNameFieldId}>
          {t.displayNameLabel}
        </FieldLabel>
        <FieldDescription>{t.displayNameHint}</FieldDescription>
        <Input
          id={displayNameFieldId}
          type="text"
          aria-invalid={!!errors.displayName}
          className={cn(errors.displayName && "border-destructive")}
          {...register("displayName")}
        />
        <FieldError errors={[errors.displayName]} />
      </Field>
    </>
  );
}
