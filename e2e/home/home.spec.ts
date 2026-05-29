import { expect, test } from "@playwright/test";

test("home page shows db fetch heading", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Fetched user from db/i }),
  ).toBeVisible();
});
