import { copy } from "@/lib/copy";
import type { SignUpInput } from "@/lib/validation/auth";

export type SignUpFieldErrors = Partial<Record<keyof SignUpInput, string>>;

const { errors: e } = copy.auth;
const { password: p } = copy.validation;

export function mapSignUpApiError(
  code: string | undefined,
  message: string | undefined,
): { formError?: string; fieldErrors?: SignUpFieldErrors } {
  switch (code) {
    case "INVALID_USERNAME":
    case "USERNAME_TOO_SHORT":
    case "USERNAME_TOO_LONG":
      return {
        fieldErrors: {
          username: e.usernameInvalid,
        },
      };
    case "USERNAME_IS_ALREADY_TAKEN":
      return {
        fieldErrors: {
          username: e.usernameTaken,
        },
      };
    case "PASSWORD_TOO_SHORT":
    case "PASSWORD_TOO_LONG":
      return {
        fieldErrors: {
          password: p.policyFailed,
        },
      };
    default:
      break;
  }

  if (message === "User already exists") {
    return {
      fieldErrors: {
        email: e.emailTaken,
      },
    };
  }

  if (
    message?.includes(p.policyKeyword) ||
    message?.toLowerCase().includes("password")
  ) {
    return {
      fieldErrors: {
        password: p.policyFailed,
      },
    };
  }

  return {
    formError: e.signUpFailed,
  };
}
