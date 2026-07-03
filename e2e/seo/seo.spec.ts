import { expect, test } from "@/e2e/fixtures";

test.describe("SEO infrastructure", () => {
  test("home has canonical and JSON-LD", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/ΚΕΡΚΙΔΑ/);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
  });

  test("robots.txt references sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain("Sitemap:");
    expect(body).toContain("Disallow: /api/");
  });

  test("sitemap.xml lists home", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain("<loc>");
    expect(body).toContain("/</loc>");
  });
});
