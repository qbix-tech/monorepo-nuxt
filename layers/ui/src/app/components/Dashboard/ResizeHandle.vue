<template>
  <Primitive
    :as="as"
    role="separator"
    :class="twMerge(defaultClass, props.class as string)"
  >
    <slot />
  </Primitive>
</template>

<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import { twMerge } from "tailwind-merge";

export interface DashbaordResizeHandleProps extends PrimitiveProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps["as"];
  class?: unknown;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<DashbaordResizeHandleProps>(), {
  as: "div",
  class: undefined,
});

const defaultClass =
  "hidden lg:block touch-none select-none cursor-ew-resize relative before:absolute before:inset-y-0 before:-left-1.5 before:-right-1.5";
</script>
