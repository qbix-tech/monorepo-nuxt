<template>
  <PageCard container-class="p-4 sm:p-4" title-class="flex items-center gap-1">
    <div
      class="bg-muted dark:bg-muted/20 flex h-40 flex-col items-center justify-center gap-8 rounded-md"
    >
      <DatePicker v-model="date" variant="outline" />
      <DateRangePicker v-model="range" variant="outline" />
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-lg font-semibold"> Date Picker </span>
      <span class="text-muted text-sm">
        Date picker components that can be used to select dates and ranges.
      </span>
    </div>
  </PageCard>
</template>

<script setup lang="ts">
import { sub } from "date-fns";

const date = ref<Date | undefined>(new Date());
const range = shallowRef({
  start: sub(new Date(), { days: 14 }),
  end: new Date(),
});
</script>
