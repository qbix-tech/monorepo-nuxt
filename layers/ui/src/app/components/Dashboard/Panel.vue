<template>
  <div
    :id="id"
    ref="el"
    v-bind="$attrs"
    :data-dragging="isDragging"
    :class="
      twMerge(
        defaultClass,
        defaultSize ? 'w-full lg:w-(--width)' : 'flex-1',
        props.class as string,
      )
    "
    :style="[size ? { '--width': `${size}${dashboardContext.unit}` } : void 0]"
  >
    <slot>
      <slot name="header" />

      <div :class="twMerge(defaultBodyClass, props.bodyClass as string)">
        <slot name="body" />
      </div>

      <slot name="footer" />
    </slot>
  </div>

  <slot
    name="resize-handle"
    :on-mouse-down="onMouseDown"
    :on-touch-start="onTouchStart"
    :on-double-click="onDoubleClick"
  >
    <DashboardResizeHandle
      v-if="resizable"
      :aria-controls="id"
      :class="twMerge(defaultHandleClass, props.handleClass as string)"
      @mousedown="onMouseDown"
      @touchstart="onTouchStart"
      @dblclick="onDoubleClick"
    />
  </slot>
</template>

<script lang="ts">
import { twMerge } from "tailwind-merge";

export interface DashboardPanelProps {
  /**
   * The id of the panel.
   *
   * @note It is recommended to set an id when using multiple panels in different pages to avoid conflicts.
   * @defaultValue `useId()`
   */
  id?: string;
  /**
   * The minimum size of the panel.
   * @defaultValue 15
   */
  minSize?: number;
  /**
   * The maximum size of the panel.
   * @defaultValue 100
   */
  maxSize?: number;
  /**
   * The default size of the panel.
   * If `0`, the panel will take up the remaining space.
   * @defaultValue 0
   */
  defaultSize?: number;
  /**
   * Whether to allow the user to resize the panel.
   * @defaultValue false
   */
  resizable?: boolean;
  class?: unknown;
  bodyClass?: unknown;
  handleClass?: unknown;
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DashboardPanelProps>(), {
  id: useId(),
  minSize: 15,
  maxSize: 100,
  defaultSize: 0,
  resizable: false,
  class: undefined,
  bodyClass: undefined,
  handleClass: undefined,
});

const defaultClass =
  "relative flex flex-col min-w-0 min-h-dvh lg:not-last:border-r lg:not-last:border-default shrink-0";
const defaultBodyClass =
  "flex flex-col gap-4 sm:gap-6 flex-1 overflow-y-auto p-4 sm:p-6";
const defaultHandleClass = "";

const dashboardContext = useDashboardContext({
  storageKey: "dashboard",
  unit: "%",
});
const id = `${dashboardContext.storageKey}-panel-${props.id || useId()}`;
const { el, size, isDragging, onMouseDown, onTouchStart, onDoubleClick } =
  useResizable(
    id,
    toRef(() => ({ ...dashboardContext, ...props })),
  );
</script>
