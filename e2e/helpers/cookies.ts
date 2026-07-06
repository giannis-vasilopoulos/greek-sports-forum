import { expect, type Page } from "@playwright/test";

import { copy } from "@/lib/copy";

export async function dismissCookieBannerIfVisible(page: Page) {
  const banner = page.getByRole("dialog", {
    name: copy.ads.cookie.bannerTitle,
  });
  if (await banner.isVisible()) {
    await page.getByRole("button", { name: copy.ads.cookie.accept }).click();
    await expect(banner).not.toBeVisible();
  }
}

export async function preAcceptCookiesInStorage(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "kerkida-cookie-consent",
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        decided: true,
        updatedAt: new Date().toISOString(),
      }),
    );
  });
}
