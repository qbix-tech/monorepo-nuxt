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

<script setup lang="ts">
import type { SwitchProps } from "@nuxt/ui";

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    lightIcon?: SwitchProps["checkedIcon"];
    darkIcon?: SwitchProps["checkedIcon"];
  }>(),
  {
    lightIcon: "lucide:sun",
    darkIcon: "lucide:moon",
  },
);

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
