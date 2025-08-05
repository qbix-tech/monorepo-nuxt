<template>
  <UPopover :content="{ align: 'start' }" :modal="true">
    <UButton
      :color="color"
      :variant="variant"
      :icon="icon"
      :class="twMerge(defaultClass, props.class as string)"
      v-bind="
        objectOmit($attrs, [
          'color',
          'variant',
          'icon',
          'class',
          'trailingIcon',
          'formatStartDate',
          'formatEndDate',
          'ranges',
        ])
      "
    >
      <span class="truncate">
        <template v-if="model">
          {{ format(model, props.formatDate(locale), { locale: dateLocale }) }}
        </template>
        <template v-else> {{ t("ui.date.date.placeholder") }} </template>
      </span>

      <template #trailing>
        <UIcon
          :name="trailingIcon"
          class="text-dimmed size-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </template>
    </UButton>

    <template #content>
      <UCalendar v-model="selected" v-bind="calendar" />
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import type { ButtonProps, CalendarProps } from "@nuxt/ui";
import { format } from "date-fns";
import { enGB, ms, zhCN } from "date-fns/locale";
import { getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { twMerge } from "tailwind-merge";
import { getEndOfDay } from "#workspace/packages/utils/src/helpers/date";

defineOptions({ inheritAttrs: false });

const { locale, t } = useI18n();
const dateLocale = computed(() => {
  return locale.value === "en"
    ? enGB
    : locale.value === "ms"
      ? ms
      : locale.value === "zh"
        ? zhCN
        : enGB;
});

const props = withDefaults(
  defineProps<{
    color?: ButtonProps["color"];
    variant?: ButtonProps["variant"];
    icon?: string;
    trailingIcon?: string;
    class?: unknown;
    formatDate?: (locale: string) => string;
    endOfDay?: boolean;
    calendar?: CalendarProps<false, false>;
  }>(),
  {
    color: "neutral",
    variant: "ghost",
    icon: "lucide:calendar",
    trailingIcon: "lucide:chevron-down",
    class: undefined,
    formatDate: (locale: string) =>
      locale === "zh" ? "do MMM, yyy" : "d MMM, yyy",
    endOfDay: false,
    calendar: () => ({
      numberOfMonths: 2,
      class: "p-2",
    }),
  },
);

const defaultClass = "data-[state=open]:bg-elevated group";

const model = defineModel<Date>({ required: true });

const emits = defineEmits<{
  change: [newVal: Date, oldVal: Date];
}>();

const toCalendarDate = (date: Date) => {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
};

const selected = computed({
  get: () => toCalendarDate(model.value),
  set: (newValue: CalendarDate) => {
    if (props.endOfDay) {
      model.value = getEndOfDay(newValue.toDate(getLocalTimeZone()));
    } else {
      model.value = newValue.toDate(getLocalTimeZone());
    }
  },
});

watch(
  () => model.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      emits("change", newVal, oldVal);
    }
  },
);
</script>
