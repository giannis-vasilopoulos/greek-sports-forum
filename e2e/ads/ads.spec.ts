import { expect, test } from "@/e2e/fixtures";
import { copy } from "@/lib/copy";

const c = copy.ads.cookie;

test.describe("Ads MVP", () => {
  test.use({
    storageState: { cookies: [], origins: [] },
  });

  test("shows cookie banner before consent", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("dialog", { name: c.bannerTitle }),
    ).toBeVisible();
    await expect(
      page.locator('[data-ad-slot="match-threads-top"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('[data-ad-slot="match-threads-mid"]'),
    ).toHaveCount(1);
    await expect(page.locator('[data-ad-slot-active="false"]')).toHaveCount(2);
    await expect(page.getByLabel(copy.ads.aria.ad)).toHaveCount(0);
    await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(0);
  });

  test("loads house ad slots after marketing consent", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: c.accept }).click();
    await expect(
      page.locator('[data-ad-slot="match-threads-top"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('[data-ad-slot="match-threads-mid"]'),
    ).toHaveCount(1);
    await expect(page.locator('[data-ad-slot-active="true"]')).toHaveCount(2);
    await expect(page.getByLabel(copy.ads.aria.ad).first()).toBeVisible();
  });

  test("reject keeps ad scripts unloaded and slots reserved", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: c.reject }).click();
    await expect(
      page.locator('[data-ad-slot="match-threads-top"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('[data-ad-slot="match-threads-mid"]'),
    ).toHaveCount(1);
    await expect(page.locator('[data-ad-slot-active="false"]')).toHaveCount(2);
    await expect(page.getByLabel(copy.ads.aria.ad)).toHaveCount(0);
    await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(0);
  });

  test("privacy page is reachable and indexable", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page).toHaveTitle(/Πολιτική απορρήτου/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      copy.seo.pages.privacy.heading,
    );

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
  });

  test("shows standings ad slots before consent", async ({ page }) => {
    await page.goto("/leagues/super-league/standings");
    await expect(page.locator('[data-ad-slot="standings-top"]')).toHaveCount(1);

    const bottomSlot = page.locator('[data-ad-slot="standings-bottom"]');
    const table = page.getByRole("table", { name: "Πίνακας βαθμολογίας" });
    const hasTable = (await table.count()) > 0;
    await expect(bottomSlot).toHaveCount(hasTable ? 1 : 0);

    const expectedInactiveSlots = hasTable ? 2 : 1;
    await expect(page.locator('[data-ad-slot-active="false"]')).toHaveCount(
      expectedInactiveSlots,
    );
    await expect(page.getByLabel(copy.ads.aria.ad)).toHaveCount(0);
  });

  test("loads standings house ad slots after marketing consent", async ({
    page,
  }) => {
    await page.goto("/leagues/super-league/standings");
    await page.getByRole("button", { name: c.accept }).click();
    await expect(page.locator('[data-ad-slot="standings-top"]')).toHaveCount(1);

    const bottomSlot = page.locator('[data-ad-slot="standings-bottom"]');
    const table = page.getByRole("table", { name: "Πίνακας βαθμολογίας" });
    const hasTable = (await table.count()) > 0;
    await expect(bottomSlot).toHaveCount(hasTable ? 1 : 0);

    const expectedActiveSlots = hasTable ? 2 : 1;
    await expect(page.locator('[data-ad-slot-active="true"]')).toHaveCount(
      expectedActiveSlots,
    );
    await expect(page.getByLabel(copy.ads.aria.ad).first()).toBeVisible();
  });

  test("nba standings shows top ad only", async ({ page }) => {
    await page.goto("/leagues/nba/standings");
    await expect(page.locator('[data-ad-slot="standings-top"]')).toHaveCount(1);
    await expect(page.locator('[data-ad-slot="standings-bottom"]')).toHaveCount(
      0,
    );
  });
});
