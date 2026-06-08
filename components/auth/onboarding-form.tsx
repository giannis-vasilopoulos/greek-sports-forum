"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FanProfileFormFields } from "@/components/profile/fan-profile-form-fields";
import { copy } from "@/lib/copy";
import type { LeagueOption } from "@/lib/leagues/queries";
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
import { FieldError, FieldGroup } from "@/components/ui/field";

const t = copy.auth.onboarding;

type TeamOption = {
  id: number;
  leagueId: number;
  name: string;
  logoUrl?: string | null;
};

interface OnboardingFormProps {
  leagues: LeagueOption[];
  teams: TeamOption[];
}

export function OnboardingForm({ leagues, teams }: OnboardingFormProps) {
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
    },
  });

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
            <FanProfileFormFields
              leagues={leagues}
              teams={teams}
              control={control}
              errors={errors}
              register={register}
              setValue={setValue}
            />
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
