<template>
  <DefineToggleTemplate>
    <slot name="toggle" :open="open" :toggle="toggleOpen">
      <DashboardSidebarToggle
        v-if="toggle"
        v-bind="typeof toggle === 'object' ? toggle : {}"
        :side="toggleSide"
        :class="
          twMerge(
            defaultToggleClass,
            toggleSide === 'right' ? 'ms-auto' : '',
            props.toggleClass as string,
          )
        "
      />
    </slot>
  </DefineToggleTemplate>

  <DefineResizeHandleTemplate>
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
  </DefineResizeHandleTemplate>

  <ReuseResizeHandleTemplate v-if="side === 'right'" />

  <div
    :id="id"
    ref="el"
    v-bind="$attrs"
    :data-collapsed="isCollapsed"
    :data-dragging="isDragging"
    :class="
      twMerge(
        defaultClass,
        side === 'left' ? 'border-default border-r' : '',
        props.class as string,
      )
    "
    :style="{ '--width': `${size || 0}${dashboardContext.unit}` }"
  >
    <div
      v-if="!!slots.header"
      :class="twMerge(defaultHeaderClass, props.headerClass as string)"
    >
      <slot name="header" :collapsed="isCollapsed" :collapse="collapse" />
    </div>

    <div :class="twMerge(defaultBodyClass, props.bodyClass as string)">
      <slot :collapsed="isCollapsed" :collapse="collapse" />
    </div>

    <div
      v-if="!!slots.footer"
      :class="twMerge(defaultFooterClass, props.footerClass as string)"
    >
      <slot name="footer" :collapsed="isCollapsed" :collapse="collapse" />
    </div>
  </div>

  <ReuseResizeHandleTemplate v-if="side === 'left'" />

  <Menu
    v-model:open="open"
    :title="props.title"
    :description="props.description"
    v-bind="menuProps"
    :ui="{
      overlay: twMerge(defaultOverlayClass, props.overlayClass as string),
      content: twMerge(defaultContentClass, props.contentClass as string),
    }"
  >
    <template #content>
      <slot name="content">
        <div
          v-if="!!slots.header || mode !== 'drawer'"
          :class="
            twMerge(defaultHeaderClass, 'sm:px-6', props.headerClass as string)
          "
        >
          <ReuseToggleTemplate
            v-if="mode !== 'drawer' && toggleSide === 'left'"
          />

          <slot name="header" />

          <ReuseToggleTemplate
            v-if="mode !== 'drawer' && toggleSide === 'right'"
          />
        </div>

        <div
          :class="
            twMerge(defaultBodyClass, 'sm:px-6', props.bodyClass as string)
          "
        >
          <slot />
        </div>

        <div
          v-if="!!slots.footer"
          :class="
            twMerge(defaultFooterClass, 'sm:px-6', props.footerClass as string)
          "
        >
          <slot name="footer" />
        </div>
      </slot>
    </template>
  </Menu>
</template>

<script lang="ts">
import { defu } from "defu";
import type {
  SlideoverProps,
  ModalProps,
  DrawerProps,
  ButtonProps,
} from "@nuxt/ui";
import { USlideover, UModal, UDrawer } from "#components";
import { twMerge } from "tailwind-merge";

type DashboardSidebarMenu<T> = T extends "modal"
  ? ModalProps
  : T extends "slideover"
    ? SlideoverProps
    : T extends "drawer"
      ? DrawerProps
      : never;

export interface DashboardSidebarProps<
  T extends "slideover" | "modal" | "drawer",
