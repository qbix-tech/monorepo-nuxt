<template>
  <template v-if="loading || (!preventLoading && status === 'pending')">
    <slot name="loading" v-bind="props">
      <LoadingSpinner />
    </slot>
  </template>

  <template v-else-if="status === 'error'">
    <slot name="error" v-bind="props">
      <template v-if="mode === 'text'">
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
  </template>

  <template v-else>
    <slot v-bind="{ data: data as NonNullable<T> }" />
  </template>
</template>

<script lang="ts">
import type { FetchError } from "ofetch";
import type { AsyncDataRequestStatus } from "nuxt/app";

export interface SafeTemplateProps<T> {
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
  mode?: "text" | "alert";
}
</script>

<script setup lang="ts" generic="T">
const { t } = useI18n();

const props = defineProps<SafeTemplateProps<T>>();

const onRetry = () => {
  if (props.retry) {
    props.retry();
  } else if (props.refresh) {
    props.refresh();
  }
};
</script>
