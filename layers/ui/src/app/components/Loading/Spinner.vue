<template>
  <div
    class="flex w-full items-center justify-center"
    :style="`min-height:${props.minHeight};`"
  >
    <UIcon
      :name="appConfig.ui.icons.loading"
      class="animate-spin text-neutral-300 dark:text-neutral-600"
      :style="`width:${props.size};height:${props.size};`"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    minHeight?: string;
    size?: string;
  }>(),
  {
    minHeight: "4rem",
    size: "2rem",
  },
);

const appConfig = useAppConfig();
</script>
