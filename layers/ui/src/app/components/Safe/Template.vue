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

<script setup lang="ts" generic="T">
import type { FetchError } from "ofetch";
import type { AsyncDataRequestStatus } from "nuxt/app";

const { t } = useI18n();

const props = defineProps<{
  data?: T;
  error?: FetchError;
  status?: AsyncDataRequestStatus;
  preventLoading?: boolean;
  refresh?: () => void;
  loading?: boolean;
  retry?: () => void;
  mode?: "text" | "alert";
}>();

const onRetry = () => {
  if (props.retry) {
    props.retry();
  } else if (props.refresh) {
    props.refresh();
  }
};
</script>
