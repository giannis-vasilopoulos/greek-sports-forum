import { expect, test, type Page } from "@playwright/test";

import { copy } from "@/lib/copy";

const TEST_PASSWORD = "TestPass123!";
const TEST_NAME = "Test User";
const NAV_TIMEOUT_MS = 15_000;
const AUTH_API_TIMEOUT_MS = 30_000;

async function dismissCookieBannerIfVisible(page: Page) {
  const banner = page.getByRole("dialog", {
    name: copy.ads.cookie.bannerTitle,
  });
  if (await banner.isVisible()) {
    await page.getByRole("button", { name: copy.ads.cookie.accept }).click();
    await expect(banner).not.toBeVisible();
  }
}

async function fillInput(page: Page, selector: string, value: string) {
  const input = page.locator(selector);
  await expect(input).toBeVisible();
  await input.click();
  await input.fill(value);
  await expect(input).toHaveValue(value);
}

async function signUpAndOnboard(page: Page, testInfo: { retry: number }) {
  const testEmail = `e2e-notif-${Date.now()}-${testInfo.retry}@test.local`;
  const testUsername = `e2enotif${Date.now()}${testInfo.retry}`;

  await page.goto("/sign-up");
  await dismissCookieBannerIfVisible(page);

  await fillInput(page, "#name", TEST_NAME);
  await fillInput(page, "#username", testUsername);
  await fillInput(page, "#email", testEmail);
  await fillInput(page, "#password", TEST_PASSWORD);

  const submitButton = page.getByRole("button", {
    name: "Εγγραφή",
    exact: true,
  });

  await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes("/api/auth/sign-up/email") &&
        res.request().method() === "POST",
      { timeout: AUTH_API_TIMEOUT_MS },
    ),
    submitButton.click(),
  ]);

  await expect(page).toHaveURL("/onboarding", { timeout: NAV_TIMEOUT_MS });

  await page.getByLabel("Όνομα εμφάνισης").fill(`E2ENotif${Date.now()}`);
  await page.getByLabel("Αγαπημένη ομάδα").click();
  await page.getByRole("option").first().click();
  await page.getByRole("button", { name: "Συνέχεια" }).click();

  await expect(page).toHaveURL("/", { timeout: NAV_TIMEOUT_MS });
}

test.describe("notifications", () => {
  test("shows empty state for signed-in user", async ({ page }, testInfo) => {
    test.setTimeout(90_000);

    await signUpAndOnboard(page, testInfo);

    await page.goto("/notifications");
    await expect(
      page.getByRole("heading", {
        name: copy.notifications.page.title,
        level: 1,
      }),
    ).toBeVisible();
    await expect(page.getByText(copy.notifications.page.empty)).toBeVisible();
    await expect(
      page.getByRole("link", { name: copy.notifications.page.backToProfile }),
    ).toBeVisible();
  });

  test("redirects unauthenticated users to sign-in", async ({ page }) => {
    await page.goto("/notifications");
    await expect(page).toHaveURL("/sign-in", { timeout: NAV_TIMEOUT_MS });
  });
});
