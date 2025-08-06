<template>
  <template v-if="loading || (!preventLoading && status === 'pending')">
    <slot name="loading" v-bind="props">
      <LoadingSpinner />
    </slot>
  </template>

  <template v-else-if="status === 'error'">
    <slot name="error" v-bind="props">
      <template v-if="mini">
        <div class="flex items-center justify-start gap-1.5">
          <span class="text-error text-xs text-pretty">
            <UIcon name="lucide:circle-alert" class="size-4 translate-y-0.5" />
            {{ t("ui.safeTemplate.error.description") }}
          </span>
          <UButton
            class="shrink-0"
            :label="t('ui.safeTemplate.error.retry')"
            icon="lucide:refresh-cw"
            color="neutral"
            variant="subtle"
            size="sm"
            @click="retry || refresh"
          />
        </div>
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
                    onClick: retry || refresh,
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
  mini?: boolean;
}>();
</script>
