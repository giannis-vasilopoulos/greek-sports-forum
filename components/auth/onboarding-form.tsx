"use client";

import { useActionState, useMemo, useState } from "react";

import {
  createFanProfile,
  type FanProfileActionState,
} from "@/lib/profiles/actions";
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

const initialState: FanProfileActionState = {};

export function OnboardingForm({
  leagues,
  teams,
  defaultDisplayName = "",
}: OnboardingFormProps) {
  const [state, formAction, pending] = useActionState(
    createFanProfile,
    initialState,
  );
  const [leagueId, setLeagueId] = useState<string>(
    leagues[0] ? String(leagues[0].id) : "",
  );
  const [favoriteTeamId, setFavoriteTeamId] = useState<string>("");

  const teamsForLeague = useMemo(
    () => teams.filter((team) => String(team.leagueId) === leagueId),
    [teams, leagueId],
  );

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>
          <h1 className="text-base font-medium">Δημιούργησε fan profile</h1>
        </CardTitle>
        <CardDescription>
          Διάλεξε πρωτάθλημα και ομάδα για να συμμετέχεις στις συζητήσεις.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="leagueId">Πρωτάθλημα</FieldLabel>
              <Select
                value={leagueId}
                onValueChange={(value) => {
                  setLeagueId(value);
                  setFavoriteTeamId("");
                }}
                required
              >
                <SelectTrigger id="leagueId">
                  <SelectValue placeholder="Επίλεξε πρωτάθλημα" />
                </SelectTrigger>
                <SelectContent>
                  {leagues.map((league) => (
                    <SelectItem key={league.id} value={String(league.id)}>
                      {league.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="leagueId" value={leagueId} />
            </Field>
            <Field>
              <FieldLabel htmlFor="favoriteTeamId">Αγαπημένη ομάδα</FieldLabel>
              <Select
                name="favoriteTeamId"
                value={favoriteTeamId}
                onValueChange={setFavoriteTeamId}
              >
                <SelectTrigger id="favoriteTeamId">
                  <SelectValue placeholder="Προαιρετικό" />
                </SelectTrigger>
                <SelectContent>
                  {teamsForLeague.map((team) => (
                    <SelectItem key={team.id} value={String(team.id)}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {favoriteTeamId && (
                <input
                  type="hidden"
                  name="favoriteTeamId"
                  value={favoriteTeamId}
                />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="displayName">Όνομα εμφάνισης</FieldLabel>
              <FieldDescription>
                Το όνομα που θα εμφανίζεται στις δημοσιεύσεις σου σε αυτό το
                πρωτάθλημα.
              </FieldDescription>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                required
                minLength={2}
                defaultValue={defaultDisplayName}
              />
            </Field>
            {state.error && <FieldError>{state.error}</FieldError>}
          </FieldGroup>
        </CardContent>
        <CardFooter className="border-t-0 bg-transparent">
          <Button
            type="submit"
            variant="cta"
            className="w-full"
            disabled={pending}
          >
            {pending ? "Αποθήκευση…" : "Συνέχεια"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
