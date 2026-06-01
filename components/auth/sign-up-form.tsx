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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setPending(true);

    const { error: signUpError } = await authClient.signUp.email({
      name,
      email,
      password,
      username,
      callbackURL: "/onboarding",
    });

    if (signUpError) {
      setError(
        signUpError.message === "User already exists"
          ? "Υπάρχει ήδη λογαριασμός με αυτό το email."
          : "Η εγγραφή απέτυχε. Έλεγξε τα στοιχεία σου και δοκίμασε ξανά.",
      );
      setPending(false);
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>
          <h1 className="text-base font-medium">Εγγραφή</h1>
        </CardTitle>
        <CardDescription>
          Δημιούργησε δωρεάν λογαριασμό στην ΚΕΡΚΙΔΑ.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Όνομα</FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="username">Όνομα χρήστη</FieldLabel>
              <FieldDescription>
                Εμφανίζεται δίπλα στις δημοσιεύσεις σου.
              </FieldDescription>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                minLength={3}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Field>
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
              <FieldDescription>Τουλάχιστον 8 χαρακτήρες.</FieldDescription>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
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
            {pending ? "Εγγραφή…" : "Εγγραφή"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Έχεις ήδη λογαριασμό;{" "}
            <Link
              href="/sign-in"
              className="text-primary underline underline-offset-4"
            >
              Σύνδεση
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
