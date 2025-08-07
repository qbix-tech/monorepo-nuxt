<template>
  <Primitive :as="as" :class="twMerge(defaultClass, props.class as string)">
    <p
      v-if="!!props.error?.statusCode || !!slots.statusCode"
      :class="twMerge(defaultStatusCodeClass, props.statusCodeClass as string)"
    >
      <slot name="statusCode">
        {{ props.error?.statusCode }}
      </slot>
    </p>
    <h1
      v-if="!!props.error?.statusMessage || !!slots.statusMessage"
      :class="
        twMerge(defaultStatusMessageClass, props.statusMessageClass as string)
      "
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
      :class="twMerge(defaultMessageClass, props.messageClass as string)"
    >
      <slot name="message">
        {{ props.error?.message }}
      </slot>
    </p>
    <div
      v-if="!!clear || !!slots.links"
      :class="twMerge(defaultLinksClass, props.linksClass as string)"
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

<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import type { ButtonProps } from "@nuxt/ui";
import type { NuxtError } from "#app";
import { twMerge } from "tailwind-merge";

export interface ErrorProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps["as"];
  error?: Partial<NuxtError & { message: string }>;
  /**
   * The URL to redirect to when the error is cleared.
   * @defaultValue '/'
   */
  redirect?: string;
  /**
   * Display a button to clear the error in the links slot.
   * `{ size: 'lg', color: 'primary', variant: 'solid', label: 'Back to home' }`{lang="ts-type"}
   * @defaultValue true
   */
  clear?: boolean | Partial<ButtonProps>;
  class?: unknown;
  statusCodeClass?: unknown;
  statusMessageClass?: unknown;
  messageClass?: unknown;
  linksClass?: unknown;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<ErrorProps>(), {
  as: "main",
  error: undefined,
  redirect: "/",
  clear: true,
  class: undefined,
  statusCodeClass: undefined,
  statusMessageClass: undefined,
  messageClass: undefined,
  linksClass: undefined,
});

const defaultClass =
  "min-h-dvh flex flex-col items-center justify-center text-center";
const defaultStatusCodeClass = "text-primary text-2xl font-semibold";
const defaultStatusMessageClass =
  "text-highlighted mt-2 text-3xl font-bold text-balance sm:text-4xl";
const defaultMessageClass = "text-muted mt-4 text-lg text-balance";
const defaultLinksClass = "mt-8 flex items-center justify-center gap-6";

const slots = defineSlots();

const { t } = useI18n();

const handleError = () => {
  clearError({ redirect: props.redirect });
};
</script>
