<template>
  <DefineTemplate>
    <template v-if="loading || (!preventLoading && status === 'pending')">
      <div :class="twMerge(defaultLoadingClass, props.loadingClass as string)">
        <slot name="loading" v-bind="props">
          <LoadingSpinner />
        </slot>
      </div>
    </template>

    <template v-else-if="status === 'error'">
      <div :class="twMerge(defaultErrorClass, props.errorClass as string)">
        <slot name="error" v-bind="props">
          <template v-if="errorMode === 'text'">
            <span class="text-error text-xs text-pretty">
              <UIcon name="lucide:circle-alert" class="size-4 translate-y-1" />
              {{ t("ui.safeTemplate.error.description") }}
              <UButton
                as="a"
                class="shrink-0 cursor-pointer underline"
                :label="t('ui.safeTemplate.error.retry')"
                color="neutral"
                variant="link"
                size="xs"
                @click="onRetry"
              />
            </span>
          </template>
          <template v-else>
            <UAlert
              :title="t('ui.safeTemplate.error.title')"
              :description="t('ui.safeTemplate.error.description')"
              color="error"
              variant="subtle"
              icon="lucide:circle-alert"
              :actions="
                retry || refresh
                  ? [
                      {
                        label: t('ui.safeTemplate.error.retry'),
                        icon: 'lucide:refresh-cw',
                        color: 'error',
                        variant: 'subtle',
                        size: 'sm',
                        onClick: onRetry,
                      },
                    ]
                  : []
              "
            />
          </template>
        </slot>
      </div>
    </template>

    <template v-else>
      <div :class="twMerge(defaultClass, props.class as string)">
        <slot v-bind="{ data: data as NonNullable<T> }" />
      </div>
    </template>
  </DefineTemplate>

  <template v-if="transitionMode">
    <TemplateTransition
      v-bind="typeof transition === 'object' ? transition : {}"
    >
      <ReuseTemplate />
    </TemplateTransition>
  </template>
  <template v-else>
    <ReuseTemplate />
  </template>
</template>

<script lang="ts">
import type { FetchError } from "ofetch";
import type { AsyncDataRequestStatus } from "nuxt/app";
import { TransitionFade, TransitionSlide } from "#components";
import type { TransitionFadeProps } from "../Transition/Fade.vue";
import type { TransitionSlideProps } from "../Transition/Slide.vue";
import { twMerge } from "tailwind-merge";

type TemplateTransition<T> = T extends "fade"
  ? typeof TransitionFade
  : T extends "slide"
    ? typeof TransitionSlide
    : never;

export interface SafeTemplateProps<
  T,
  U extends "text" | "alert" = "alert",
  V extends "fade" | "slide" | undefined = undefined,
> {
  /**
   * The data to be displayed when the request is successful.
   * This should be the data you obtain from `useFetch()`.
   */
  data: T;
  /**
   * The fetch error object if the request fails.
   * This should be the error object you obtain from `useFetch()`.
   */
  error: FetchError;
  /**
   * The status of the request.
   * This should be the status you obtain from `useFetch()`.
   */
  status: AsyncDataRequestStatus;
  /**
   * Whether to prevent the loading state from being displayed.
   * Useful if you want to prevent showing loading state on refresh or retry upon successful first fetch.
   */
  preventLoading?: boolean;
  /**
   * A function to call to refresh the data.
   * This should be the function you obtain from `useFetch()`.
   */
  refresh?: () => void;
  /**
   * Whether to show a loading spinner, regardless of the status.
   */
  loading?: boolean;
  /**
   * A function to call to retry the request. It has greater priority than `refresh`.
   */
  retry?: () => void;
  /**
   * On error, how to display the error.
   * @defaultValue 'alert'
   */
  errorMode?: U;
  /**
   * The mode of transition to use when displaying the template.
   */
  transitionMode?: V;
  /**
   * The transition properties to use when displaying the template.
   */
  transition?: V extends "fade"
    ? TransitionFadeProps
    : V extends "slide"
      ? TransitionSlideProps
      : never;
  class?: unknown;
  loadingClass?: unknown;
  errorClass?: unknown;
}
</script>

<script
  setup
  lang="ts"
  generic="
    T,
    U extends 'text' | 'alert' = 'alert',
    V extends 'fade' | 'slide' = 'fade'
  "
>
const { t } = useI18n();

const props = defineProps<SafeTemplateProps<T, U, V>>();

const defaultClass = "";
const defaultLoadingClass = "";
const defaultErrorClass = "";

const onRetry = () => {
  if (props.retry) {
    props.retry();
  } else if (props.refresh) {
    props.refresh();
  }
};

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const TemplateTransition = computed(
  () =>
    ({
      fade: TransitionFade,
      slide: TransitionSlide,
    })[props.transitionMode as V] as TemplateTransition<V>,
);
</script>
