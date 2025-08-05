<template>
  <UButton
    v-bind="rootProps"
    :aria-label="
      sidebarCollapsed
        ? t('ui.dashboard.sidebar.collapse.collapse')
        : t('ui.dashboard.sidebar.collapse.expand')
    "
    :icon="sidebarCollapsed ? props.expandIcon : props.collapseIcon"
    :class="twMerge(defaultClass, props.class as string)"
    @click="collapseSidebar?.(!sidebarCollapsed)"
  />
</template>

<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";
import { useForwardProps } from "reka-ui";
import { twMerge } from "tailwind-merge";

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    as?: ButtonProps["as"];
    side?: "left" | "right";
    color?: ButtonProps["color"];
    variant?: ButtonProps["variant"];
    size?: ButtonProps["size"];
    disabled?: boolean;
    expandIcon?: string;
    collapseIcon?: string;
    class?: unknown;
  }>(),
  {
    as: "button",
    side: "left",
    color: "neutral",
    variant: "ghost",
    size: "md",
    disabled: false,
    expandIcon: "lucide:panel-left-open",
    collapseIcon: "lucide:panel-left-close",
    class: undefined,
  },
);
const rootProps = useForwardProps(
  reactivePick(props, "as", "color", "variant", "size"),
);

const defaultClass = "hidden lg:flex";

const { sidebarCollapsed, collapseSidebar } = useDashboardContext({
  sidebarCollapsed: ref(false),
  collapseSidebar: () => {},
});
</script>
