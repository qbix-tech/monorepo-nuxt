<template>
  <Dashboard unit="rem">
    <DashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      footer-class="lg:border-t lg:border-default"
    >
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <DashboardSearchButton
          :collapsed="collapsed"
          class="ring-default bg-transparent"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </DashboardSidebar>

    <DashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideover />
  </Dashboard>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

const open = ref(false);

const links = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: "Home",
      icon: "lucide:house",
      to: "/dashboard",
      exact: true,
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Inbox",
      icon: "lucide:inbox",
      to: "/dashboard/inbox",
      badge: "4",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Customers",
      icon: "lucide:users",
      to: "/dashboard/customers",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Settings",
      to: "/dashboard/settings",
      icon: "lucide:settings",
      defaultOpen: true,
      type: "trigger",
      children: [
        {
          label: "General",
          to: "/dashboard/settings",
          exact: true,
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: "Members",
          to: "/dashboard/settings/members",
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: "Notifications",
          to: "/dashboard/settings/notifications",
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: "Security",
          to: "/dashboard/settings/security",
          onSelect: () => {
            open.value = false;
          },
        },
      ],
    },
  ],
  [
    {
      label: "Switch to Landing",
      icon: "lucide:arrow-right-left",
      to: "/",
    },
  ],
]);

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: links.value.flat(),
  },
  {
    id: "code",
    label: "Code",
    items: [
      {
        id: "source",
        label: "View page source",
        icon: "simple-icons:github",
        to: `https://github.com/qbix-tech/monorepo-nuxt/tree/main/layers/ui/.playground/src/app/pages${route.path === "/" ? "/index" : route.path}.vue`,
        target: "_blank",
      },
    ],
  },
]);
</script>
