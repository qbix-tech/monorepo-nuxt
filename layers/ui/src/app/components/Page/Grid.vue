<template>
  <Primitive :as="as" :class="twMerge(defaultClass, props.class as string)">
    <slot />
  </Primitive>
</template>

<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import { twMerge } from "tailwind-merge";

export interface PageGridProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps["as"];
  class?: unknown;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<PageGridProps>(), {
  as: "div",
  class: undefined,
});

const defaultClass =
  "relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8";
</script>
