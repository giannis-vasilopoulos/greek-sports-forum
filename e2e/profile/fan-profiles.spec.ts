import { expect, test, type Page } from "@/e2e/fixtures";
import { copy } from "@/lib/copy";
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

async function signUpAndOnboard(
  page: Page,
  testInfo: {
    retry: number;
  },
) {
  const testEmail = `e2e-profile-${Date.now()}-${testInfo.retry}@test.local`;
  const testUsername = `e2eprof${Date.now()}${testInfo.retry}`;

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

  await page.getByLabel("Όνομα εμφάνισης").fill(`E2EFan${Date.now()}`);
  await page.getByLabel("Αγαπημένη ομάδα").click();
  await page.getByRole("option").first().click();
  await page.getByRole("button", { name: "Συνέχεια" }).click();

  await expect(page).toHaveURL("/", { timeout: NAV_TIMEOUT_MS });

  return { testEmail, testPassword: TEST_PASSWORD };
}

test.describe("fan profiles", () => {
  test("manage fan profiles and switch active profile", async ({
    page,
  }, testInfo) => {
    test.setTimeout(120_000);

    await signUpAndOnboard(page, testInfo);

    await page.goto("/fan-profiles");
    await expect(
      page.getByRole("heading", {
        name: copy.profile.fanProfiles.title,
        level: 1,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(copy.profile.fanProfiles.activeBadge, { exact: true }),
    ).toBeVisible();

    const leagueSelect = page.locator("#add-leagueId");
    if (await leagueSelect.isVisible()) {
      await leagueSelect.click();
      const options = page.getByRole("option");
      const optionCount = await options.count();
      if (optionCount > 0) {
        await options.first().click();
        await page.locator("#add-favoriteTeamId").click();
        await page.getByRole("option").first().click();
        await page.locator("#add-displayName").fill(`E2ESecond${Date.now()}`);
        await page
          .getByRole("button", { name: copy.profile.fanProfiles.addSubmit })
          .click();
        await expect(page).toHaveURL("/fan-profiles", {
          timeout: NAV_TIMEOUT_MS,
        });
      }
    }

    const setActiveButtons = page.getByRole("button", {
      name: copy.profile.fanProfiles.setActive,
    });
    if ((await setActiveButtons.count()) > 0) {
      await setActiveButtons.first().click();
      await page.goto("/fan-profiles");
      await expect(
        page.getByText(copy.profile.fanProfiles.activeBadge, { exact: true }),
      ).toHaveCount(1);
    }

    await page.goto("/profile");
    await expect(
      page.getByRole("heading", {
        name: copy.profile.overview.title,
        level: 1,
      }),
    ).toBeVisible();
    await expect(page.getByText(TEST_NAME)).toBeVisible();
  });
});
