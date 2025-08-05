<template>
  <Primitive :as="as" :class="twMerge(defaultClass, props.class as string)">
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import { twMerge } from "tailwind-merge";

const props = withDefaults(
  defineProps<{
    as?: PrimitiveProps["as"];
    class?: unknown;
  }>(),
  {
    as: "div",
    class: undefined,
  },
);

const defaultClass =
  "relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8";
</script>
