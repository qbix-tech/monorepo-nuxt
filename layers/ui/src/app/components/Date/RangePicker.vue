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
        <template v-if="model.start">
          <template v-if="model.end">
            {{
              format(model.start, props.formatStartDate(locale), {
                locale: dateLocale,
              })
            }}
            -
            {{
              format(model.end, props.formatEndDate(locale), {
                locale: dateLocale,
              })
            }}
          </template>
          <template v-else>
            {{
              format(model.start, props.formatStartDate(locale), {
                locale: dateLocale,
              })
            }}
          </template>
        </template>
        <template v-else> {{ t("ui.date.range.placeholder") }} </template>
      </span>

      <template #trailing>
        <UIcon
          :name="trailingIcon"
          class="text-dimmed size-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </template>
    </UButton>

    <template #content>
      <div class="divide-default flex items-stretch sm:divide-x">
        <div class="hidden flex-col justify-center sm:flex">
          <UButton
            v-for="(range, index) in ranges"
            :key="index"
            :label="range.label"
            color="neutral"
            variant="ghost"
            class="rounded-none px-4"
            :class="[
              isRangeSelected(range) ? 'bg-elevated' : 'hover:bg-elevated/50',
            ]"
            truncate
            @click="selectRange(range)"
          />
        </div>

        <UCalendar v-model="calendarRange" v-bind="calendar" />
      </div>
    </template>
  </UPopover>
</template>

<script lang="ts">
import type { ButtonProps, CalendarProps } from "@nuxt/ui";
import { sub, format, isSameDay, type Duration } from "date-fns";
import { enGB, ms, zhCN } from "date-fns/locale";
import { getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { twMerge } from "tailwind-merge";

type DateRange = {
  label: string;
  duration?: Duration;
  custom?: { start: (date: Date) => Date; end: (date: Date) => Date };
};

export interface DateRangePickerProps {
  /**
   * @defaultValue 'neutral'
   */
  color?: ButtonProps["color"];
  /**
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps["variant"];
  /**
   * The icon to display in the leading slot in the button.
   * @defaultValue 'lucide:calendar'
   */
  icon?: string;
  /**
   * The icon to display in the trailing slot in the button.
   * @defaultValue 'lucide:chevron-down'
   */
  trailingIcon?: string;
  class?: unknown;
  /**
   * The format to display the start date in the button.
   * @param locale The locale to use for formatting the date.
   * @defaultValue 'd MMM, yyy' for en, 'do MMM, yyy' for zh
   */
  formatStartDate?: (locale: string) => string;
  /**
   * The format to display the end date in the button.
   * @defaultValue 'd MMM, yyy' for en, 'do MMM, yyy' for zh
   * @param locale The locale to use for formatting the date.
   */
  formatEndDate?: (locale: string) => string;
  /**
   * Customise the ranges available for selection.
   */
  ranges?: DateRange[];
  /**
   * Customise the calendar component.
   */
  calendar?: CalendarProps<true, false>;
}
</script>

<script setup lang="ts">
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

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  color: "neutral",
  variant: "ghost",
  icon: "lucide:calendar",
  trailingIcon: "lucide:chevron-down",
  class: undefined,
  formatStartDate: (locale: string) =>
    locale === "zh" ? "do MMM, yyy" : "d MMM, yyy",
  formatEndDate: (locale: string) =>
    locale === "zh" ? "do MMM, yyy" : "d MMM, yyy",
  ranges: () => [
    { label: "Last 7 days", duration: { days: 7 } },
    { label: "Last 14 days", duration: { days: 14 } },
    { label: "Last 30 days", duration: { days: 30 } },
    { label: "Last month", duration: { months: 1 } },
    { label: "Last 3 months", duration: { months: 3 } },
    { label: "Last 6 months", duration: { months: 6 } },
    { label: "Last year", duration: { years: 1 } },
  ],
  calendar: () => ({
    numberOfMonths: 2,
    class: "p-2",
    range: true,
  }),
});

const defaultClass = "data-[state=open]:bg-elevated group";

const model = defineModel<{
  start: Date;
  end: Date;
}>({ required: true });

const emits = defineEmits<{
  change: [
    newVal: { start: Date; end: Date },
    oldVal: { start: Date; end: Date },
  ];
}>();

const toCalendarDate = (date: Date) => {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
};

const calendarRange = computed({
  get: () => ({
    start: model.value.start ? toCalendarDate(model.value.start) : undefined,
    end: model.value.end ? toCalendarDate(model.value.end) : undefined,
  }),
  set: (newValue: { start: CalendarDate | null; end: CalendarDate | null }) => {
    model.value = {
      start: newValue.start
        ? newValue.start.toDate(getLocalTimeZone())
        : new Date(),
      end: newValue.end ? newValue.end.toDate(getLocalTimeZone()) : new Date(),
    };
  },
});

const isRangeSelected = (range: DateRange) => {
  if (!model.value.start || !model.value.end) return false;
  if (range.custom) {
    return (
      isSameDay(model.value.start, range.custom.start(new Date())) &&
      isSameDay(model.value.end, range.custom.end(new Date()))
    );
  }
  if (range.duration) {
    return (
      isSameDay(model.value.start, sub(new Date(), range.duration)) &&
      isSameDay(model.value.end, new Date())
    );
  }
  return false;
};

const selectRange = (range: DateRange) => {
  if (range.custom) {
    model.value = {
      start: range.custom.start(new Date()),
      end: range.custom.end(new Date()),
    };
    return;
  }
  if (range.duration) {
    model.value = {
      start: sub(new Date(), range.duration),
      end: new Date(),
    };
    return;
  }
};

watch(
  () => model.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      emits("change", newVal, oldVal);
    }
  },
);

defineExpose({
  selectRange,
});
</script>
