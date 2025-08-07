<template>
  <PageCard container-class="p-4 sm:p-4" title-class="flex items-center gap-1">
    <div
      class="dark:bg-muted/20 bg-muted relative flex h-40 overflow-hidden rounded-md"
    >
      <PageMarquee
        orientation="vertical"
        class="w-full [--gap:--spacing(4)] before:h-1/5 after:h-1/5"
      >
        <UCard
          v-for="(item, index) in testimonials"
          :key="index"
          :ui="{
            body: 'space-y-2 sm:px-3 sm:py-3',
            root: 'w-full max-w-80 sm:w-60',
          }"
        >
          <div class="flex gap-1.5">
            <UAvatar :src="item.avatar.src" :alt="item.name" />
            <div>
              <span class="block text-xs">{{ item.name }}</span>
              <span class="text-muted block text-xs">@{{ item.username }}</span>
            </div>
          </div>
          <p class="text-xs">
            {{ item.feedback }}
          </p>
        </UCard>
      </PageMarquee>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-lg font-semibold"> Marquee </span>
      <span class="text-muted text-sm">
        A marquee component that can be used to display a scrolling text, images
        or a component.
      </span>
    </div>
  </PageCard>
</template>

<script setup lang="ts">
const testimonials = [
  {
    name: "Clayton Chew",
    username: "claytonchew",
    avatar: { src: "https://github.com/claytonchew.png" },
    feedback:
      "@org/ui has been a game-changer for our team. The components are easy to use and integrate seamlessly with our existing Nuxt 3 project.",
  },
  {
    name: "Ronnie Chew",
    username: "ronnie-chew",
    avatar: { src: "https://github.com/ronnie-chew.png" },
    feedback:
      "The design system provided by @org/ui is fantastic. It has helped us maintain a consistent look and feel across our application.",
  },
  {
    name: "Yeoh Lee Ming",
    username: "leeming988QM",
    avatar: { src: "https://github.com/leeming988QM.png" },
    feedback:
      "@org/ui has made it so much easier to build responsive and accessible components. The documentation is also top-notch!",
  },
  {
    name: "Ong Ming Yen",
    username: "ongmingyen",
    avatar: {
      src: "https://github.com/ongmingyen.png",
    },
    feedback:
      "I love how @org/ui provides a wide range of components that are ready to use. It has saved us a lot of development time.",
  },
  {
    name: "Steven Lim",
    username: "steven-QM",
    avatar: {
      src: "https://github.com/steven-QM.png",
    },
    feedback:
      "The @org/ui library is a great addition to our Nuxt 3 project. The components are well-designed and easy to customize.",
  },
  {
    name: "Ang Chee Keat",
    username: "CheeKeat-QM",
    avatar: {
      src: "https://github.com/CheeKeat-QM.png",
    },
    feedback:
      "Using @org/ui has significantly improved our development workflow. The components are intuitive and easy to work with.",
  },
  {
    name: "Reynold Chong",
    username: "reynoldcky",
    avatar: { src: "https://github.com/reynoldcky.png" },
    feedback:
      "The @org/ui components are not only visually appealing but also highly functional. They have enhanced the user experience of our application.",
  },
  {
    name: "Zulfidly Zulkifli",
    username: "fidlyqm",
    avatar: { src: "https://github.com/fidlyqm.png" },
    feedback:
      "I appreciate the effort put into creating @org/ui. The components are well-optimized and perform excellently in our Nuxt 3 application.",
  },
];
</script>
