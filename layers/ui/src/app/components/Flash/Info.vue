<template>
  <span :class="twMerge('size-20', props.class as string, 'relative')">
    <span v-if="pulse" class="absolute inline-flex size-full">
      <span
        class="bg-info m-auto size-4/5 animate-ping rounded-full opacity-20"
      />
    </span>
    <span
      class="bg-info-500/20 dark:bg-info-400/20 absolute inline-flex size-full rounded-full"
    >
      <UIcon :name="icon ?? 'lucide:info'" class="text-info m-auto size-4/5" />
    </span>
  </span>
</template>

<script setup lang="ts">
import { twMerge } from "tailwind-merge";

const props = defineProps<{
  pulse?: boolean;
  class?: unknown;
  icon?: string;
}>();
</script>
