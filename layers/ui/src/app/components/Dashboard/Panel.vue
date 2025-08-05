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

<script setup lang="ts">
import { twMerge } from "tailwind-merge";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
    minSize?: number;
    maxSize?: number;
    defaultSize?: number;
    resizable?: boolean;
    class?: unknown;
    bodyClass?: unknown;
    handleClass?: unknown;
  }>(),
  {
    id: useId(),
    minSize: 15,
    maxSize: 100,
    defaultSize: 0,
    resizable: false,
    class: undefined,
    bodyClass: undefined,
    handleClass: undefined,
  },
);

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
