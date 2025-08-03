<template>
  <Primitive :as="as" :class="twMerge(defaultClass, props.class as string)">
    <p
      v-if="!!props.error?.statusCode || !!slots.statusCode"
      class="text-primary text-2xl font-semibold"
    >
      <slot name="statusCode">
        {{ props.error?.statusCode }}
      </slot>
    </p>
    <h1
      v-if="!!props.error?.statusMessage || !!slots.statusMessage"
      class="text-highlighted mt-2 text-3xl font-bold text-balance sm:text-4xl"
    >
      <slot name="statusMessage">
        {{ props.error?.statusMessage }}
      </slot>
    </h1>
    <p
      v-if="
        (props.error?.message &&
          props.error.message !== props.error.statusMessage) ||
        !!slots.message
      "
      class="text-muted mt-4 text-lg text-balance"
    >
      <slot name="message">
        {{ props.error?.message }}
      </slot>
    </p>
    <div
      v-if="!!clear || !!slots.links"
      class="mt-8 flex items-center justify-center gap-6"
    >
      <slot name="links">
        <UButton
          v-if="clear"
          size="lg"
          color="primary"
          variant="solid"
          :label="t('ui.error.clear')"
          v-bind="typeof clear === 'object' ? clear : {}"
          class="cursor-pointer"
          @click="handleError"
        />
      </slot>
    </div>
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import type { ButtonProps } from "@nuxt/ui";
import type { NuxtError } from "#app";
import { twMerge } from "tailwind-merge";

const props = withDefaults(
  defineProps<{
    as?: PrimitiveProps["as"];
    error?: Partial<NuxtError<unknown> & { message: string }>;
    redirect?: string;
    clear?: boolean | Partial<ButtonProps>;
    class?: unknown;
  }>(),
  {
    as: "main",
    error: undefined,
    redirect: "/",
    clear: true,
    class: undefined,
  },
);

const defaultClass =
  "min-h-dvh flex flex-col items-center justify-center text-center";

const slots = defineSlots();

const { t } = useI18n();

const handleError = () => {
  clearError({ redirect: props.redirect });
};
</script>
