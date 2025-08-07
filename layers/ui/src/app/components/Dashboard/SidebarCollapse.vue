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

<script lang="ts">
import type { ButtonProps } from "@nuxt/ui";
import { useForwardProps } from "reka-ui";
import { twMerge } from "tailwind-merge";

export interface DashboardSidebarCollapseProps {
  /**
   * The element or component this component should render as when not a link.
   * @defaultValue 'button'
   */
  as?: ButtonProps["as"];
  /**
   * @defaultValue 'left'
   */
  side?: "left" | "right";
  /**
   * @defaultValue 'neutral'
   */
  color?: ButtonProps["color"];
  /**
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps["variant"];
  /**
   * @defaultValue 'md'
   */
  size?: ButtonProps["size"];
  disabled?: boolean;
  /**
   * @defaultValue 'lucide:panel-left-open'
   */
  expandIcon?: string;
  /**
   * @defaultValue 'lucide:panel-left-close'
   */
  collapseIcon?: string;
  class?: unknown;
}
</script>

<script setup lang="ts">
const { t } = useI18n();

const props = withDefaults(defineProps<DashboardSidebarCollapseProps>(), {
  as: "button",
  side: "left",
  color: "neutral",
  variant: "ghost",
  size: "md",
  disabled: false,
  expandIcon: "lucide:panel-left-open",
  collapseIcon: "lucide:panel-left-close",
  class: undefined,
});
const rootProps = useForwardProps(
  reactivePick(props, "as", "color", "variant", "size"),
);

const defaultClass = "hidden lg:flex";

const { sidebarCollapsed, collapseSidebar } = useDashboardContext({
  sidebarCollapsed: ref(false),
  collapseSidebar: () => {},
});
</script>
