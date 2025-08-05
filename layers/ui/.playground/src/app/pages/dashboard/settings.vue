<template>
  <DashboardPanel id="settings" body-class="lg:py-12">
    <template #header>
      <DashboardNavbar title="Settings">
        <template #leading>
          <DashboardSidebarCollapse />
        </template>
      </DashboardNavbar>

      <DashboardToolbar>
        <!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </DashboardToolbar>
    </template>

    <template #body>
      <div
        class="mx-auto flex w-full flex-col gap-4 sm:gap-6 lg:max-w-2xl lg:gap-12"
      >
        <NuxtPage />
      </div>
    </template>
  </DashboardPanel>
</template>

<script setup lang="ts">
const links = computed(() => [
  [
    {
      label: "General",
      icon: "lucide:user",
      to: "/dashboard/settings",
      exact: true,
    },
    {
      label: "Members",
      icon: "lucide:users",
      to: "/dashboard/settings/members",
    },
    {
      label: "Notifications",
      icon: "lucide:bell",
      to: "/dashboard/settings/notifications",
    },
    {
      label: "Security",
      icon: "lucide:shield",
      to: "/dashboard/settings/security",
    },
  ],
]);
</script>
