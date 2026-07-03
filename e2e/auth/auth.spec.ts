import { expect, test, type Page } from "@/e2e/fixtures";
import { dismissCookieBannerIfVisible } from "@/e2e/helpers/cookies";

const TEST_PASSWORD = "TestPass123!";
const TEST_NAME = "Test User";
const NAV_TIMEOUT_MS = 15_000;
const AUTH_API_TIMEOUT_MS = 30_000;

async function fillInput(page: Page, selector: string, value: string) {
  const input = page.locator(selector);
  await expect(input).toBeVisible();
  await input.click();
  await input.fill(value);
  await expect(input).toHaveValue(value);
}

test.describe("authentication", () => {
  test("sign-up, onboarding, sign-out, and sign-in", async ({
    page,
  }, testInfo) => {
    test.setTimeout(90_000);

    const testEmail = `e2e-${Date.now()}-${testInfo.retry}@test.local`;
    const testUsername = `e2euser${Date.now()}${testInfo.retry}`;

    await page.goto("/sign-up");
    await dismissCookieBannerIfVisible(page);

    await expect(page.getByRole("heading", { name: "Εγγραφή" })).toBeVisible();

    await fillInput(page, "#name", TEST_NAME);
    await fillInput(page, "#username", testUsername);
    await fillInput(page, "#email", testEmail);
    await fillInput(page, "#password", TEST_PASSWORD);

    const submitButton = page.getByRole("button", {
      name: "Εγγραφή",
      exact: true,
    });
    await expect(submitButton).toBeEnabled();

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/auth/sign-up/email") &&
          res.request().method() === "POST",
        { timeout: AUTH_API_TIMEOUT_MS },
      ),
      submitButton.click(),
    ]);

    if (!response.ok()) {
      const formError = await page.getByRole("alert").textContent();
      expect(
        response.ok(),
        formError ?? `sign-up returned HTTP ${response.status()}`,
      ).toBeTruthy();
    }

    await expect(page).toHaveURL("/onboarding", { timeout: NAV_TIMEOUT_MS });
    await expect(
      page.getByRole("heading", { name: "Δημιούργησε fan profile" }),
    ).toBeVisible();

    await page.getByLabel("Όνομα εμφάνισης").fill(`E2EFan${Date.now()}`);
    await page.getByLabel("Αγαπημένη ομάδα").click();
    await page.getByRole("option").first().click();
    await page.getByRole("button", { name: "Συνέχεια" }).click();

    await expect(page).toHaveURL("/", { timeout: NAV_TIMEOUT_MS });
    await expect(page.getByLabel("Μενού χρήστη")).toBeVisible();

    await page.getByLabel("Μενού χρήστη").click();
    await page.getByRole("button", { name: "Αποσύνδεση" }).click();

    await expect(page.getByRole("link", { name: "Σύνδεση" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Εγγραφή" })).toBeVisible();

    await page.goto("/sign-in");
    await dismissCookieBannerIfVisible(page);
    await fillInput(page, "#email", testEmail);
    await fillInput(page, "#password", TEST_PASSWORD);

    const signInButton = page.getByRole("button", {
      name: "Σύνδεση",
      exact: true,
    });
    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/auth/sign-in/email") &&
          res.request().method() === "POST",
        { timeout: AUTH_API_TIMEOUT_MS },
      ),
      signInButton.click(),
    ]);

    await expect(page).toHaveURL("/", { timeout: NAV_TIMEOUT_MS });
    await expect(page.getByLabel("Μενού χρήστη")).toBeVisible();
  });

  test("sign-in with seed user", async ({ page }) => {
    test.setTimeout(60_000);

    const email = process.env.SEED_USER_EMAIL;
    const password = process.env.SEED_USER_PASSWORD;

    test.skip(!email || !password, "Seed user credentials not configured");

    await page.goto("/sign-in");
    await dismissCookieBannerIfVisible(page);
    await fillInput(page, "#email", email!);
    await fillInput(page, "#password", password!);

    const signInButton = page.getByRole("button", {
      name: "Σύνδεση",
      exact: true,
    });
    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/auth/sign-in/email") &&
          res.request().method() === "POST",
        { timeout: AUTH_API_TIMEOUT_MS },
      ),
      signInButton.click(),
    ]);

    await expect(page).toHaveURL("/", { timeout: NAV_TIMEOUT_MS });
    await expect(page.getByLabel("Μενού χρήστη")).toBeVisible();
  });
});
