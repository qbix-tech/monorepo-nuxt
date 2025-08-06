<template>
  <UCard>
    <DefineContentTemplate>
      <div v-if="loading">
        <slot name="body-loading" v-bind="{ loading, currentStep }">
          <div class="space-y-4">
            <USkeleton class="h-6 w-full max-w-64" />
            <USkeleton class="h-6 w-full max-w-50" />
            <USkeleton class="h-6 w-full max-w-90" />
          </div>
        </slot>
      </div>

      <div v-else-if="transitioning">
        <slot name="transitioning" v-bind="{ loading, currentStep }" />
      </div>

      <div v-else-if="slots.body">
        <slot name="body" v-bind="{ loading, currentStep }" />
      </div>

      <div v-else>
        <template v-for="step in steps" :key="step">
          <template v-if="props.currentStep === step">
            <slot :name="`${step}-body`" v-bind="props" />
          </template>
        </template>
      </div>
    </DefineContentTemplate>

    <DefineFooterTemplate>
      <div v-if="loading">
        <slot name="footer-loading" v-bind="{ loading, currentStep }">
          <div class="space-y-4">
            <USkeleton class="h-6 w-full" />
          </div>
        </slot>
      </div>

      <div v-else-if="transitioning">
        <slot name="transitioning" v-bind="{ loading, currentStep }" />
      </div>

      <div v-else-if="slots.footer">
        <slot name="footer" v-bind="{ loading, currentStep }" />
      </div>

      <div v-else>
        <template v-for="step in steps" :key="step">
          <template v-if="props.currentStep === step">
            <slot :name="`${step}-footer`" v-bind="props" />
          </template>
        </template>
      </div>
    </DefineFooterTemplate>

    <template #header>
      <slot name="default-header" v-bind="props">
        <div :class="twMerge(defaultHeaderClass, props.headerClass as string)">
          <div>
            <div
              :class="twMerge(defaultTitleClass, props.titleClass as string)"
            >
              <slot
                name="title"
                v-bind="{ title, description, loading, close, currentStep }"
              >
                {{ title }}
              </slot>
            </div>
            <div
              :class="
                twMerge(
                  defaultDescriptionClass,
                  slots.title || title ? 'mt-1' : '',
                  props.descriptionClass as string,
                )
              "
            >
              <slot
                name="description"
                v-bind="{ title, description, loading, close, currentStep }"
              >
                {{ description }}
              </slot>
            </div>
          </div>
          <div v-if="close">
            <slot
              name="close"
              v-bind="{ title, description, loading, close, closeIcon }"
            >
              <UButton
                :icon="closeIcon || appConfig.ui.icons.close"
                color="neutral"
                variant="ghost"
                :aria-label="t('ui.cardAction.close')"
                v-bind="
                  typeof close === 'object'
                    ? (close as Partial<ButtonProps>)
                    : {}
                "
                :loading="loading"
                @click="emits('close')"
              />
            </slot>
          </div>
        </div>
      </slot>
    </template>

    <template v-if="transitionMode">
      <ContentTransition
        v-bind="
          typeof transition === 'object' ? transition : { mode: 'in-out' }
        "
      >
        <ReuseContentTemplate />
      </ContentTransition>
    </template>
    <template v-else>
      <ReuseContentTemplate />
    </template>

    <template
      v-if="
        !!slots.footer ||
        Object.keys(slots).some((slot) => /^[0-9]+-footer$/.test(slot))
      "
      #footer
    >
      <ReuseFooterTemplate />
    </template>
  </UCard>
</template>

<script lang="ts">
import type { ButtonProps } from "@nuxt/ui";
import type { TransitionFadeProps } from "../Transition/Fade.vue";
import type { TransitionSlideProps } from "../Transition/Slide.vue";
import { TransitionFade, TransitionSlide } from "#components";
import { twMerge } from "tailwind-merge";

type ContentTransitionProps<T> = T extends "fade"
  ? TransitionFadeProps
  : T extends "slide"
    ? TransitionSlideProps
    : never;

type ContentTransition<T> = T extends "fade"
  ? typeof TransitionFade
  : T extends "slide"
    ? typeof TransitionSlide
    : never;
</script>

<script setup lang="ts" generic="T extends 'fade' | 'slide'">
const { t } = useI18n();
const appConfig = useAppConfig();

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    currentStep?: number;
    loading?: boolean;
    close?: boolean | Partial<ButtonProps>;
    closeIcon?: string;
    transitionMode?: false | T;
    transition?: ContentTransitionProps<T>;
    headerClass?: unknown;
    titleClass?: unknown;
    descriptionClass?: unknown;
  }>(),
  {
    title: undefined,
    description: undefined,
    currentStep: undefined,
    loading: false,
    close: true,
    closeIcon: undefined,
    transitionMode: false,
    transition: undefined,
    headerClass: undefined,
    titleClass: undefined,
    descriptionClass: undefined,
  },
);

const defaultHeaderClass = "flex justify-between gap-1.5 min-h-12";
const defaultTitleClass = "text-highlighted font-semibold";
const defaultDescriptionClass = "text-muted text-sm";

const emits = defineEmits<{
  close: [];
}>();
const slots = useSlots();
const steps = computed(() =>
  Array.from(
    {
      length: props.currentStep ?? 0,
    },
    (_, i) => i + 1,
  ),
);

const [DefineContentTemplate, ReuseContentTemplate] = createReusableTemplate();
const [DefineFooterTemplate, ReuseFooterTemplate] = createReusableTemplate();

const ContentTransition = computed(
  () =>
    ({
      fade: TransitionFade,
      slide: TransitionSlide,
    })[props.transitionMode as T] as ContentTransition<T>,
);

const transitioning = ref(false);

watch(
  () => props.currentStep,
  () => {
    if (props.transitionMode) {
      transitioning.value = true;
      setTimeout(() => {
        transitioning.value = false;
      }, 1);
    }
  },
);
</script>
