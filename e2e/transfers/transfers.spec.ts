import { expect, test } from "@playwright/test";

test.describe("Transfers", () => {
  test("overview has canonical and title", async ({ page }) => {
    await page.goto("/transfers");
    await expect(page).toHaveTitle(/Μεταγραφές.*ΚΕΡΚΙΔΑ/);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /\/transfers$/);
  });

  test("overview shows team picker for default league", async ({ page }) => {
    await page.goto("/transfers");
    await expect(
      page.getByRole("navigation", { name: "Επιλογή ομάδας" }),
    ).toBeVisible();
  });

  test("nba hub shows temporarily unavailable", async ({ page }) => {
    await page.goto("/transfers?league=nba");
    await expect(page.getByText("Προσωρινά μη διαθέσιμο")).toBeVisible();
  });

  test("league transfers route returns 404", async ({ page }) => {
    const response = await page.goto("/leagues/super-league/transfers");
    expect(response?.status()).toBe(404);
  });

  test("links to transfer rumors", async ({ page }) => {
    await page.goto("/transfers");
    await expect(
      page.getByRole("link", { name: "Δείτε τις φήμες της κοινότητας" }),
    ).toHaveAttribute("href", "/transfer-rumors");
  });

  test("team transfers page loads for super-league panathinaikos", async ({
    page,
  }) => {
    await page.goto("/leagues/super-league/teams/panathinaikos/transfers");
    await expect(page).toHaveTitle(/Μεταγραφές.*ΚΕΡΚΙΔΑ/);
    await expect(
      page
        .getByRole("table", { name: "Πίνακας μεταγραφών" })
        .or(page.getByText("Δεν υπάρχουν μεταγραφές ακόμα")),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Όλες οι ομάδες — Super League/ }),
    ).toHaveAttribute("href", "/transfers?league=super-league");
  });

  test("team transfers page has arrival and departure tabs", async ({
    page,
  }) => {
    await page.goto("/leagues/super-league/teams/panathinaikos/transfers");
    await expect(page.getByRole("button", { name: "Άφιξη" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Αποχώρηση" })).toBeVisible();
  });
});
