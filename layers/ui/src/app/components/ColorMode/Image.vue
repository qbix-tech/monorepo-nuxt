<template>
  <component
    :is="ImageComponent"
    :src="light"
    :alt="alt"
    class="dark:hidden"
    v-bind="$attrs"
  />
  <component
    :is="ImageComponent"
    :src="dark"
    :alt="alt"
    class="hidden dark:block"
    v-bind="$attrs"
  />
</template>

<script lang="ts">
import ImageComponent from "#build/ui-image-component";

export interface ColorModeImageProps {
  /**
   * The image source `src` for dark mode.
   */
  dark: string;
  /**
   * The image source `src` for light mode.
   */
  light: string;
  /**
   * The alternative text for the image.
   */
  alt?: string;
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

defineProps<ColorModeImageProps>();
</script>
