import { expect, test } from "@/e2e/fixtures";

test.describe("Transfer rumors", () => {
  test("overview has canonical and title", async ({ page }) => {
    await page.goto("/transfer-rumors");
    await expect(page).toHaveTitle(/Φήμες Μεταγραφών.*ΚΕΡΚΙΔΑ/);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /\/transfer-rumors$/);
  });

  test("overview shows team picker and submit form gate", async ({ page }) => {
    await page.goto("/transfer-rumors");
    await expect(
      page.getByRole("navigation", { name: "Επιλογή ομάδας" }),
    ).toBeVisible();
    await expect(
      page.getByText(/Πρέπει να συνδεθείτε για να υποβάλετε φήμη/),
    ).toBeVisible();
  });

  test("league transfer-rumors hub loads team picker", async ({ page }) => {
    await page.goto("/leagues/super-league/transfer-rumors");
    await expect(page).toHaveTitle(/Φήμες Μεταγραφών.*Super League.*ΚΕΡΚΙΔΑ/);
    await expect(
      page.getByRole("navigation", { name: "Επιλογή ομάδας" }),
    ).toBeVisible();
  });

  test("team transfer-rumors page loads feed or empty state", async ({
    page,
  }) => {
    await page.goto(
      "/leagues/super-league/teams/panathinaikos/transfer-rumors",
    );
    await expect(page).toHaveTitle(/Φήμες Μεταγραφών.*ΚΕΡΚΙΔΑ/);
    await expect(
      page
        .getByText("Δεν υπάρχουν φήμες μεταγραφών ακόμα")
        .or(page.getByRole("link", { name: /Φήμη μεταγραφής/ })),
    ).toBeVisible();
  });

  test("links to official transfers", async ({ page }) => {
    await page.goto("/transfer-rumors");
    await expect(
      page.getByRole("link", { name: "Δείτε τις επίσημες μεταγραφές" }),
    ).toHaveAttribute("href", "/transfers");
  });
});
