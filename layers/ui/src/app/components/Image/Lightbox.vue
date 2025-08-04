<template>
  <UModal v-model:open="open" :ui="props.ui">
    <slot>
      <img
        :src="props.src"
        :alt="props.alt"
        v-bind="{ ...$attrs, class: undefined, ui: undefined }"
        :class="twMerge('cursor-pointer', $attrs.class as string)"
      />
    </slot>
    <template #content>
      <img
        :src="props.src"
        :alt="props.alt"
        class="h-auto w-full"
        @click="open = false"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { ModalProps } from "@nuxt/ui";
import { twMerge } from "tailwind-merge";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  src?: string;
  alt?: string;
  ui?: ModalProps["ui"];
}>();

const open = defineModel<boolean>({
  default: false,
  type: Boolean,
});
</script>
