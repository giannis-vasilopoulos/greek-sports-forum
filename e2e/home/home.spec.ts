import { expect, test } from "@playwright/test";

import { copy } from "@/lib/copy";

const f = copy.feed;

test("home page shows feed layout and thread rows", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: copy.layout.brand }).first(),
  ).toBeVisible();

  await expect(
    page.getByRole("tablist", { name: f.leagueFilter.ariaLabel }),
  ).toBeVisible();

  await expect(
    page.getByRole("tab", { name: f.leagueFilter.all }),
  ).toBeVisible();
  await expect(
    page.getByRole("tab", { name: f.leagueFilter.live }),
  ).toBeVisible();

  await expect(
    page
      .getByRole("link", {
        name: /Παναθηναϊκός vs Ολυμπιακός — Live συζήτηση/,
      })
      .first(),
  ).toBeVisible();

  await expect(page.getByLabel(f.matchBar.ariaLabel)).toBeVisible();
});

test("home league filter narrows thread results", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: /Premier League/ }).click();
  await expect(
    page.getByRole("tab", { name: /Premier League/ }),
  ).toHaveAttribute("aria-selected", "true");

  await expect(
    page.getByRole("link", { name: /Arsenal vs Chelsea/ }).first(),
  ).toBeVisible();

  const threadFeed = page.getByRole("region", {
    name: f.matchThreads.listAriaLabel,
  });
  await expect(
    threadFeed.getByRole("link", {
      name: /Παναθηναϊκός vs Ολυμπιακός — Live συζήτηση/,
    }),
  ).toHaveCount(0);
});
