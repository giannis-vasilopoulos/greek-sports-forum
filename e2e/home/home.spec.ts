import { expect, test } from "@playwright/test";

test("home page shows feed layout and thread rows", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: "ΚΕΡΚΙΔΑ" }).first(),
  ).toBeVisible();

  await expect(
    page.getByRole("tablist", { name: "Φίλτρο πρωταθλήματος" }),
  ).toBeVisible();

  await expect(page.getByRole("tab", { name: "Όλα" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "LIVE" })).toBeVisible();

  await expect(
    page.getByRole("link", {
      name: /Παναθηναϊκός vs Ολυμπιακός — Live συζήτηση/,
    }),
  ).toBeVisible();

  await expect(page.getByLabel("Ζωντανά και επερχόμενα ματς")).toBeVisible();
});

test("home league filter narrows thread results", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: /Premier League/ }).click();

  await expect(
    page.getByRole("link", { name: /Arsenal vs Chelsea/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: /Παναθηναϊκός vs Ολυμπιακός — Live συζήτηση/,
    }),
  ).not.toBeVisible();
});
