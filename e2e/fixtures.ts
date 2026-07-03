import { test as base, expect } from "@playwright/test";

import {
  attachBrowserErrorCollector,
  formatBrowserErrors,
} from "@/e2e/helpers/browser-errors";

type BrowserErrorFixtures = {
  browserErrorGuard: void;
};

export const test = base.extend<BrowserErrorFixtures>({
  browserErrorGuard: [
    async ({ page }, use) => {
      const collector = attachBrowserErrorCollector(page);
      await use();
      expect(collector.errors, formatBrowserErrors(collector.errors)).toEqual(
        [],
      );
    },
    { auto: true },
  ],
});

export { expect };
export type { Page } from "@playwright/test";
