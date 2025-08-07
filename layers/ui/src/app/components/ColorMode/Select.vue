<template>
  <ClientOnly v-if="!colorMode?.forced">
    <USelectMenu
      v-model="preference"
      :search-input="false"
      :icon="preference?.icon"
      v-bind="$attrs"
      :items="items"
    />

    <template #fallback>
      <USelectMenu
        :search-input="false"
        :icon="items[0]?.icon"
        v-bind="$attrs"
        :model-value="items[0]"
        :items="items"
        disabled
      />
    </template>
  </ClientOnly>
</template>

<script lang="ts">
export interface ColorModeSelectProps {
  /**
   * @defaultValue "lucide:monitor"
   */
  systemIcon?: string;
  /**
   * @defaultValue "lucide:sun"
   */
  lightIcon?: string;
  /**
   * @defaultValue "lucide:moon"
   */
  darkIcon?: string;
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ColorModeSelectProps>(), {
  systemIcon: "lucide:monitor",
  lightIcon: "lucide:sun",
  darkIcon: "lucide:moon",
});

const { t } = useI18n();
const colorMode = useColorMode();

const items = computed(() => [
  { label: t("ui.colorMode.system"), value: "system", icon: props.systemIcon },
  { label: t("ui.colorMode.light"), value: "light", icon: props.lightIcon },
  { label: t("ui.colorMode.dark"), value: "dark", icon: props.darkIcon },
]);

const preference = computed({
  get() {
    return (
      items.value.find((option) => option.value === colorMode.preference) ||
      items.value[0]
    );
  },
  set(option) {
    colorMode.preference = option!.value;
  },
});
</script>
