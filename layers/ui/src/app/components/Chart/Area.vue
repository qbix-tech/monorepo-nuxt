<template>
  <div
    class="flex flex-col space-y-4"
    :class="{ 'flex-col-reverse': LegendPositionTop }"
  >
    <VisXYContainer
      :data="data"
      :width="width"
      :height="height"
      :padding="padding"
      :svg-defs="svgDefs"
      :class="props.class"
    >
      <VisTooltip
        v-if="!hideTooltip"
        :horizontal-placement="Position.Right"
        :vertical-placement="Position.Top"
      />
      <template v-for="(i, iKey) in Object.keys(props.categories)" :key="iKey">
        <VisLine
          :x="props.xAccessor ?? ((_: T, i: number) => i)"
          :y="props.yAccessor ?? ((d: T) => d[i as keyof T])"
          :color="colors[iKey]"
          :curve-type="curveType ?? CurveType.MonotoneX"
        />
        <VisArea
          :x="props.xAccessor ?? ((_: T, i: number) => i)"
          v-bind="accessors(i)"
          :color="colors[iKey]"
          :opacity="DEFAULT_OPACITY"
          :curve-type="curveType ?? CurveType.MonotoneX"
        />
      </template>

      <VisAxis
        v-if="!hideXAxis"
        type="x"
        :x="props.xAccessor ?? ((_: T, i: number) => i)"
        :tick-format="xFormatter"
        :label="xLabel"
        :label-margin="8"
        :domain-line="xDomainLine"
        :grid-line="xGridLine"
        :num-ticks="xNumTicks"
        :tick-line="xTickLine"
        :tick-values="xExplicitTicks"
        :min-max-ticks-only="minMaxTicksOnly"
      />
      <VisAxis
        v-if="!hideYAxis"
        type="y"
        :num-ticks="yNumTicks"
        :tick-format="yFormatter"
        :label="yLabel"
        :grid-line="yGridLine"
        :domain-line="yDomainLine"
        :tick-line="yTickLine"
      />
      <VisCrosshair
        v-if="!hideTooltip"
        color="var(--ui-bg-inverted)"
        :template="generateTooltip"
      />
    </VisXYContainer>
    <div
      v-if="!hideLegend"
      class="flex items-center justify-end"
      :class="{ 'pb-4': LegendPositionTop }"
    >
      <VisBulletLegend :items="Object.values(categories)" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { createApp } from "vue";
import { type NumericAccessor, CurveType, Position } from "@unovis/ts";
import {
  VisArea,
  VisAxis,
  VisBulletLegend,
  VisCrosshair,
  VisLine,
  VisTooltip,
  VisXYContainer,
} from "@unovis/vue";

import Tooltip from "./Tooltip.vue";

