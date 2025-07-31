const path = require("node:path");

const eslint = (filenames) =>
  `eslint --fix ${filenames.map((f) => `"${path.relative(process.cwd(), f)}"`).join(" ")}`;

const prettier = (filenames) =>
  `prettier --write ${filenames.map((f) => `"${path.relative(process.cwd(), f)}"`).join(" ")}`;

const vitest = (filenames) =>
  `vitest related --run ${filenames.map((f) => `"${path.relative(process.cwd(), f)}"`).join(" ")}`;

/** @type {import('lint-staged').Config} */
module.exports = {
  "**/*.{js,jsx,cjs,mjs,json,ts,tsx,html,css,json,vue}": [eslint, prettier],
  "*.{js,ts}": [vitest],
};
