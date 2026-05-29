import { hashPassword } from "better-auth/crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../index";
import { account, user } from "../schema";

type SeedUser = {
  email: string;
  password: string;
  name: string;
  username: string;
  role: "admin" | "user";
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSeedUsers(): SeedUser[] {
  return [
    {
      email: requireEnv("SEED_ADMIN_EMAIL"),
      password: requireEnv("SEED_ADMIN_PASSWORD"),
      name: "Admin",
      username: "admin",
      role: "admin",
    },
    {
      email: requireEnv("SEED_USER_EMAIL"),
      password: requireEnv("SEED_USER_PASSWORD"),
      name: "Test User",
      username: "testuser",
      role: "user",
    },
  ];
}

async function upsertSeedUser(seedUser: SeedUser) {
  const existing = await db.query.user.findFirst({
    where: eq(user.email, seedUser.email),
  });

  const hashedPassword = await hashPassword(seedUser.password);

  if (existing) {
    await db
      .update(user)
      .set({
        name: seedUser.name,
        username: seedUser.username,
        role: seedUser.role,
        emailVerified: true,
      })
      .where(eq(user.id, existing.id));

    const credentialAccount = await db.query.account.findFirst({
      where: and(
        eq(account.userId, existing.id),
        eq(account.providerId, "credential"),
      ),
    });

    if (credentialAccount) {
      await db
        .update(account)
        .set({ password: hashedPassword })
        .where(eq(account.id, credentialAccount.id));
    } else {
      await db.insert(account).values({
        id: crypto.randomUUID(),
        accountId: existing.id,
        providerId: "credential",
        userId: existing.id,
        password: hashedPassword,
      });
    }

    console.log(`  updated ${seedUser.email} (${seedUser.role})`);
    return;
  }

  const userId = crypto.randomUUID();

  await db.insert(user).values({
    id: userId,
    email: seedUser.email,
    name: seedUser.name,
    username: seedUser.username,
    role: seedUser.role,
    emailVerified: true,
  });

  await db.insert(account).values({
    id: crypto.randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId,
    password: hashedPassword,
  });

  console.log(`  created ${seedUser.email} (${seedUser.role})`);
}

export async function seedUsers() {
  const seedUsersList = getSeedUsers();

  console.log("Seeding users...");

  for (const seedUser of seedUsersList) {
    await upsertSeedUser(seedUser);
  }

  console.log("Seed users ready:");
  for (const seedUser of seedUsersList) {
    console.log(`  ${seedUser.role}: ${seedUser.email}`);
  }
}
