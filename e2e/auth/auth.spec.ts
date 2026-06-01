import { expect, test } from "@playwright/test";

const TEST_EMAIL = `e2e-${Date.now()}@test.local`;
const TEST_PASSWORD = "testpassword123";
const TEST_NAME = "E2E User";
const TEST_USERNAME = `e2euser${Date.now()}`;

test.describe("authentication", () => {
  test("sign-up, onboarding, sign-out, and sign-in", async ({ page }) => {
    await page.goto("/sign-up");

    await expect(page.getByRole("heading", { name: "Εγγραφή" })).toBeVisible();

    await page.getByLabel("Όνομα", { exact: true }).fill(TEST_NAME);
    await page.getByLabel("Όνομα χρήστη").fill(TEST_USERNAME);
    await page.getByLabel("Email").fill(TEST_EMAIL);
    await page.getByLabel("Κωδικός", { exact: true }).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Εγγραφή", exact: true }).click();

    await expect(page).toHaveURL("/onboarding");
    await expect(
      page.getByRole("heading", { name: "Δημιούργησε fan profile" }),
    ).toBeVisible();

    await page.getByLabel("Όνομα εμφάνισης").fill(`E2EFan${Date.now()}`);
    await page.getByRole("button", { name: "Συνέχεια" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByLabel("Μενού χρήστη")).toBeVisible();

    await page.getByLabel("Μενού χρήστη").click();
    await page.getByRole("button", { name: "Αποσύνδεση" }).click();

    await expect(page.getByRole("link", { name: "Σύνδεση" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Εγγραφή" })).toBeVisible();

    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(TEST_EMAIL);
    await page.getByLabel("Κωδικός").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Σύνδεση", exact: true }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByLabel("Μενού χρήστη")).toBeVisible();
  });

  test("sign-in with seed user", async ({ page }) => {
    const email = process.env.SEED_USER_EMAIL;
    const password = process.env.SEED_USER_PASSWORD;

    test.skip(!email || !password, "Seed user credentials not configured");

    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Κωδικός").fill(password!);
    await page.getByRole("button", { name: "Σύνδεση", exact: true }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByLabel("Μενού χρήστη")).toBeVisible();
  });
});
