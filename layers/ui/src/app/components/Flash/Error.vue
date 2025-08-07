<template>
  <span :class="twMerge('size-20', props.class as string, 'relative')">
    <span v-if="pulse" class="absolute inline-flex size-full">
      <span
        class="bg-error m-auto size-4/5 animate-ping rounded-full opacity-20"
      />
    </span>
    <span
      class="bg-error-500/20 dark:bg-error-400/20 absolute inline-flex size-full rounded-full"
    >
      <UIcon
        :name="icon ?? 'lucide:circle-x'"
        class="text-error m-auto size-4/5"
      />
    </span>
  </span>
</template>

<script lang="ts">
import { twMerge } from "tailwind-merge";

export interface FlashErrorProps {
  /**
   * Whether to show a pulsing effect around the icon.
   * @default false
   */
  pulse?: boolean;
  class?: unknown;
  /**
   * The icon to display.
   * @defaultValue 'lucide:circle-x'
   */
  icon?: string;
}
</script>

<script setup lang="ts">
const props = defineProps<FlashErrorProps>();
</script>
