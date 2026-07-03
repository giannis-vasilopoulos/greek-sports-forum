import { expect, test } from "@/e2e/fixtures";
import { copy } from "@/lib/copy";
import { dismissCookieBannerIfVisible } from "@/e2e/helpers/cookies";

const NAV_TIMEOUT_MS = 15_000;
const SHOWCASE_THREAD_PATH =
  "/leagues/super-league/threads/42-panathinaikos-olympiakos-live";

test.describe("thread detail", () => {
  test("guest can open thread from home and draft redirects to sign-in", async ({
    page,
  }) => {
    await page.goto("/");
    await dismissCookieBannerIfVisible(page);

    const firstThread = page
      .locator('a[href*="/leagues/"][href*="/threads/"]')
      .first();
    await expect(firstThread).toBeVisible({ timeout: NAV_TIMEOUT_MS });
    await firstThread.click();

    await expect(page).toHaveURL(/\/leagues\/[^/]+\/threads\/\d+-/, {
      timeout: NAV_TIMEOUT_MS,
    });

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
      timeout: NAV_TIMEOUT_MS,
    });

    const composer = page.getByLabel(copy.thread.composer.label);
    await composer.fill("Δοκιμαστική απάντηση guest");

    await page
      .getByRole("button", { name: copy.thread.composer.submit, exact: true })
      .click();

    await expect(page).toHaveURL(/\/sign-in\?redirect=/, {
      timeout: NAV_TIMEOUT_MS,
    });
  });

  test("restored reply draft renders without client errors", async ({
    page,
  }) => {
    const draftContent = "Αποθηκευμένο πρόχειρο guest";

    await page.addInitScript(
      ({ threadId, content }) => {
        window.localStorage.setItem(
          `kerkida:reply-draft:${threadId}`,
          JSON.stringify({
            content,
            savedAt: Date.now(),
          }),
        );
      },
      { threadId: 42, content: draftContent },
    );

    await page.goto(SHOWCASE_THREAD_PATH);
    await dismissCookieBannerIfVisible(page);

    await expect(
      page.getByText(copy.thread.composer.draftRestored).first(),
    ).toBeVisible({ timeout: NAV_TIMEOUT_MS });

    await expect(
      page.getByLabel(copy.thread.composer.label).first(),
    ).toHaveValue(draftContent);
  });
});
