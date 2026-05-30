import { expect, test } from "@playwright/test";

test.describe("Ads MVP", () => {
  test.use({
    storageState: { cookies: [], origins: [] },
  });

  test("shows cookie banner before consent", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("dialog", { name: /Χρησιμοποιούμε cookies/i }),
    ).toBeVisible();
    await expect(page.locator('[data-ad-slot="home-leaderboard"]')).toHaveCount(
      1,
    );
    await expect(page.locator('[data-ad-slot="home-mid"]')).toHaveCount(1);
    await expect(page.locator('[data-ad-slot-active="false"]')).toHaveCount(2);
    await expect(page.getByLabel("Διαφήμιση")).toHaveCount(0);
    await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(0);
  });

  test("loads house ad slots after marketing consent", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Αποδοχή" }).click();
    await expect(page.locator('[data-ad-slot="home-leaderboard"]')).toHaveCount(
      1,
    );
    await expect(page.locator('[data-ad-slot="home-mid"]')).toHaveCount(1);
    await expect(page.locator('[data-ad-slot-active="true"]')).toHaveCount(2);
    await expect(page.getByLabel("Διαφήμιση").first()).toBeVisible();
  });

  test("reject keeps ad scripts unloaded and slots reserved", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Απόρριψη" }).click();
    await expect(page.locator('[data-ad-slot="home-leaderboard"]')).toHaveCount(
      1,
    );
    await expect(page.locator('[data-ad-slot="home-mid"]')).toHaveCount(1);
    await expect(page.locator('[data-ad-slot-active="false"]')).toHaveCount(2);
    await expect(page.getByLabel("Διαφήμιση")).toHaveCount(0);
    await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(0);
  });

  test("privacy page is reachable and indexable", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page).toHaveTitle(/Πολιτική απορρήτου/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Πολιτική απορρήτου",
    );

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
  });
});
