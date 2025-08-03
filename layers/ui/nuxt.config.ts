import { dirname, join } from "path";
import { fileURLToPath } from "url";

const currentDir = dirname(fileURLToPath(import.meta.url));

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: { name: "ui" },

  extends: [["@org/i18n", { install: true }]],

  srcDir: "src/app",
  serverDir: "src/server",
  dir: {
    public: "src/public",
    modules: "src/modules",
    shared: "src/shared",
  },

  modules: ["@nuxt/ui", "@vueuse/nuxt"],
  css: [join(currentDir, "./src/app/assets/css/main.css")],

  i18n: {
    restructureDir: join(currentDir, "./src/i18n"),
    locales: [
      { name: "English", code: "en", language: "en", file: "en.ts" },
      { name: "Bahasa Malaysia", code: "ms", language: "ms", file: "ms.ts" },
      { name: "中文", code: "zh", language: "zh", file: "zh.ts" },
    ],
  },
});
