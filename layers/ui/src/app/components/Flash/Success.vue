<template>
  <span :class="twMerge('size-20', props.class as string, 'relative')">
    <span v-if="pulse" class="absolute inline-flex size-full">
      <span
        class="bg-success m-auto size-4/5 animate-ping rounded-full opacity-20"
      />
    </span>
    <span
      class="bg-success-500/20 dark:bg-success-400/20 absolute inline-flex size-full rounded-full"
    >
      <UIcon
        :name="icon ?? 'lucide:circle-check'"
        class="text-success m-auto size-4/5"
      />
    </span>
  </span>
</template>

<script setup lang="ts">
import { twMerge } from "tailwind-merge";

const props = defineProps<{
  /**
   * Whether to show a pulsing effect around the icon.
   * @default false
   */
  pulse?: boolean;
  class?: unknown;
  /**
   * The icon to display.
   * @defaultvalue 'lucide:circle-x'
   */
  icon?: string;
}>();
</script>
