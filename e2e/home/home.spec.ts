import { expect, test } from "@playwright/test";

test("home page shows header and landing sections", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "ΚΕΡΚΙΔΑ" }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Η κερκίδα σου για κάθε league",
      level: 1,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Εξερεύνησε τα leagues", level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Ενεργά μέλη", level: 2 }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Ξεκίνα δωρεάν" })).toBeVisible();
});
