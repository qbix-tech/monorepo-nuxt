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

<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";
import { twMerge } from "tailwind-merge";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    color?: ButtonProps["color"];
    variant?: ButtonProps["variant"];
    lightIcon?: ButtonProps["icon"];
    darkIcon?: ButtonProps["icon"];
    class?: unknown;
  }>(),
  {
    color: "neutral",
    variant: "ghost",
    lightIcon: "lucide:sun",
    darkIcon: "lucide:moon",
    class: undefined,
  },
);

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
