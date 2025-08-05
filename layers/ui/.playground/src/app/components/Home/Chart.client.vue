<template>
  <UCard
    ref="cardRef"
    :ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }"
  >
    <template #header>
      <div>
        <p class="text-muted mb-1.5 text-xs uppercase">Nett Profit</p>
        <p class="text-highlighted text-3xl font-semibold">
          {{ formatNumber(total) }}
        </p>
      </div>
    </template>

    <ChartArea
      :data="data"
      class="h-[280px]"
      :padding="{ top: 40 }"
      :width="width"
      :categories="{
        cost: { name: 'Cost', color: 'var(--ui-error)' },
        revenue: { name: 'Revenue', color: 'var(--ui-primary)' },
      }"
      :x-accessor="(_: DataRecord, i: number) => i"
      :x-formatter="
        (i: number) =>
          i === 0 || i === data.length - 1 || !data[i]
            ? ''
            : formatDate(data[i].date)
      "
      :tooltip-title-accessor="(d: DataRecord) => formatDate(d.date)"
      :tooltip-y-formatter="(val: number) => formatNumber(val)"
      x-grid-line
      hide-y-axis
      hide-legend
    />
  </UCard>
</template>

<script setup lang="ts">
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  format,
} from "date-fns";
import type { Period, Range } from "#shared/types";

const cardRef = useTemplateRef<HTMLElement | null>("cardRef");

const props = defineProps<{
  period: Period;
  range: Range;
}>();

type DataRecord = {
  date: Date;
  revenue: number;
  cost: number;
};

const { width } = useElementSize(cardRef);

const data = ref<DataRecord[]>([]);

watch(
  [() => props.period, () => props.range],
  () => {
    const dates = (
      {
        daily: eachDayOfInterval,
        weekly: eachWeekOfInterval,
        monthly: eachMonthOfInterval,
      } as Record<Period, typeof eachDayOfInterval>
    )[props.period](props.range);

    const revenueMin = 1000;
    const revenueMax = 10000;
    const costMin = 500;
    const costMax = 5000;

    data.value = dates.map((date) => ({
      date,
      revenue:
        Math.floor(Math.random() * (revenueMax - revenueMin + 1)) + revenueMin,
      cost: Math.floor(Math.random() * (costMax - costMin + 1)) + costMin,
    }));
  },
  { immediate: true },
);

const total = computed(() =>
  data.value.reduce(
    (acc: number, { revenue, cost }) => acc + revenue - cost,
    0,
  ),
);

const formatNumber = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
}).format;

const formatDate = (date: Date): string => {
  return {
    daily: format(date, "d MMM"),
    weekly: format(date, "d MMM"),
    monthly: format(date, "MMM yyy"),
  }[props.period];
};
</script>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);

  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);

  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
