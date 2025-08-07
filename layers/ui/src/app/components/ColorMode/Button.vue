<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UButton
      :icon="isDark ? darkIcon : lightIcon"
      :color="color"
      :variant="variant"
      :aria-label="
        isDark
          ? t('ui.colorMode.switchToLight')
          : t('ui.colorMode.switchToDark')
      "
      v-bind="$attrs"
      :class="twMerge(defaultClass, props.class as string)"
      @click="isDark = !isDark"
    />

    <template #fallback>
      <slot name="fallback">
        <UButton
          :color="color"
          :variant="variant"
          v-bind="$attrs"
          :class="twMerge(defaultClass, props.class as string)"
          loading
        />
        <!-- <div class="size-8" /> -->
      </slot>
    </template>
  </ClientOnly>
</template>

<script lang="ts">
import type { ButtonProps } from "@nuxt/ui";
import { twMerge } from "tailwind-merge";

export interface ColorModeButtonProps {
  /**
   * @defaultValue 'neutral'
   */
  color?: ButtonProps["color"];
  /**
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps["variant"];
  /**
   * @defaultValue 'lucide:sun'
   */
  lightIcon?: ButtonProps["icon"];
  /**
   * @defaultValue 'lucide:moon'
   */
  darkIcon?: ButtonProps["icon"];
  class?: unknown;
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ColorModeButtonProps>(), {
  color: "neutral",
  variant: "ghost",
  lightIcon: "lucide:sun",
  darkIcon: "lucide:moon",
  class: undefined,
});

const defaultClass = "cursor-pointer";

const { t } = useI18n();
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
</script>
