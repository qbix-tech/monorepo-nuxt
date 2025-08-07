<template>
  <ClientOnly v-if="!colorMode?.forced">
    <USwitch
      v-model="isDark"
      :checked-icon="darkIcon"
      :unchecked-icon="lightIcon"
      :aria-label="
        isDark
          ? t('ui.colorMode.switchToLight')
          : t('ui.colorMode.switchToDark')
      "
      v-bind="$attrs"
    />

    <template #fallback>
      <USwitch
        :checked-icon="darkIcon"
        :unchecked-icon="lightIcon"
        :aria-label="
          isDark
            ? t('ui.colorMode.switchToLight')
            : t('ui.colorMode.switchToDark')
        "
        v-bind="$attrs"
        disabled
      />
    </template>
  </ClientOnly>
</template>

<script lang="ts">
import type { SwitchProps } from "@nuxt/ui";

export interface ColorModeSwitchProps {
  /**
   * @defaultValue "lucide:sun"
   */
  lightIcon?: SwitchProps["checkedIcon"];
  /**
   * @defaultValue "lucide:moon"
   */
  darkIcon?: SwitchProps["checkedIcon"];
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

withDefaults(defineProps<ColorModeSwitchProps>(), {
  lightIcon: "lucide:sun",
  darkIcon: "lucide:moon",
});

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
