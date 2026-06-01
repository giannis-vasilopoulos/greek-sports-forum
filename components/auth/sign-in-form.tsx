"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { authClient } from "@/lib/auth-client";
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setPending(true);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    if (signInError) {
      setError("Λάθος email ή κωδικός. Δοκίμασε ξανά.");
      setPending(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>
          <h1 className="text-base font-medium">Σύνδεση</h1>
        </CardTitle>
        <CardDescription>
          Συνδέσου στον λογαριασμό σου στην ΚΕΡΚΙΔΑ.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Κωδικός</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Field>
            {error && <FieldError>{error}</FieldError>}
            <FieldSeparator>ή</FieldSeparator>
            <GoogleAuthButton />
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t-0 bg-transparent">
          <Button
            type="submit"
            variant="cta"
            className="w-full"
            disabled={pending}
          >
            {pending ? "Σύνδεση…" : "Σύνδεση"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Δεν έχεις λογαριασμό;{" "}
            <Link
              href="/sign-up"
              className="text-primary underline underline-offset-4"
            >
              Εγγραφή
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
