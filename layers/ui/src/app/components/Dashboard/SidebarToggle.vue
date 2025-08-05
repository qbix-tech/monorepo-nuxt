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

<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";
import { useForwardProps } from "reka-ui";
import { twMerge } from "tailwind-merge";

const { t } = useI18n();
const appConfig = useAppConfig();

const props = withDefaults(
  defineProps<{
    as?: ButtonProps["as"];
    side?: "left" | "right";
    color?: ButtonProps["color"];
    variant?: ButtonProps["variant"];
    size?: ButtonProps["size"];
    menuIcon?: string;
    class?: unknown;
  }>(),
  {
    as: "button",
    side: "left",
    color: "neutral",
    variant: "ghost",
    size: "md",
    menuIcon: "lucide:menu",
    class: undefined,
  },
);
const rootProps = useForwardProps(
  reactivePick(props, "as", "color", "variant", "size"),
);

const defaultClass = "lg:hidden";

const { sidebarOpen, toggleSidebar } = useDashboardContext({
  sidebarOpen: ref(false),
  toggleSidebar: () => {},
});
</script>
