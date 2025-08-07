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
          headline ||
          !!slots.headline ||
          title ||
          !!slots.title ||
          description ||
          !!slots.description ||
          !!slots.body ||
          !!slots.footer ||
          links?.length ||
          !!slots.links
        "
        :class="{
          'text-center': orientation === 'vertical',
          'order-last': reverse,
        }"
      >
        <div
          v-if="
            !!slots.header ||
            headline ||
            !!slots.headline ||
            title ||
            !!slots.title ||
            description ||
            !!slots.description
          "
        >
          <slot name="header">
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

            <h1
              v-if="title || !!slots.title"
              :class="twMerge(defaultTitleClass, props.titleClass as string)"
            >
              <slot name="title">
                {{ title }}
              </slot>
            </h1>

            <div
              v-if="description || !!slots.description"
              :class="
                twMerge(
                  defaultDescriptionClass,
                  orientation === 'horizontal' ? 'text-pretty' : 'text-balance',
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
                  size="xl"
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

<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import type { ButtonProps } from "@nuxt/ui";
import { twMerge } from "tailwind-merge";

export interface PageHeroProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps["as"];
  /**
   * The headline displayed above the title.
   */
  headline?: string;
  title?: string;
  description?: string;
  /**
   * Display a list of Button under the description.
   * `{ size: 'xl' }`{lang="ts-type"}
   */
  links?: ButtonProps[];
  /**
   * The orientation of the page hero.
   * @defaultValue 'vertical'
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Reverse the order of the default slot.
   * @defaultValue false
   */
  reverse?: boolean;
  class?: unknown;
  containerClass?: unknown;
  headlineClass?: unknown;
  titleClass?: unknown;
  descriptionClass?: unknown;
  linksClass?: unknown;
  bodyClass?: unknown;
  footerClass?: unknown;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<PageHeroProps>(), {
  as: "div",
  headline: undefined,
  title: undefined,
  description: undefined,
  links: undefined,
  orientation: "vertical",
  reverse: false,
  class: undefined,
  containerClass: undefined,
  headlineClass: undefined,
  titleClass: undefined,
  descriptionClass: undefined,
  linksClass: undefined,
  bodyClass: undefined,
  footerClass: undefined,
});

const slots = defineSlots();

const defaultClass = "relative isolate";
const defaultContainerClass =
  "flex flex-col lg:grid py-24 sm:py-32 lg:py-40 gap-16 sm:gap-y-24";
const defaultHeadlineClass = "mb-4";
const defaultTitleClass =
  "text-5xl sm:text-7xl text-pretty tracking-tight font-bold text-highlighted";
const defaultDescriptionClass = "text-lg sm:text-xl/8 text-muted";
const defaultLinksClass = "flex flex-wrap gap-x-6 gap-y-3";
const defaultBodyClass = "mt-10";
const defaultFooterClass = "mt-10";
</script>
