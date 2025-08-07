<template>
  <DefineButtonTemplate>
    <UButton
      :icon="icon || appConfig.ui.icons.search"
      :label="label || t('ui.dashboard.search.label.button')"
      :variant="variant || (collapsed ? 'ghost' : 'outline')"
      v-bind="{
        ...rootProps,
        ...(collapsed
          ? {
              square: true,
              label: void 0,
              'aria-label': label || t('ui.dashboard.search.label.button'),
            }
          : {}),
        ...$attrs,
      }"
      :class="twMerge(defaultClass, props.class as string)"
      :ui="ui"
      @click="toggleSearch"
    >
      <template v-for="(_, name) in proxySlots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

      <template v-if="!collapsed" #trailing>
        <div
          :class="twMerge(defaultTrailingClass, props.trailingClass as string)"
        >
          <slot name="trailing">
            <template v-if="kbds?.length">
              <UKbd
                v-for="(kbd, index) in kbds"
                :key="index"
                variant="subtle"
                v-bind="typeof kbd === 'string' ? { value: kbd } : kbd"
              />
            </template>
          </slot>
        </div>
      </template>
    </UButton>
  </DefineButtonTemplate>

  <UTooltip
    v-if="collapsed && tooltip"
    :text="label || t('ui.dashboard.search.label.button')"
    v-bind="tooltipProps as TooltipProps"
  >
    <ReuseButtonTemplate />
  </UTooltip>
  <ReuseButtonTemplate v-else />
</template>

<script lang="ts">
import type { ButtonProps, TooltipProps, KbdProps } from "@nuxt/ui";
import { useForwardProps } from "reka-ui";
import { defu } from "defu";
import { twMerge } from "tailwind-merge";

export interface DashboardSearchButtonProps {
  /**
   * The icon displayed in the button.
   * @defaultValue appConfig.ui.icons.search
   */
  icon?: string;
  /**
   * The label displayed in the button.
   * @defaultValue t('ui.dashboard.search.label.button')
   */
  label?: string;
  /**
   * The color of the button.
   * @defaultValue 'neutral'
   */
  color?: ButtonProps["color"];
  /**
   * The variant of the button.
   * Defaults to 'outline' when not collapsed, 'ghost' when collapsed.
   */
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  /**
   * Whether the button is collapsed.
   * @defaultValue false
   */
  collapsed?: boolean;
  /**
   * Display a tooltip on the button when is collapsed with the button label.
   * This has priority over the global `tooltip` prop.
   */
  tooltip?: boolean | TooltipProps;
  /**
   * The keyboard keys to display in the button.
   * `{ variant: 'subtle' }`{lang="ts-type"}
   * @defaultValue ['meta', 'k']
   */
  kbds?: (string | undefined)[] | KbdProps[];
  class?: unknown;
  trailingClass?: unknown;
  ui?: ButtonProps["ui"];
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const appConfig = useAppConfig();
const { t } = useI18n();

const props = withDefaults(defineProps<DashboardSearchButtonProps>(), {
  icon: undefined,
  label: undefined,
  color: "neutral",
  variant: undefined,
  size: undefined,
  collapse: false,
  tooltip: false,
  kbds: () => ["meta", "k"],
  class: undefined,
  trailingClass: undefined,
  ui: undefined,
});

const defaultClass = "";
const defaultTrailingClass = "hidden lg:flex items-center gap-0.5 ms-auto";

const slots = defineSlots();
const [DefineButtonTemplate, ReuseButtonTemplate] = createReusableTemplate();
const proxySlots = objectOmit(slots, ["trailing"]);
const rootProps = useForwardProps(reactivePick(props, "color", "size"));
const tooltipProps = toRef(() =>
  defu(typeof props.tooltip === "boolean" ? {} : props.tooltip, {
    delayDuration: 0,
    content: { side: "right" },
  }),
);

const { toggleSearch } = useDashboardContext({ toggleSearch: () => {} });
</script>
