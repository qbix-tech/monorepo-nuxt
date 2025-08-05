<template>
  <Primitive
    ref="cardRef"
    :as="as"
    :data-orientation="orientation"
    :class="
      twMerge(
        defaultClass,
        variant === 'solid' ? 'bg-inverted text-inverted' : '',
        variant === 'outline' ? 'bg-default ring-default ring' : '',
        variant === 'soft' ? 'bg-elevated/50' : '',
        variant === 'subtle' ? 'bg-elevated/50 ring-default ring' : '',
        to ? 'transition' : '',
        to && variant === 'solid' ? 'hover:bg-inverted/90' : '',
        to && variant === 'outline' ? 'hover:bg-elevated/50' : '',
        to && variant === 'soft' ? 'hover:bg-elevated' : '',
        to && variant === 'subtle' ? 'hover:bg-elevated' : '',
        to && variant === 'subtle' && !highlight ? 'hover:ring-accented' : '',
        to && variant === 'ghost' ? 'hover:bg-elevated/50' : '',
        highlight ? 'ring-2' : '',
        highlight && highlightColor === 'primary' ? 'ring-primary' : '',
        highlight && highlightColor === 'neutral' ? 'ring-inverted' : '',
        spotlight && spotlightColor === 'primary'
          ? '[--spotlight-color:var(--ui-primary)]'
          : '',
        spotlight && spotlightColor === 'secondary'
          ? '[--spotlight-color:var(--ui-secondary)]'
          : '',
        spotlight && spotlightColor === 'success'
          ? '[--spotlight-color:var(--ui-success)]'
          : '',
        spotlight && spotlightColor === 'info'
          ? '[--spotlight-color:var(--ui-info)]'
          : '',
        spotlight && spotlightColor === 'warning'
          ? '[--spotlight-color:var(--ui-warning)]'
          : '',
        spotlight && spotlightColor === 'error'
          ? '[--spotlight-color:var(--ui-error)]'
          : '',
        spotlight && spotlightColor === 'neutral'
          ? '[--spotlight-color:var(--ui-bg-inverted)]'
          : '',
        spotlight
          ? '[--spotlight-size:400px] before:pointer-events-none before:absolute before:-inset-px before:rounded-[inherit] before:bg-[radial-gradient(var(--spotlight-size)_var(--spotlight-size)_at_calc(var(--spotlight-x,0px))_calc(var(--spotlight-y,0px)),var(--spotlight-color),transparent_70%)]'
          : '',
        props.class as string,
      )
    "
    :style="
      spotlight && {
        '--spotlight-x': `${elementX}px`,
        '--spotlight-y': `${elementY}px`,
      }
    "
    @click="onClick"
  >
    <div
      v-if="props.spotlight"
      :class="twMerge(defaultSpotlightClass, props.spotlightClass as string)"
    />

    <div
      :class="
        twMerge(
          defaultContainerClass,
          orientation === 'horizontal' ? 'lg:grid-cols-2 lg:items-center' : '',
          variant === 'naked' ? 'p-0 sm:p-0' : '',
          props.containerClass as string,
        )
      "
    >
      <div
        v-if="
          !!slots.header ||
          icon ||
          !!slots.leading ||
          !!slots.body ||
          title ||
          !!slots.title ||
          description ||
          !!slots.description ||
          !!slots.footer
        "
        :class="
          twMerge(
            defaultWrapperClass,
            reverse ? 'lg:order-last' : '',
            props.wrapperClass as string,
          )
        "
      >
        <div
          v-if="!!slots.header"
          :class="twMerge(defaultHeaderClass, props.headerClass as string)"
        >
          <slot name="header" />
        </div>

        <div
          v-if="icon || !!slots.leading"
          :class="twMerge(defaultLeadingClass, props.leadingClass as string)"
        >
          <slot name="leading">
            <UIcon
              v-if="icon"
              :name="icon"
              :class="
                twMerge(
                  defaultLeadingIconClass,
                  props.leadingIconClass as string,
                )
              "
            />
          </slot>
        </div>

        <div
          v-if="
            !!slots.body ||
            title ||
            !!slots.title ||
            description ||
            !!slots.description
          "
          :class="twMerge(defaultBodyClass, props.bodyClass as string)"
        >
          <slot name="body">
            <div
              v-if="title || !!slots.title"
              :class="
                twMerge(
                  defaultTitleClass,
                  variant === 'solid' ? 'text-inverted' : '',
                  props.titleClass as string,
                )
              "
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
                  variant === 'solid' ? 'text-dimmed' : '',
                  variant === 'outline' ? 'text-muted' : '',
                  variant === 'soft' ? 'text-toned' : '',
                  variant === 'subtle' ? 'text-toned' : '',
                  variant === 'ghost' ? 'text-muted' : '',
                  variant === 'naked' ? 'text-muted' : '',
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

        <div
          v-if="!!slots.footer"
          :class="twMerge(defaultFooterClass, props.footerClass as string)"
        >
          <slot name="footer" />
        </div>
      </div>

      <slot />
    </div>

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
  </Primitive>
