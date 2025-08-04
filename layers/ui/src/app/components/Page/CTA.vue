<template>
  <Primitive
    :as="as"
    :data-orientation="orientation"
    :class="twMerge(defaultClass, props.class as string)"
  >
    <slot name="top" />

    <UContainer
      :class="
        twMerge(
          defaultContainerClass,
          orientation === 'horizontal' ? 'lg:grid-cols-2 lg:items-center' : '',
          variant === 'solid' ? 'bg-inverted text-inverted' : '',
          variant === 'outline' ? 'bg-default ring-default ring' : '',
          variant === 'soft' ? 'bg-elevated/50' : '',
          variant === 'subtle' ? 'bg-elevated/50 ring-default ring' : '',
          props.containerClass as string,
        )
      "
    >
      <div
        v-if="
          !!slots.header ||
          title ||
          !!slots.title ||
          description ||
          !!slots.description ||
          !!slots.body ||
          !!slots.footer ||
          links?.length ||
          !!slots.links
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
          v-if="
            !!slots.header ||
            title ||
            !!slots.title ||
            description ||
            !!slots.description
          "
          :class="twMerge(defaultHeaderClass, props.headerClass as string)"
        >
          <slot name="header">
            <h2
              v-if="title || !!slots.title"
              :class="
                twMerge(
                  defaultTitleClass,
                  orientation === 'horizontal' ? '' : 'text-center',
                  variant === 'solid' ? 'text-inverted' : '',
                  props.titleClass as string,
                )
              "
            >
              <slot name="title">
                {{ title }}
              </slot>
            </h2>

            <div
              v-if="description || !!slots.description"
              :class="
                twMerge(
                  defaultDescriptionClass,
                  orientation === 'horizontal'
                    ? 'text-pretty'
                    : 'text-center text-balance',
                  variant === 'solid' ? 'text-dimmed' : '',
                  variant === 'outline' ? 'text-muted' : '',
                  variant === 'soft' ? 'text-toned' : '',
                  variant === 'subtle' ? 'text-toned' : '',
                  variant === 'naked' ? 'text-muted' : '',
                  slots.title || props.title ? 'mt-6' : '',
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
          v-if="!!slots.body"
          :class="twMerge(defaultBodyClass, props.bodyClass as string)"
        >
          <slot name="body" />
        </div>

        <div
          v-if="!!slots.footer || links?.length || !!slots.links"
          :class="twMerge(defaultFooterClass, props.footerClass as string)"
        >
          <slot name="footer">
            <div
              v-if="links?.length || !!slots.links"
              :class="
                twMerge(
                  defaultLinksClass,
                  orientation === 'horizontal' ? '' : 'justify-center',
                  props.linksClass as string,
                )
              "
            >
              <slot name="links">
                <UButton
                  v-for="(link, index) in links"
                  :key="index"
                  size="lg"
                  v-bind="link"
                />
              </slot>
            </div>
          </slot>
        </div>
      </div>

      <slot v-if="!!slots.default" />
      <div v-else-if="orientation === 'horizontal'" class="hidden lg:block" />
    </UContainer>

    <slot name="bottom" />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import type { ButtonProps } from "@nuxt/ui";
import { twMerge } from "tailwind-merge";

const props = withDefaults(
  defineProps<{
    as?: PrimitiveProps["as"];
    title?: string;
    description?: string;
    orientation?: "horizontal" | "vertical";
    reverse?: boolean;
    variant?: "solid" | "outline" | "soft" | "subtle" | "naked";
    links?: ButtonProps[];
    class?: unknown;
    containerClass?: unknown;
    wrapperClass?: unknown;
    headerClass?: unknown;
    titleClass?: unknown;
    descriptionClass?: unknown;
    bodyClass?: unknown;
    footerClass?: unknown;
    linksClass?: unknown;
  }>(),
  {
    as: "div",
    title: "",
    description: "",
    orientation: "vertical",
    reverse: false,
    variant: "outline",
    links: undefined,
    class: undefined,
    containerClass: undefined,
    wrapperClass: undefined,
    headerClass: undefined,
    titleClass: undefined,
    descriptionClass: undefined,
    bodyClass: undefined,
    footerClass: undefined,
    linksClass: undefined,
  },
);

const slots = defineSlots();

const defaultClass = "relative isolate rounded-xl overflow-hidden";
const defaultContainerClass =
  "flex flex-col lg:grid px-6 py-12 sm:px-12 sm:py-24 lg:px-16 lg:py-24 gap-8 sm:gap-16";
const defaultWrapperClass = "";
const defaultHeaderClass = "";
const defaultTitleClass =
  "text-3xl sm:text-4xl text-pretty tracking-tight font-bold text-highlighted";
const defaultDescriptionClass = "text-base sm:text-lg text-muted";
const defaultBodyClass = "mt-8";
const defaultFooterClass = "mt-8";
const defaultLinksClass = "flex flex-wrap gap-x-6 gap-y-3";
</script>
