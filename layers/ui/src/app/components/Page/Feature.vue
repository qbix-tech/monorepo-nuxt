<template>
  <Primitive
    :as="as"
    :data-orientation="orientation"
    :class="
      twMerge(
        defaultClass,
        orientation === 'horizontal' ? 'flex items-start gap-2.5' : '',
        props.class as string,
      )
    "
    @click="onClick"
  >
    <div
      v-if="icon || !!slots.leading"
      class="inline-flex items-center justify-center"
      :class="orientation === 'horizontal' ? 'p-0.5' : 'mb-2.5'"
    >
      <slot name="leading">
        <UIcon v-if="icon" :name="icon" class="text-primary size-5 shrink-0" />
      </slot>
    </div>

    <div>
      <ULink
        v-if="to"
        :aria-label="ariaLabel"
        v-bind="{ to, target, ...$attrs }"
        class="peer focus:outline-none"
        tabindex="-1"
        raw
      >
        <span class="absolute inset-0" aria-hidden="true" />
      </ULink>

      <slot>
        <div
          v-if="title || !!slots.title"
          :class="twMerge(defaultTitleClass, props.titleClass as string)"
        >
          <slot name="title">
            {{ title }}
          </slot>
        </div>

        <div
          v-if="description || !!slots.description"
          :class="
            twMerge(
              defaultDescriptionClass,
              slots.title || props.title ? 'mt-1' : '',
              props.descriptionClass as string,
            )
          "
        >
          <slot name="description">
            {{ description }}
          </slot>
        </div>
      </slot>
    </div>
  </Primitive>
</template>

<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import type {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
} from "vue-router";
import { twMerge } from "tailwind-merge";

export interface PageFeatureProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps["as"];
  /**
   * The icon displayed next to the title when `orientation` is `horizontal` and above the title when `orientation` is `vertical`.
   */
  icon?: string;
  title?: string;
  description?: string;
  /**
   * The orientation of the page feature.
   * @defaultValue 'horizontal'
   */
  orientation?: "horizontal" | "vertical";
  to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
  target?: null | "_blank" | "_parent" | "_self" | "_top" | (string & {});
  onClick?: (event: MouseEvent) => void;
  class?: unknown;
  titleClass?: unknown;
  descriptionClass?: unknown;
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PageFeatureProps>(), {
  as: "div",
  icon: undefined,
  title: undefined,
  description: undefined,
  orientation: "horizontal",
  to: undefined,
  target: undefined,
  onClick: undefined,
  class: undefined,
  titleClass: undefined,
  descriptionClass: undefined,
});

const slots = defineSlots();

const ariaLabel = computed(() => {
  const slotText = slots.title && getSlotChildrenText(slots.title());
  return (slotText || props.title || "Feature link").trim();
});

const defaultClass = "relative";
const defaultTitleClass =
  "text-base text-pretty font-semibold text-highlighted";
const defaultDescriptionClass = "text-[15px] text-pretty text-muted";
</script>
