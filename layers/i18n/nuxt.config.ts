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

  modules: ["@nuxtjs/i18n"],

  i18n: {
    restructureDir: join(currentDir, "./src/i18n"),
    vueI18n: join(currentDir, "./i18n.config.ts"),
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "locale",
      redirectOn: "all",
    },
    defaultLocale: "en",
    langDir: "./locales",
    locales: [
      { name: "English", code: "en", language: "en", file: "en.ts" },
      { name: "Bahasa Malaysia", code: "ms", language: "ms", file: "ms.ts" },
      { name: "中文", code: "zh", language: "zh", file: "zh.ts" },
    ],
    experimental: {
      localeDetector: "localeDetector.ts",
    },
  },
});
