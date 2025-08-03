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

const defaultClass = "flex min-h-dvh flex-col";
</script>
