/** @type {import("lint-staged").Configuration} */
const config = {
  "*.{js,jsx,ts,tsx,mjs,cjs}": ["eslint --fix"],
  "*.{js,jsx,ts,tsx,mjs,cjs,json,md,html,css,yml,yaml}": () => "pnpm format",
  "*.{ts,tsx}": () => "tsc --noEmit",
};

export default config;
