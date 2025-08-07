<template>
  <DefineToggleTemplate>
    <slot name="toggle" v-bind="dashboardContext">
      <DashboardSidebarToggle
        v-if="toggle"
        v-bind="typeof toggle === 'object' ? toggle : {}"
        :side="toggleSide"
        :class="twMerge(defaultToggleClass, props.toggleClass as string)"
      />
    </slot>
  </DefineToggleTemplate>

  <Primitive
    :as="as"
    v-bind="$attrs"
    :class="twMerge(defaultClass, props.class as string)"
  >
    <div :class="twMerge(defaultLeftClass, props.leftClass as string)">
      <ReuseToggleTemplate v-if="toggleSide === 'left'" />

      <slot name="left" v-bind="dashboardContext">
        <slot name="leading" v-bind="dashboardContext">
          <UIcon
            v-if="icon"
            :name="icon"
            :class="twMerge(defaultIconClass, props.iconClass as string)"
          />
        </slot>

        <h1 :class="twMerge(defaultTitleClass, props.titleClass as string)">
          <slot name="title">
            {{ title }}
          </slot>
        </h1>

        <slot name="trailing" v-bind="dashboardContext" />
      </slot>
    </div>

    <div
      v-if="!!slots.default"
      :class="twMerge(defaultCenterClass, props.centerClass as string)"
    >
      <slot v-bind="dashboardContext" />
    </div>

    <div :class="twMerge(defaultRightClass, props.rightClass as string)">
      <slot name="right" v-bind="dashboardContext" />

      <ReuseToggleTemplate v-if="toggleSide === 'right'" />
    </div>
  </Primitive>
</template>

<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import type { ButtonProps } from "@nuxt/ui";
import { twMerge } from "tailwind-merge";

export interface DashboardNavbarProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps["as"];
  /**
   * The icon to display next to the title.
   */
  icon?: string;
  title?: string;
  /**
   * Whether to show the toggle button for the sidebar.
   * Can also be an object with button props.
   * @defaultValue true
   */
  toggle?: boolean | Partial<ButtonProps>;
  /**
   * The side where the toggle button should be displayed.
   * @defaultValue 'left'
   */
  toggleSide?: "left" | "right";
  class?: unknown;
  leftClass?: unknown;
  rightClass?: unknown;
  centerClass?: unknown;
  iconClass?: unknown;
  titleClass?: unknown;
  toggleClass?: unknown;
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DashboardNavbarProps>(), {
  as: "div",
  icon: undefined,
  title: undefined,
  toggle: true,
  toggleSide: "left",
  class: undefined,
  leftClass: undefined,
  rightClass: undefined,
  centerClass: undefined,
  iconClass: undefined,
  titleClass: undefined,
  toggleClass: undefined,
});

const defaultClass =
  "h-[--spacing(16)] shrink-0 flex items-center justify-between border-b border-default px-4 sm:px-6 gap-1.5";
const defaultLeftClass = "flex items-center gap-1.5 min-w-0";
const defaultRightClass = "flex items-center shrink-0 gap-1.5";
const defaultCenterClass = "hidden lg:flex";
const defaultIconClass = "shrink-0 size-5 self-center me-1.5";
const defaultTitleClass =
  "flex items-center gap-1.5 font-semibold text-highlighted truncate";
const defaultToggleClass = "";

const slots = defineSlots();
const dashboardContext = useDashboardContext({});

const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate();
</script>
