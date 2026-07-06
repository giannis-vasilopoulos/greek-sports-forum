import { afterEach, describe, expect, it } from "vitest";

import {
  BOTTOM_CHROME_HEIGHT_VAR,
  clearBottomChromeHeight,
  setBottomChromeHeight,
} from "@/lib/layout/bottom-chrome";

describe("bottom-chrome", () => {
  afterEach(() => {
    clearBottomChromeHeight();
  });

  it("sets the bottom chrome height CSS variable", () => {
    setBottomChromeHeight(52);

    expect(
      document.documentElement.style.getPropertyValue(BOTTOM_CHROME_HEIGHT_VAR),
    ).toBe("52px");
  });

  it("clears the bottom chrome height CSS variable", () => {
    setBottomChromeHeight(52);
    clearBottomChromeHeight();

    expect(
      document.documentElement.style.getPropertyValue(BOTTOM_CHROME_HEIGHT_VAR),
    ).toBe("");
  });
});
