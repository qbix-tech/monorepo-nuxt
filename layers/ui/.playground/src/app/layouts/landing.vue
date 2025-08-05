<template>
  <Landing>
    <LandingHeader title="@org/ui">
      <UNavigationMenu :items="items" variant="link" />

      <template #right>
        <UButton
          icon="simple-icons:github"
          color="neutral"
          variant="ghost"
          to="https://github.com/qbix-tech/monorepo-nuxt"
          target="_blank"
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
      <slot />
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
    label: "Development",
    to: "#development",
    active:
      activeHeadings.value.includes("development") &&
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
      document.querySelector("#development"),
      document.querySelector("#layouts"),
      document.querySelector("#components"),
    ].filter(Boolean) as Element[],
  );
});
</script>
