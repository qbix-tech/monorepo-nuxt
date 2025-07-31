import { defineBase, defineMocks } from "./src";

const apply = defineBase({
  commons: {
    logoUrl: undefined,
    heroImageUrl: undefined,
  },
});

export default defineMocks({
  // 👇 add template specific props data here, the key is the template name.
  Example: apply.withBase({
    name: "Jane Doe",
  }),
});
