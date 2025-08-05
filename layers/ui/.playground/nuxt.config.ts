export default defineNuxtConfig({
  extends: [".."],

  srcDir: "src/app",
  serverDir: "src/server",
  dir: {
    public: "src/public",
    modules: "src/modules",
    shared: "src/shared",
  },

  css: ["./src/app/assets/css/main.css"],

  i18n: {
    strategy: "no_prefix",
  },
});
