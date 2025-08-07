<template>
  <Primitive :as="as" :class="twMerge(defaultClass, props.class as string)">
    <slot>
      <div :class="twMerge(defaultLeftClass, props.leftClass as string)">
        <slot name="left" />
      </div>

      <div :class="twMerge(defaultRightClass, props.rightClass as string)">
        <slot name="right" />
      </div>
    </slot>
  </Primitive>
</template>

<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import { twMerge } from "tailwind-merge";

export interface DashboardToolbarProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps["as"];
  class?: unknown;
  leftClass?: unknown;
  rightClass?: unknown;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<DashboardToolbarProps>(), {
  as: "div",
  class: undefined,
  leftClass: undefined,
  rightClass: undefined,
});

const defaultClass =
  "shrink-0 flex items-center justify-between border-b border-default px-4 sm:px-6 gap-1.5 overflow-x-auto min-h-[49px]";
const defaultLeftClass = "flex items-center gap-1.5";
const defaultRightClass = "flex items-center gap-1.5";
</script>