> {
  title?: string;
  description?: string;
  /**
   * The mode of the sidebar menu.
   * @defaultValue 'modal'
   */
  mode?: T;
  /**
   * The props for the sidebar menu component.
   */
  menu?: DashboardSidebarMenu<T>;
  /**
   * Customize the toggle button to open the sidebar.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   * @defaultValue true
   */
  toggle?: boolean | Partial<ButtonProps>;
  /**
   * The side to render the toggle button on.
   * @defaultValue 'left'
   */
  toggleSide?: "left" | "right";
  /**
   * Whether to allow the user to collapse the panel.
   * @defaultValue false
   */
  collapsible?: boolean;
  /**
   * The id of the panel.
   * @defaultValue useId()
   */
  id?: string;
  /**
   * The side to render the panel on.
   * @defaultValue 'left'
   */
  side?: "left" | "right";
  /**
   * The minimum size of the panel.
   * @defaultValue 10
   */
  minSize?: number;
  /**
   * The maximum size of the panel.
   * @defaultValue 20
   */
  maxSize?: number;
  /**
   * The default size of the panel.
   * @defaultValue 15
   */
  defaultSize?: number;
  /**
   * Whether to allow the user to resize the panel.
   * @defaultValue false
   */
  resizable?: boolean;
  /**
   * The size of the panel when collapsed.
   * @defaultValue 0
   */
  collapsedSize?: number;
  class?: unknown;
  headerClass?: unknown;
  bodyClass?: unknown;
  footerClass?: unknown;
  contentClass?: unknown;
  overlayClass?: unknown;
  toggleClass?: unknown;
  handleClass?: unknown;
}
</script>

<script setup lang="ts" generic="T extends 'slideover' | 'modal' | 'drawer'">
defineOptions({ inheritAttrs: false });

const route = useRoute();

const props = withDefaults(defineProps<DashboardSidebarProps<T>>(), {
  title: undefined,
  description: undefined,
  mode: "modal",
  menu: undefined,
  toggle: true,
  toggleSide: "left",
  collapsible: false,
  id: useId(),
  side: "left",
  minSize: 10,
  maxSize: 20,
  defaultSize: 15,
  resizable: false,
  collapsedSize: 0,
  class: undefined,
  headerClass: undefined,
  bodyClass: undefined,
  footerClass: undefined,
  contentClass: undefined,
  overlayClass: undefined,
  toggleClass: undefined,
  handleClass: undefined,
});

const defaultClass =
  "relative hidden lg:flex flex-col min-h-dvh min-w-16 w-(--width) shrink-0";
const defaultHeaderClass =
  "h-[--spacing(16)] shrink-0 flex items-center gap-1.5 px-4";
const defaultBodyClass = "flex flex-col gap-4 flex-1 overflow-y-auto px-4 py-2";
const defaultFooterClass = "shrink-0 flex items-center gap-1.5 px-4 py-2";
const defaultContentClass = "lg:hidden";
const defaultOverlayClass = "lg:hidden";
const defaultToggleClass = "";
const defaultHandleClass = "";

const slots = defineSlots();

const open = defineModel<boolean>("open", { default: false });
const collapsed = defineModel<boolean>("collapsed", { default: false });

const dashboardContext = useDashboardContext({
  storageKey: "dashboard",
  unit: "%",
  sidebarOpen: ref(false),
  sidebarCollapsed: ref(false),
});
const id = `${dashboardContext.storageKey}-sidebar-${props.id || useId()}`;
const {
  el,
  size,
  collapse,
  isCollapsed,
  isDragging,
  onMouseDown,
  onTouchStart,
  onDoubleClick,
} = useResizable(
  id,
  toRef(() => ({ ...dashboardContext, ...props })),
  { collapsed },
);

const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate();
const [DefineResizeHandleTemplate, ReuseResizeHandleTemplate] =
  createReusableTemplate();

useRuntimeHook("dashboard:sidebar:toggle", () => {
  open.value = !open.value;
});
useRuntimeHook("dashboard:sidebar:collapse", (value) => {
  isCollapsed.value = value;
});

watch(open, () => (dashboardContext.sidebarOpen!.value = open.value), {
  immediate: true,
});
watch(
  isCollapsed,
  () => (dashboardContext.sidebarCollapsed!.value = isCollapsed.value),
  { immediate: true },
);
watch(
  () => route.fullPath,
  () => {
    open.value = false;
  },
);

const Menu = computed<DashboardSidebarMenu<T>>(
  () =>
    ({
      slideover: USlideover,
      modal: UModal,
      drawer: UDrawer,
    })[props.mode] as DashboardSidebarMenu<T>,
);
const menuProps = toRef(() =>
  defu(
    props.menu,
    {
      content: {
        onOpenAutoFocus: (e: Event) => e.preventDefault(),
      },
    },
    props.mode === "modal"
      ? { fullscreen: true, transition: false }
      : props.mode === "slideover"
        ? { side: "left" }
        : {},
  ),
);
const toggleOpen = () => {
  open.value = !open.value;
};
</script>
