<template>
  <UButton
    v-bind="rootProps"
    :aria-label="
      sidebarOpen
        ? t('ui.dashboard.sidebar.toggle.close')
        : t('ui.dashboard.sidebar.toggle.open')
    "
    :icon="sidebarOpen ? appConfig.ui.icons.close : props.menuIcon"
    :class="twMerge(defaultClass, props.class as string)"
    @click="toggleSidebar"
  />
</template>

<script lang="ts">
import type { ButtonProps } from "@nuxt/ui";
import { useForwardProps } from "reka-ui";
import { twMerge } from "tailwind-merge";

export interface DashboardSidebarToggleProps {
  /**
   * The element or component this component should render as when not a link.
   * @defaultValue 'button'
   */
  as?: ButtonProps["as"];
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
  menuIcon?: string;
  class?: unknown;
}
</script>

<script setup lang="ts">
const { t } = useI18n();
const appConfig = useAppConfig();

const props = withDefaults(defineProps<DashboardSidebarToggleProps>(), {
  as: "button",
  side: "left",
  color: "neutral",
  variant: "ghost",
  size: "md",
  menuIcon: "lucide:menu",
  class: undefined,
});
const rootProps = useForwardProps(
  reactivePick(props, "as", "color", "variant", "size"),
);

const defaultClass = "lg:hidden";

const { sidebarOpen, toggleSidebar } = useDashboardContext({
  sidebarOpen: ref(false),
  toggleSidebar: () => {},
});
</script>
