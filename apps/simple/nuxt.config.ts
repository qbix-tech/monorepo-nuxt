import { fileURLToPath } from "url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    "#workspace": fileURLToPath(new URL("../../", import.meta.url)),
  },

  compatibilityDate: "2025-07-15",
  extends: [
    ["@org/i18n", { install: true }],
    ["@org/ui", { install: true }],
  ],

  devtools: { enabled: true },
  devServer: { port: 8000 },

  workspaceDir: "../../",
  srcDir: "src/app",
  serverDir: "src/server",
  dir: {
    public: "src/public",
    modules: "src/modules",
    shared: "src/shared",
  },
});
