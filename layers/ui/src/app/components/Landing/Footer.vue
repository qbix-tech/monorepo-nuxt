<template>
  <Primitive :as="as" :class="twMerge(defaultClass, props.class as string)">
    <div
      v-if="!!slots.top"
      :class="twMerge(defaultTopClass, props.topClass as string)"
    >
      <slot name="top" />
    </div>

    <UContainer
      :class="twMerge(defaultContainerClass, props.containerClass as string)"
    >
      <div :class="twMerge(defaultRightClass, props.rightClass as string)">
        <slot name="right" />
      </div>

      <div :class="twMerge(defaultCenterClass, props.centerClass as string)">
        <slot />
      </div>

      <div :class="twMerge(defaultLeftClass, props.leftClass as string)">
        <slot name="left" />
      </div>
    </UContainer>

    <div
      v-if="!!slots.bottom"
      :class="twMerge(defaultBottomClass, props.bottomClass as string)"
    >
      <slot name="bottom" />
    </div>
  </Primitive>
</template>

<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import { twMerge } from "tailwind-merge";

export interface LandingFooterProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'footer'
   */
  as?: PrimitiveProps["as"];
  class?: unknown;
  topClass?: unknown;
  bottomClass?: unknown;
  containerClass?: unknown;
  leftClass?: unknown;
  rightClass?: unknown;
  centerClass?: unknown;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<LandingFooterProps>(), {
  as: "footer",
  class: undefined,
  topClass: undefined,
  bottomClass: undefined,
  containerClass: undefined,
  leftClass: undefined,
  rightClass: undefined,
  centerClass: undefined,
});

const slots = defineSlots();

const defaultClass = "";
const defaultTopClass = "py-8 lg:py-12";
const defaultBottomClass = "py-8 lg:py-12";
const defaultContainerClass =
  "py-8 lg:py-4 lg:flex lg:items-center lg:justify-between lg:gap-x-3";
const defaultLeftClass =
  "flex items-center justify-center lg:justify-start lg:flex-1 gap-x-1.5 mt-3 lg:mt-0 lg:order-1";
const defaultRightClass =
  "lg:flex-1 flex items-center justify-center lg:justify-end gap-x-1.5 lg:order-3";
const defaultCenterClass =
  "mt-3 lg:mt-0 lg:order-2 flex items-center justify-center";
</script>
