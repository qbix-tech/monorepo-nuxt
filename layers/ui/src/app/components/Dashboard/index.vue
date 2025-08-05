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
    storage?: "cookie" | "local";
    storageKey?: string;
    persistent?: boolean;
    unit?: "%" | "px" | "rem";
    class?: unknown;
  }>(),
  {
    as: "dive",
    storage: "cookie",
    storageKey: "dashboard",
    persistent: true,
    unit: "%",
    class: undefined,
  },
);

const defaultClass = "fixed inset-0 flex overflow-hidden";

const sidebarOpen = ref(false);
const sidebarCollapsed = ref(false);

const nuxtApp = useNuxtApp();
provideDashboardContext({
  storage: props.storage,
  storageKey: props.storageKey,
  persistent: props.persistent,
  unit: props.unit,
  sidebarOpen,
  toggleSidebar: () => {
    nuxtApp.hooks.callHook("dashboard:sidebar:toggle");
  },
  sidebarCollapsed,
  collapseSidebar: (collapsed) => {
    nuxtApp.hooks.callHook("dashboard:sidebar:collapse", collapsed);
  },
  toggleSearch: () => {
    nuxtApp.hooks.callHook("dashboard:search:toggle");
  },
});
</script>
