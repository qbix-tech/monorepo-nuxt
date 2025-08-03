<template>
  <Landing>
    <LandingHeader title="@org/ui">
      <UNavigationMenu :items="items" />

      <template #right>
        <LocaleSelect />
        <ColorModeButton />
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="simple-icons:github"
          aria-label="GitHub"
        />
      </template>

      <template #body>
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
    </LandingHeader>

    <LandingMain class="relative">
      <NuxtPage />
    </LandingMain>

    <USeparator icon="simple-icons:nuxtdotjs" type="dashed" class="h-px" />

    <LandingFooter>
      <template #left>
        <p class="text-muted text-sm">
          Copyright © {{ new Date().getFullYear() }}
        </p>
      </template>

      <UNavigationMenu :items="items" variant="link" />

      <template #right>
        <ColorModeButton />
        <UButton
          icon="simple-icons:github"
          color="neutral"
          variant="ghost"
          to="https://github.com/qbix-tech/monorepo-nuxt"
          target="_blank"
          aria-label="GitHub"
        />
      </template>
    </LandingFooter>
  </Landing>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const nuxtApp = useNuxtApp();
const { activeHeadings, updateHeadings } = useScrollspy();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Usage",
    to: "#usage",
    active:
      activeHeadings.value.includes("usage") &&
      !activeHeadings.value.includes("layouts"),
  },
  {
    label: "Layouts",
    to: "#layouts",
    active: activeHeadings.value.includes("layouts"),
  },
  {
    label: "Components",
    to: "#components",
    active:
      activeHeadings.value.includes("components") &&
      !activeHeadings.value.includes("layouts"),
  },
]);

nuxtApp.hooks.hookOnce("page:finish", () => {
  updateHeadings(
    [
      document.querySelector("#usage"),
      document.querySelector("#layouts"),
      document.querySelector("#components"),
    ].filter(Boolean) as Element[],
  );
});
</script>
