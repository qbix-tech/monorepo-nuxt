<template>
  <div
    class="flex w-full items-center justify-center"
    :style="`min-height:${props.minHeight};`"
  >
    <UIcon
      :name="appConfig.ui.icons.loading"
      class="text-dimmed/60 animate-spin"
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
    minHeight: "0",
    size: "2rem",
  },
);

const appConfig = useAppConfig();
</script>
