import type { Page } from "@playwright/test";

const IGNORED_CONSOLE_ERROR_PATTERNS = [/Download the React DevTools/];

export type BrowserErrorCollector = {
  errors: string[];
};

function isIgnoredConsoleError(text: string): boolean {
  return IGNORED_CONSOLE_ERROR_PATTERNS.some((pattern) => pattern.test(text));
}

export function attachBrowserErrorCollector(page: Page): BrowserErrorCollector {
  const collector: BrowserErrorCollector = { errors: [] };

  page.on("pageerror", (error) => {
    collector.errors.push(
      `[pageerror] ${error.message}${error.stack ? `\n${error.stack}` : ""}`,
    );
  });

  page.on("console", (message) => {
    if (message.type() !== "error") return;

    const text = message.text();
    if (isIgnoredConsoleError(text)) return;

    collector.errors.push(`[console.error] ${text}`);
  });

  return collector;
}

export function formatBrowserErrors(errors: string[]): string {
  if (errors.length === 0) return "";

  return `Browser errors detected:\n\n${errors.join("\n\n")}`;
}
