import { expect, test } from "@/e2e/fixtures";

test.describe("Standings", () => {
  test("overview has canonical and title", async ({ page }) => {
    await page.goto("/standings");
    await expect(page).toHaveTitle(/Βαθμολογίες.*ΚΕΡΚΙΔΑ/);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /\/standings$/);
  });

  test("super-league standings page loads table or empty state", async ({
    page,
  }) => {
    await page.goto("/leagues/super-league/standings");
    await expect(page).toHaveTitle(/Βαθμολογία.*Super League.*ΚΕΡΚΙΔΑ/);
    await expect(
      page
        .getByRole("table", { name: "Πίνακας βαθμολογίας" })
        .or(page.getByText("Δεν υπάρχουν δεδομένα βαθμολογίας")),
    ).toBeVisible();
  });

  test("nba shows temporarily unavailable", async ({ page }) => {
    await page.goto("/leagues/nba/standings");
    await expect(page.getByText("Προσωρινά μη διαθέσιμο")).toBeVisible();
  });

  test("euroleague shows temporarily unavailable", async ({ page }) => {
    await page.goto("/leagues/euroleague/standings");
    await expect(page.getByText("Προσωρινά μη διαθέσιμο")).toBeVisible();
  });
});
