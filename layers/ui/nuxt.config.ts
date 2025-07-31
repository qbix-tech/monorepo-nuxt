import { fileURLToPath } from "url";
import { dirname, join } from "path";

const currentDir = dirname(fileURLToPath(import.meta.url));

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: { name: "ui" },

  srcDir: "src/app",
  serverDir: "src/server",
  dir: {
    public: "src/public",
    modules: "src/modules",
    shared: "src/shared",
  },

  modules: ["@nuxt/ui"],
  css: [join(currentDir, "./src/app/assets/css/main.css")],
});
