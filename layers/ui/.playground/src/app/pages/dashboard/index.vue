<template>
  <DashboardPanel id="home">
    <template #header>
      <DashboardNavbar title="Home" right-class="gap-3">
        <template #leading>
          <DashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </DashboardNavbar>

      <DashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <DateRangePicker v-model="range" class="-ms-1" />

          <USelect
            v-model="period"
            :items="['daily', 'weekly', 'monthly']"
            variant="ghost"
            class="data-[state=open]:bg-elevated"
            :ui="{
              value: 'capitalize',
              itemLabel: 'capitalize',
              trailingIcon:
                'group-data-[state=open]:rotate-180 transition-transform duration-200',
              content: 'w-fit',
            }"
          />
        </template>
      </DashboardToolbar>
    </template>

    <template #body>
      <DashboardHomeStats :period="period" :range="range" />
      <DashboardHomeChart :period="period" :range="range" />
      <DashboardHomeSales :period="period" :range="range" />
    </template>
  </DashboardPanel>
</template>

<script setup lang="ts">
import { sub } from "date-fns";
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Period } from "#shared/types";

const { isNotificationsSlideoverOpen } = useDashboard();

const items = [
  [
    {
      label: "New mail",
      icon: "i-lucide-send",
      to: "/inbox",
    },
    {
      label: "New customer",
      icon: "i-lucide-user-plus",
      to: "/customers",
    },
  ],
] satisfies DropdownMenuItem[][];

const range = shallowRef({
  start: sub(new Date(), { days: 14 }),
  end: new Date(),
});
const period = ref<Period>("daily");
</script>
