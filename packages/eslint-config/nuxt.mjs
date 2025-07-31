import { createConfigForNuxt } from "@nuxt/eslint-config/flat";
import defaultConfig from "./default.mjs";

export default createConfigForNuxt({
  features: { tooling: false },
}).append(defaultConfig);
