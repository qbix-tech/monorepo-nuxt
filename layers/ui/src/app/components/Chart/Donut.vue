<template>
  <div class="flex items-center justify-center">
    <VisSingleContainer :data="data" :height="height" :margin="{}">
      <VisTooltip
        :horizontal-shift="20"
        :vertical-shift="20"
        :triggers="tooltip"
      />

      <VisDonut
        :value="value"
        :corner-radius="radius"
        :arc-width="arcWidth"
        :color="props.labels.map((l) => l.color)"
        :angle-range="isHalf ? [-1.5707963267948966, 1.5707963267948966] : []"
      />
    </VisSingleContainer>

    <slot />
  </div>

  <div
    v-if="!hideLegend"
    class="mt-4 flex items-center justify-center [&_span:last-child]:text-gray-900 [&_span:last-child]:dark:text-white"
  >
    <VisBulletLegend :items="labels" />
  </div>
</template>

<script setup lang="ts">
import { Donut } from "@unovis/ts";
import {
  VisBulletLegend,
  VisDonut,
  VisSingleContainer,
  VisTooltip,
} from "@unovis/vue";

const props = defineProps<{
  /**
   * The type of donut chart to render. Valid values are `full` or `half`.
   */
  type?: "full" | "half";
  /**
   * The data to be displayed in the donut chart.
   * Each number in the array represents a segment value.
   */
  data: number[];
  /**
   * The height of the chart in pixels.
   */
  height: number;
  /**
   * The radius of the donut in pixels.
   */
  radius: number;
  /**
   * The width of the donut arc in pixels.
   */
  arcWidth: number;
  /**
   * If `true`, hides the chart legend.
   */
  hideLegend?: boolean;
  /**
   * An array of label objects defining the name and color for each segment.
   */
  labels: {
    name: string;
    color: string;
  }[];
  /**
   * Tooltip html template for the donut segments.
   */
  tooltipTemplate?: (d: { index: number; data: number }) => string;
}>();

const value = (d: number) => d;

const isHalf = props.type === "half";

const tooltip = {
  [Donut.selectors.segment]:
    props.tooltipTemplate ??
    ((d: { index: number; data: number }) => {
      return `
      <div class='flex items-center'>
      <div class='w-2 h-2 rounded-full mr-2' style='background-color: ${props.labels[d.index]?.color};'></div>
        <div>${d.data}</div>
      </vistooltip>
    </vissinglecontainer>
  </div>`;
    }),
};
</script>