</template>

<script lang="ts" setup>
import { Primitive, type PrimitiveProps } from "reka-ui";
import type {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
} from "vue-router";
import { twMerge } from "tailwind-merge";
import { pausableFilter } from "@vueuse/core";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    as?: PrimitiveProps["as"];
    icon?: string;
    title?: string;
    description?: string;
    orientation?: "horizontal" | "vertical";
    reverse?: boolean;
    highlight?: boolean;
    highlightColor?:
      | "error"
      | "primary"
      | "secondary"
      | "success"
      | "info"
      | "warning"
      | "neutral";
    spotlight?: boolean;
    spotlightColor?:
      | "error"
      | "primary"
      | "secondary"
      | "success"
      | "info"
      | "warning"
      | "neutral";
    variant?: "solid" | "outline" | "soft" | "subtle" | "ghost" | "naked";
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    target?: null | "_blank" | "_parent" | "_self" | "_top" | (string & {});
    onClick?: (event: MouseEvent) => void;
    class?: unknown;
    spotlightClass?: unknown;
    containerClass?: unknown;
    wrapperClass?: unknown;
    headerClass?: unknown;
    bodyClass?: unknown;
    footerClass?: unknown;
    leadingClass?: unknown;
    leadingIconClass?: unknown;
    titleClass?: unknown;
    descriptionClass?: unknown;
  }>(),
  {
    as: "div",
    icon: undefined,
    title: undefined,
    description: undefined,
    orientation: "vertical",
    reverse: false,
    highlight: false,
    highlightColor: "primary",
    spotlight: false,
    spotlightColor: "primary",
    variant: "outline",
    to: undefined,
    target: null,
    onClick: undefined,
    class: undefined,
    spotlightClass: undefined,
    containerClass: undefined,
    wrapperClass: undefined,
    headerClass: undefined,
    bodyClass: undefined,
    footerClass: undefined,
    leadingClass: undefined,
    leadingIconClass: undefined,
    titleClass: undefined,
    descriptionClass: undefined,
  },
);

const slots = defineSlots();

const cardRef = useTemplateRef("cardRef");
const motionControl = pausableFilter();
const { elementX, elementY } = useMouseInElement(cardRef, {
  eventFilter: motionControl.eventFilter,
});
const spotlight = computed(
  () => props.spotlight && (elementX.value !== 0 || elementY.value !== 0),
);
watch(
  () => props.spotlight,
  (value) => {
    if (value) {
      motionControl.resume();
    } else {
      motionControl.pause();
    }
  },
  { immediate: true },
);

const ariaLabel = computed(() => {
  const slotText = slots.title && getSlotChildrenText(slots.title());
  return (slotText || props.title || "Card link").trim();
});

const defaultClass = "relative flex rounded-lg";
const defaultSpotlightClass =
  "absolute inset-0 rounded-[inherit] pointer-events-none bg-default/90";
const defaultContainerClass =
  "relative flex flex-col flex-1 lg:grid gap-x-8 gap-y-4 p-4 sm:p-6";
const defaultWrapperClass = "flex flex-col flex-1 items-start";
const defaultHeaderClass = "mb-4";
const defaultBodyClass = "flex-1";
const defaultFooterClass = "pt-4 mt-auto";
const defaultLeadingClass = "inline-flex items-center mb-2.5";
const defaultLeadingIconClass = "size-5 shrink-0 text-primary";
const defaultTitleClass =
  "text-base text-pretty font-semibold text-highlighted";
const defaultDescriptionClass = "text-[15px] text-pretty";
</script>
