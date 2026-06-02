import type { SignUpInput } from "@/lib/validation/auth";

export type SignUpFieldErrors = Partial<Record<keyof SignUpInput, string>>;

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
          username:
            "Μη έγκυρο όνομα χρήστη. Χρησιμοποίησε 3–30 λατινικούς χαρακτήρες, αριθμούς ή _.",
        },
      };
    case "USERNAME_IS_ALREADY_TAKEN":
      return {
        fieldErrors: {
          username: "Το όνομα χρήστη χρησιμοποιείται ήδη.",
        },
      };
    case "PASSWORD_TOO_SHORT":
    case "PASSWORD_TOO_LONG":
      return {
        fieldErrors: {
          password: "Ο κωδικός δεν πληροί τις απαιτήσεις ασφαλείας.",
        },
      };
    default:
      break;
  }

  if (message === "User already exists") {
    return {
      fieldErrors: {
        email: "Υπάρχει ήδη λογαριασμός με αυτό το email.",
      },
    };
  }

  if (
    message?.includes("απαιτήσεις ασφαλείας") ||
    message?.toLowerCase().includes("password")
  ) {
    return {
      fieldErrors: {
        password: "Ο κωδικός δεν πληροί τις απαιτήσεις ασφαλείας.",
      },
    };
  }

  return {
    formError: "Η εγγραφή απέτυχε. Έλεγξε τα στοιχεία σου και δοκίμασε ξανά.",
  };
}
