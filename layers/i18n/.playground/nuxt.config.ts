export default defineNuxtConfig({
  extends: [".."],

  srcDir: "src/app",
  serverDir: "src/server",
  dir: {
    public: "src/public",
    modules: "src/modules",
    shared: "src/shared",
  },
});
