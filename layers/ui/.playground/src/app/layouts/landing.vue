<template>
  <Landing>
    <LandingHeader title="@org/ui">
      <UNavigationMenu :items="items" variant="link" />

      <template #right>
        <ThemeMenu />
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

    <LandingFooter top-class="border-b border-default">
      <template #top>
        <UContainer>
          <LandingFooterColumns :columns="footerColumns">
            <template #right>
              <UFormField
                name="email"
                label="Subscribe to our newsletter"
                size="lg"
              >
                <UInput type="email" class="w-full">
                  <template #trailing>
                    <UButton
                      type="submit"
                      size="xs"
                      color="neutral"
                      label="Subscribe"
                    />
                  </template>
                </UInput>
              </UFormField>
            </template>
          </LandingFooterColumns>
        </UContainer>
      </template>

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

const footerColumns = [
  {
    label: "Resources",
    children: [
      {
        label: "Help center",
      },
      {
        label: "Docs",
      },
      {
        label: "Roadmap",
      },
      {
        label: "Changelog",
      },
    ],
  },
  {
    label: "Features",
    children: [
      {
        label: "Affiliates",
      },
      {
        label: "Portal",
      },
      {
        label: "Jobs",
      },
      {
        label: "Sponsors",
      },
    ],
  },
  {
    label: "Company",
    children: [
      {
        label: "About",
      },
      {
        label: "Pricing",
      },
      {
        label: "Careers",
      },
      {
        label: "Blog",
      },
    ],
  },
];

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
