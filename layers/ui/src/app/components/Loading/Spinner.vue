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

<script lang="ts">
export interface LoadingSpinnerProps {
  /**
   * The minimum height of the spinner container.
   * @defaultValue '0'
   */
  minHeight?: string;
  /**
   * The size of the spinner icon.
   * @defaultValue '2rem'
   */
  size?: string;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<LoadingSpinnerProps>(), {
  minHeight: "0",
  size: "2rem",
});

const appConfig = useAppConfig();
</script>
