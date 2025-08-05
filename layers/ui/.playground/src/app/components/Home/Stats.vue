<template>
  <PageGrid class="gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-px">
    <PageCard
      v-for="(stat, index) in stats"
      :key="index"
      :icon="stat.icon"
      :title="stat.title"
      to="/customers"
      variant="subtle"
      class="first:rounded-l-lg last:rounded-r-lg hover:z-1 lg:rounded-none"
      container-class="gap-y-1.5"
      wrapper-class="items-start"
      leading-class="p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col"
      title-class="font-normal text-muted text-xs uppercase"
    >
      <div class="flex items-center gap-2">
        <span class="text-highlighted text-2xl font-semibold">
          {{ stat.value }}
        </span>

        <UBadge
          :color="stat.variation > 0 ? 'success' : 'error'"
          variant="subtle"
          class="text-xs"
        >
          {{ stat.variation > 0 ? "+" : "" }}{{ stat.variation }}%
        </UBadge>
      </div>
    </PageCard>
  </PageGrid>
</template>

<script setup lang="ts">
import type { Period, Range, Stat } from "#shared/types";

const props = defineProps<{
  period: Period;
  range: Range;
}>();

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

const baseStats = [
  {
    title: "Customers",
    icon: "lucide:users",
    minValue: 400,
    maxValue: 1000,
    minVariation: -15,
    maxVariation: 25,
  },
  {
    title: "Conversions",
    icon: "lucide:chart-pie",
    minValue: 1000,
    maxValue: 2000,
    minVariation: -10,
    maxVariation: 20,
  },
  {
    title: "Revenue",
    icon: "lucide:circle-dollar-sign",
    minValue: 200000,
    maxValue: 500000,
    minVariation: -20,
    maxVariation: 30,
    formatter: formatCurrency,
  },
  {
    title: "Orders",
    icon: "lucide:shopping-cart",
    minValue: 100,
    maxValue: 300,
    minVariation: -5,
    maxVariation: 15,
  },
];

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const { data: stats } = await useAsyncData<Stat[]>(
  "stats",
  async () => {
    return baseStats.map((stat) => {
      const value = randomInt(stat.minValue, stat.maxValue);
      const variation = randomInt(stat.minVariation, stat.maxVariation);

      return {
        title: stat.title,
        icon: stat.icon,
        value: stat.formatter ? stat.formatter(value) : value,
        variation,
      };
    });
  },
  {
    watch: [() => props.period, () => props.range],
    default: () => [],
  },
);
</script>
