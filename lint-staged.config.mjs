/** @type {import("lint-staged").Configuration} */
const config = {
  "*.{js,jsx,ts,tsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css,yml,yaml}": ["prettier --write"],
  "*.{ts,tsx}": () => "tsc --noEmit",
};

export default config;
