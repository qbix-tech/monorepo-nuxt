<template>
  <component
    :is="UInput"
    v-model="maskedModelValue"
    v-maska="options"
    placeholder="0.00"
    :class="twMerge('[&>input]:text-right', props.class as string)"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </component>
</template>

<script lang="ts">
import type { InputProps } from "@nuxt/ui";
import { UInput } from "#components";
import type { MaskInputOptions } from "maska";
import { twMerge } from "tailwind-merge";

export interface CurrencyInputProps extends /* @vue-ignore */ InputProps {
  /**
   * The thousands separator to use in the input.
   * @defaultvalue ","
   */
  separator?: string;
}
</script>

<script setup lang="ts">
const props = defineProps<CurrencyInputProps>();

const modelValue = defineModel<string | undefined>();
const maskedModelValue = computed({
  get: () => {
    if (modelValue.value === undefined || modelValue.value === null) {
      return "";
    }
    return modelValue.value.replace(/[^0-9.]/g, "");
  },
  set: (newValue: string) => {
    modelValue.value = newValue.replace(/[^0-9.]/g, "");
    return modelValue.value;
  },
});

const options = ref<MaskInputOptions>({
  mask: `9${props.separator ?? ","}99#.##`,
  tokens: {
    "9": {
      pattern: /[0-9]/,
      transform: (value) => value.replace(/[^0-9]/g, ""),
      repeated: true,
    },
    "#": {
      pattern: /[0-9.]/,
      transform: (value) => value.replace(/[^0-9.]/g, ""),
    },
  },
  reversed: true,
});
</script>
