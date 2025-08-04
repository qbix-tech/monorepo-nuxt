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
          props.containerClass as string,
        )
      "
    >
      <div
        v-if="
          !!slots.header ||
          icon ||
          !!slots.leading ||
          headline ||
          !!slots.headline ||
          title ||
          !!slots.title ||
          description ||
          !!slots.description ||
          !!slots.body ||
          features?.length ||
          !!slots.features ||
          !!slots.footer ||
          links?.length ||
          !!slots.links
        "
        :class="{ 'lg:order-last': reverse }"
      >
        <div
          v-if="
            !!slots.header ||
            icon ||
            !!slots.leading ||
            headline ||
            !!slots.headline ||
            title ||
            !!slots.title ||
            description ||
            !!slots.description
          "
          :class="twMerge(defaultHeaderClass, props.headerClass as string)"
        >
          <slot name="header">
            <div
              v-if="icon || !!slots.leading"
              :class="
                twMerge(
                  defaultLeadingClass,
                  orientation === 'horizontal' ? '' : 'justify-center',
                  props.leadingClass as string,
                )
              "
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
              v-if="headline || !!slots.headline"
              :class="
                twMerge(
                  defaultHeadlineClass,
                  orientation === 'horizontal' ? '' : 'justify-center',
                  props.headlineClass as string,
                )
              "
            >
              <slot name="headline">
                {{ headline }}
              </slot>
            </div>

            <h2
              v-if="title || !!slots.title"
              :class="
                twMerge(
                  defaultTitleClass,
                  orientation === 'horizontal' ? '' : 'text-center',
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
                  slots.title || props.title ? 'mt-6' : '',
                  orientation === 'horizontal'
                    ? 'text-pretty'
                    : 'text-center text-balance',
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
          v-if="!!slots.body || features?.length || !!slots.features"
          :class="
            twMerge(
              defaultBodyClass,
              orientation === 'horizontal'
                ? 'gap-4'
                : 'gap-8 sm:grid-cols-2 lg:grid-cols-3',
              orientation === 'vertical' &&
                (slots.title ||
                  props.title ||
                  slots.description ||
                  props.description ||
                  slots.body)
                ? 'mt-16'
                : '',
              props.bodyClass as string,
            )
          "
        >
          <slot name="body">
            <ul
              v-if="features?.length || !!slots.features"
              :class="
                twMerge(
                  defaultFeaturesClass,
                  orientation === 'horizontal'
                    ? ''
                    : 'gap-8 sm:grid-cols-2 lg:grid-cols-3',
                  props.featuresClass as string,
                )
              "
            >
              <slot name="features">
                <PageFeature
                  v-for="(feature, index) in features"
                  :key="index"
                  as="li"
                  v-bind="feature"
                />
              </slot>
            </ul>
          </slot>
        </div>

        <div
          v-if="!!slots.footer || links?.length || !!slots.links"
          :class="
            twMerge(
              defaultFooterClass,
              orientation === 'horizontal' ? '' : 'justify-center',
              props.footerClass as string,
            )
          "
        >
          <slot name="footer">
            <div
              v-if="links?.length || !!slots.links"
              :class="twMerge(defaultLinksClass, props.linksClass as string)"
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
import type PageFeature from "./Feature.vue";
import { twMerge } from "tailwind-merge";

const props = withDefaults(
  defineProps<{
    as?: PrimitiveProps["as"];
    headline?: string;
    icon?: string;
    title?: string;
    description?: string;
    links?: ButtonProps[];
    features?: InstanceType<typeof PageFeature>["$props"][];
    orientation?: "horizontal" | "vertical";
    reverse?: boolean;
    class?: unknown;
    containerClass?: unknown;
    headerClass?: unknown;
    leadingClass?: unknown;
    leadingIconClass?: unknown;
    headlineClass?: unknown;
    titleClass?: unknown;
    descriptionClass?: unknown;
    linksClass?: unknown;
    featuresClass?: unknown;
    bodyClass?: unknown;
    footerClass?: unknown;
  }>(),
  {
    as: "div",
    headline: undefined,
    icon: undefined,
    title: undefined,
    description: undefined,
    links: undefined,
    features: undefined,
    orientation: "vertical",
    reverse: false,
    class: undefined,
    containerClass: undefined,
    headerClass: undefined,
    leadingClass: undefined,
    leadingIconClass: undefined,
    headlineClass: undefined,
    titleClass: undefined,
    descriptionClass: undefined,
    linksClass: undefined,
    featuresClass: undefined,
    bodyClass: undefined,
    footerClass: undefined,
  },
);

const slots = defineSlots();

const defaultClass = "relative isolate";
const defaultContainerClass =
  "flex flex-col lg:grid py-24 sm:py-32 lg:py-40 gap-16 sm:gap-y-24";
const defaultHeaderClass = "";
const defaultLeadingClass = "flex items-center mb-6";
const defaultLeadingIconClass = "size-10 shrink-0 text-primary";
const defaultHeadlineClass =
  "mb-3 font-semibold text-primary flex items-center gap-1.5";
const defaultTitleClass =
  "text-3xl sm:text-4xl lg:text-5xl text-pretty tracking-tight font-bold text-highlighted";
const defaultDescriptionClass = "text-base sm:text-lg text-muted";
const defaultLinksClass = "flex flex-wrap gap-x-6 gap-y-3";
const defaultFeaturesClass = "grid";
const defaultBodyClass = "mt-8";
const defaultFooterClass = "mt-8";
</script>
