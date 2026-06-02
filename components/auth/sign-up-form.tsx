"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { PasswordInput } from "@/components/auth/password-input";
import { copy } from "@/lib/copy";
import { mapSignUpApiError } from "@/lib/auth/map-sign-up-error";
import { authClient } from "@/lib/auth-client";
import { signUpSchema, type SignUpInput } from "@/lib/validation/auth";
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
import { cn } from "@/lib/utils";

const t = copy.auth.signUp;

export function SignUpForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpInput) {
    setFormError(undefined);
    setPending(true);

    const { error: signUpError } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      username: values.username,
      callbackURL: "/onboarding",
    });

    if (signUpError) {
      const mapped = mapSignUpApiError(signUpError.code, signUpError.message);

      if (mapped.fieldErrors) {
        for (const [field, message] of Object.entries(mapped.fieldErrors)) {
          setError(field as keyof SignUpInput, { message });
        }
      }

      if (mapped.formError) {
        setFormError(mapped.formError);
      }

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
          <h1 className="text-base font-medium">{t.title}</h1>
        </CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">{t.nameLabel}</FieldLabel>
              <FieldDescription>{t.nameHint}</FieldDescription>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                aria-invalid={!!errors.name}
                className={cn(errors.name && "border-destructive")}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field data-invalid={!!errors.username}>
              <FieldLabel htmlFor="username">{t.usernameLabel}</FieldLabel>
              <FieldDescription>{t.usernameHint}</FieldDescription>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                aria-invalid={!!errors.username}
                className={cn(errors.username && "border-destructive")}
                {...register("username")}
              />
              <FieldError errors={[errors.username]} />
            </Field>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">{t.emailLabel}</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={cn(errors.email && "border-destructive")}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">{t.passwordLabel}</FieldLabel>
              <FieldDescription>
                {copy.validation.password.requirementsDescription}
              </FieldDescription>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                className={cn(errors.password && "border-destructive")}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>
            {formError && <FieldError>{formError}</FieldError>}
            <FieldSeparator>{copy.common.or}</FieldSeparator>
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
            {pending ? t.submitPending : t.submit}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t.hasAccount}{" "}
            <Link
              href="/sign-in"
              className="text-primary underline underline-offset-4"
            >
              {t.signInLink}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
