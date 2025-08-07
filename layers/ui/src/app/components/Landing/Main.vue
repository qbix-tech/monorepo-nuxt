<template>
  <Primitive :as="as" :class="twMerge(defaultClass, props.class as string)">
    <slot />
  </Primitive>
</template>

<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import { twMerge } from "tailwind-merge";

export interface LandingMainProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'main'
   */
  as?: PrimitiveProps["as"];
  class?: unknown;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<LandingMainProps>(), {
  as: "main",
  class: undefined,
});

const defaultClass = "flex-grow";
</script>
