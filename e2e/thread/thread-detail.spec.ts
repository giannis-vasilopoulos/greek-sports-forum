import { expect, test, type Page } from "@/e2e/fixtures";
import { copy } from "@/lib/copy";
import {
  dismissCookieBannerIfVisible,
  preAcceptCookiesInStorage,
} from "@/e2e/helpers/cookies";

const NAV_TIMEOUT_MS = 15_000;
const SHOWCASE_THREAD_PATH =
  "/leagues/super-league/threads/42-panathinaikos-olympiakos-live";

function mobileComposerExpandButton(page: Page) {
  return page.getByRole("button", {
    name: copy.thread.composer.expandComposer,
  });
}

function visibleComposerTextbox(page: Page) {
  return page.getByRole("textbox", {
    name: copy.thread.composer.label,
  });
}

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

  test("desktop reply click scrolls composer into view with reply strip", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(SHOWCASE_THREAD_PATH);
    await dismissCookieBannerIfVisible(page);

    await page
      .getByRole("button", { name: copy.thread.post.reply })
      .first()
      .click();

    const composer = page.getByLabel(copy.thread.composer.label).first();
    await expect(composer).toBeVisible({ timeout: NAV_TIMEOUT_MS });
    await expect(composer).toBeInViewport({ timeout: NAV_TIMEOUT_MS });
    await expect(page.getByText(/^Απάντηση σε /).first()).toBeVisible();
  });

  test("mobile composer starts collapsed and expands on tap", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await preAcceptCookiesInStorage(page);
    await page.goto(SHOWCASE_THREAD_PATH);

    await expect(mobileComposerExpandButton(page)).toBeVisible({
      timeout: NAV_TIMEOUT_MS,
    });
    await expect(visibleComposerTextbox(page)).toBeHidden();

    await mobileComposerExpandButton(page).click();

    await expect(visibleComposerTextbox(page)).toBeVisible({
      timeout: NAV_TIMEOUT_MS,
    });
  });

  test("mobile reply click expands composer with reply strip", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await preAcceptCookiesInStorage(page);
    await page.goto(SHOWCASE_THREAD_PATH);

    await page
      .getByRole("button", { name: copy.thread.post.reply })
      .first()
      .click();

    await expect(visibleComposerTextbox(page)).toBeVisible({
      timeout: NAV_TIMEOUT_MS,
    });
    await expect(
      page
        .locator("div.fixed")
        .filter({
          has: page.getByRole("button", {
            name: copy.thread.composer.collapseComposer,
          }),
        })
        .getByText(/^Απάντηση σε /),
    ).toBeVisible();
  });

  test("mobile cookies pill stacks above reply composer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await preAcceptCookiesInStorage(page);
    await page.goto(SHOWCASE_THREAD_PATH);

    const cookiesButton = page.getByRole("button", {
      name: copy.ads.cookie.settingsAria,
    });
    const composerBar = page
      .locator('[class*="lg:hidden"][class*="fixed"]')
      .last();

    await expect(mobileComposerExpandButton(page)).toBeVisible({
      timeout: NAV_TIMEOUT_MS,
    });
    await expect(cookiesButton).toBeVisible({ timeout: NAV_TIMEOUT_MS });

    const cookiesBox = await cookiesButton.boundingBox();
    const composerBox = await composerBar.boundingBox();

    expect(cookiesBox).not.toBeNull();
    expect(composerBox).not.toBeNull();
    expect(cookiesBox!.y + cookiesBox!.height).toBeLessThanOrEqual(
      composerBox!.y + 1,
    );

    const collapsedChromeHeight = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue(
        "--bottom-chrome-height",
      ),
    );
    expect(parseFloat(collapsedChromeHeight)).toBeGreaterThan(0);

    await mobileComposerExpandButton(page).click();
    await expect(visibleComposerTextbox(page)).toBeVisible({
      timeout: NAV_TIMEOUT_MS,
    });

    const cookiesBoxExpanded = await cookiesButton.boundingBox();
    const composerBoxExpanded = await composerBar.boundingBox();

    expect(cookiesBoxExpanded).not.toBeNull();
    expect(composerBoxExpanded).not.toBeNull();
    expect(
      cookiesBoxExpanded!.y + cookiesBoxExpanded!.height,
    ).toBeLessThanOrEqual(composerBoxExpanded!.y + 1);
    expect(cookiesBoxExpanded!.y).toBeLessThan(cookiesBox!.y);
  });
});
