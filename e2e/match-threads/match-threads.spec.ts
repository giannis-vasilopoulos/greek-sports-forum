import { expect, test } from "@playwright/test";

test("match threads page is reachable with SEO metadata", async ({ page }) => {
  await page.goto("/match-threads");

  await expect(page).toHaveTitle(/Match Threads/);
  await expect(
    page.getByRole("link", { name: "ΚΕΡΚΙΔΑ" }).first(),
  ).toBeVisible();

  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute("href", /\/match-threads$/);
});
