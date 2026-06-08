"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { PasswordInput } from "@/components/auth/password-input";
import { copy } from "@/lib/copy";
import { authClient } from "@/lib/auth-client";
import { signInSchema, type SignInInput } from "@/lib/validation/auth";
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
import { cn } from "@/lib/utils";

const t = copy.auth.signIn;

export function SignInForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInInput) {
    setFormError(undefined);
    setPending(true);

    const { error: signInError } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: "/auth/post-auth",
    });

    if (signInError) {
      setFormError(t.invalidCredentials);
      setPending(false);
      return;
    }

    router.push("/auth/post-auth");
    router.refresh();
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
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">{t.emailLabel}</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                aria-invalid={!!errors.email}
                className={cn(errors.email && "border-destructive")}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">{t.passwordLabel}</FieldLabel>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                className={cn(errors.password && "border-destructive")}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>
            {formError && <FieldError>{formError}</FieldError>}
            <Button
              type="submit"
              variant="cta"
              className="w-full"
              disabled={pending}
            >
              {pending ? t.submitPending : t.submit}
            </Button>
            <FieldSeparator>{copy.common.or}</FieldSeparator>
            <GoogleAuthButton />
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t-0 bg-transparent">
          <p className="text-muted-foreground text-center text-sm">
            {t.noAccount}{" "}
            <Link
              href="/sign-up"
              className="text-primary underline underline-offset-4"
            >
              {t.signUpLink}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
