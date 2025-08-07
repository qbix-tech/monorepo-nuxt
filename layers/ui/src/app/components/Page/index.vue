<template>
  <Primitive :as="as" :class="twMerge(defaultClass, props.class as string)">
    <Slot
      v-if="!!slots.left"
      :class="twMerge(defaultLeftClass, props.leftClass as string)"
    >
      <slot name="left" />
    </Slot>

    <div :class="twMerge(defaultCenterClass, props.centerClass as string)">
      <slot />
    </div>

    <Slot
      v-if="!!slots.right"
      :class="twMerge(defaultRightClass, props.rightClass as string)"
    >
      <slot name="right" />
    </Slot>
  </Primitive>
</template>

<script lang="ts">
import { Primitive, Slot, type PrimitiveProps } from "reka-ui";
import { twMerge } from "tailwind-merge";

export interface PageProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps["as"];
  class?: unknown;
  leftClass?: unknown;
  centerClass?: unknown;
  rightClass?: unknown;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<PageProps>(), {
  as: "div",
  class: undefined,
  leftClass: undefined,
  centerClass: undefined,
  rightClass: undefined,
});

const defaultClass = "flex flex-col lg:grid lg:grid-cols-10 lg:gap-10";
const defaultLeftClass = "lg:col-span-2";
const defaultCenterClass = "lg:col-span-8";
const defaultRightClass = "lg:col-span-2 order-first lg:order-last";

const slots = defineSlots();
</script>