// Constants for default values
const DEFAULT_TICK_COUNT = 24;
const DEFAULT_TICK_DIVISOR = 4;
const DEFAULT_OPACITY = 0.1;
const DEFAULT_COLOR = "var(--ui-primary)";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /**
     * The data to be displayed in the area chart.
     * Each element of the array represents a data point.
     * The structure of 'T' should be compatible with the chart's rendering logic.
     */
    data: T[];
    /**
     * The width of the chart in pixels.
     */
    width?: number;
    /**
     * The height of the chart in pixels.
     */
    height?: number;
    /**
     * Optional label for the x-axis.
     */
    xLabel?: string;
    /**
     * Optional label for the y-axis.
     */
    yLabel?: string;
    /**
     * Optional padding applied to the chart.
     * Allows specifying individual padding values for the top, right, bottom, and left sides.
     */
    padding?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    /**
     * This defines the visual representation and labels for each category in the chart's legend.
     */
    categories: Record<
      string,
      {
        name: string | number;
        color?: string;
        className?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        shape?: any;
        inactive?: boolean;
        hidden?: boolean;
        pointer?: boolean;
      }
    >;
    /**
     * @param {number|Date} tick - The value of the tick. This can be a number or a Date object depending on the scale of the x-axis.
     * @param {number} i - The index of the tick in the `ticks` array.
     * @param {(number[]|Date[])} ticks - An array of all tick values for the x-axis.
     * @returns {string} The formatted string representation of the tick.
     */
    xFormatter?:
      | ((tick: number, i: number, ticks: number[]) => string)
      | ((tick: Date, i: number, ticks: Date[]) => string);
    /**
     * The accessor function for the x-axis data.
     */
    xAccessor?: NumericAccessor<T>;
    /**
     * @param {number|Date} tick - The value of the tick. This can be a number or a Date object depending on the scale of the y-axis.
     * @param {number} i - The index of the tick in the `ticks` array.
     * @param {(number[]|Date[])} ticks - An array of all tick values for the y-axis.
     * @returns {string} The formatted string representation of the tick.
     */
    yFormatter?:
      | ((tick: number, i: number, ticks: number[]) => string)
      | ((tick: Date, i: number, ticks: Date[]) => string);
    /**
     * The accessor function for the y-axis data.
     */
    yAccessor?: NumericAccessor<T>;
    /**
     * The tooltip title accessor function.
     */
    tooltipTitleAccessor?: (d: T) => string | number;
    /**
     * The function to format the y-axis values in the tooltip.
     */
    tooltipYFormatter?: (value: any) => string | number;
    /**
     * The type of curve to use for the area chart lines.
     * See `CurveType` for available options.
     */
    curveType?: CurveType;
    /**
     * The desired number of ticks on the x-axis.
     */
    xNumTicks?: number;
    /**
     * Force specific ticks on the x-axis.
     */
    xExplicitTicks?: number;
    /**
     * Force only first and last ticks on the x-axis.
     */
    minMaxTicksOnly?: boolean;
    /**
     * The desired number of ticks on the y-axis.
     */
    yNumTicks?: number;
    /**
     * If `true`, hides the chart legend.
     */
    hideLegend?: boolean;
    /**
     * If `true`, hides the chart tooltip.
     */
    hideTooltip?: boolean;
    /**
     * Optional position for the legend, if applicable. Valid values are "top" or "bottom".
     */
    legendPosition?: "top" | "bottom";
    /**
     * If `true`, displays a domain line (axis line) along the x-axis.
     */
    xDomainLine?: boolean;
    /**
     * If `true`, displays a domain line (axis line) along the y-axis.
     */
    yDomainLine?: boolean;
    /**
     * If `true`, displays tick lines on the x-axis.
     */
    xTickLine?: boolean;
    /**
     * If `true`, displays tick lines on the y-axis.
     */
    yTickLine?: boolean;
    /**
     * If `true`, displays grid lines along the x-axis.
     */
    xGridLine?: boolean;
    /**
     * If `true`, displays grid lines along the y-axis.
     */
    yGridLine?: boolean;
    /**
     * If `true`, hide the x-axis.
     */
    hideXAxis?: boolean;
    /**
     * If `true`, hide the y-axis.
     */
    hideYAxis?: boolean;
    /**
     *
     */
    class?: unknown;
  }>(),
  {
    width: undefined,
    height: undefined,
    xLabel: undefined,
    yLabel: undefined,
    xFormatter: undefined,
    xAccessor: (d: T, i: number) => i,
    yFormatter: undefined,
    yAccessor: undefined,
    tooltipTitleAccessor: undefined,
    tooltipYFormatter: undefined,
    curveType: undefined,
    xExplicitTicks: undefined,
    legendPosition: undefined,
    padding: () => {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      };
    },
    xNumTicks: (props) =>
      props.data.length > DEFAULT_TICK_COUNT
        ? DEFAULT_TICK_COUNT / DEFAULT_TICK_DIVISOR
        : props.data.length - 1,
    yNumTicks: (props) =>
      props.data.length > DEFAULT_TICK_COUNT
        ? DEFAULT_TICK_COUNT / DEFAULT_TICK_DIVISOR
        : props.data.length - 1,
    class: undefined,
  },
);

const colors = Object.values(props.categories).map((c) => c.color);

const generateTooltip = computed(() => (d: T) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "";
  }

  try {
    const app = createApp(Tooltip, {
      data: d,
      categories: props.categories,
      toolTipTitle: (props.tooltipTitleAccessor ?? getFirstPropertyValue)(d),
      yFormatter: props.tooltipYFormatter,
    });

    const container = document.createElement("div");
    app.mount(container);

    const html = container.innerHTML;
    app.unmount();

    return html;
  } catch {
    return "";
  }
});

function getFirstPropertyValue(obj: unknown) {
  if (obj && Object.keys(obj).length > 0) {
    const firstKey = Object.keys(obj)[0];
    return obj[firstKey as keyof typeof obj];
  }
  return undefined;
}

function accessors(id: string): { y: NumericAccessor<T>; color: string } {
  return {
    y: (d: T) => Number(d[id as keyof T]),
    color: props.categories[id]?.color ?? DEFAULT_COLOR,
  };
}

function generateCSSVarsSvg(index: number, color: string) {
  return `
  <linearGradient id="gradient${index}-${color}" gradientTransform="rotate(90)">
  <stop offset="0%" style="stop-color:var(--vis-color0);stop-opacity:1" />
    <stop offset="100%" style="stop-color:var(--vis-color0);stop-opacity:0" />
  </linearGradient>
`;
}

function generateSvg(index: number, color: string) {
  return `
  <linearGradient id="gradient${index}-${color}" gradientTransform="rotate(90)">
    <stop offset="0%" stop-color="${color}" stop-opacity="1" />
    <stop offset="100%" stop-color="${color}" stop-opacity="0" />
  </linearGradient>
`;
}

const svgDefs = computed(() =>
  colors
    .map((color, index) =>
      color?.includes("#")
        ? generateSvg(index, color)
        : generateCSSVarsSvg(index, color ?? DEFAULT_COLOR),
    )
    .join(""),
);

const LegendPositionTop = computed(() => props.legendPosition === "top");
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
