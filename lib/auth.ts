import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { username } from "better-auth/plugins";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { isValidPassword, isValidUsername } from "@/lib/validation/fields";

const PASSWORD_POLICY_PATHS = ["/sign-up/email"] as const;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "user" },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 30,
      usernameValidator: (value) => isValidUsername(value),
      usernameNormalization: false,
    }),
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        !PASSWORD_POLICY_PATHS.includes(
          ctx.path as (typeof PASSWORD_POLICY_PATHS)[number],
        )
      ) {
        return;
      }

      const password = ctx.body?.password;
      if (typeof password !== "string" || !isValidPassword(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Ο κωδικός δεν πληροί τις απαιτήσεις ασφαλείας.",
        });
      }
    }),
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
