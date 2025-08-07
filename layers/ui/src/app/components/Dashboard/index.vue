<template>
  <Primitive :as="as" :class="twMerge(defaultClass, props.class as string)">
    <slot />
  </Primitive>
</template>

<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import { twMerge } from "tailwind-merge";

export interface DashboardProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps["as"];
  /**
   * The storage type to use for persisting the dashboard state. `cookie` is preferred for SSR compatibility, while `local` is used for client-side only.
   * @defaultValue 'cookie'
   */
  storage?: "cookie" | "local";
  /**
   * Unique id used to store the dashboard state in the storage.
   * @defaultValue 'dashboard'
   */
  storageKey?: string;
  /**
   * Whether to persist the dashboard state across sessions.
   * If `false`, the dashboard state will reset on page reload.
   * @defaultValue true
   */
  persistent?: boolean;
  /**
   * The unit to use for size values.
   * @defaultValue '%'
   */
  unit?: "%" | "px" | "rem";
  class?: unknown;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<DashboardProps>(), {
  as: "div",
  storage: "cookie",
  storageKey: "dashboard",
  persistent: true,
  unit: "%",
  class: undefined,
});

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
