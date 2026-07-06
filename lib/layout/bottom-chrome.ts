export const BOTTOM_CHROME_HEIGHT_VAR = "--bottom-chrome-height";

export function setBottomChromeHeight(px: number) {
  document.documentElement.style.setProperty(
    BOTTOM_CHROME_HEIGHT_VAR,
    `${px}px`,
  );
}

export function clearBottomChromeHeight() {
  document.documentElement.style.removeProperty(BOTTOM_CHROME_HEIGHT_VAR);
}
