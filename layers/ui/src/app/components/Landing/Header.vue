<template>
  <DefineToggleTemplate>
    <slot name="toggle" :open="open" :toggle="toggleOpen">
      <UButton
        color="neutral"
        variant="ghost"
        :aria-label="
          open ? t('ui.landing.header.close') : t('ui.landing.header.open')
        "
        :icon="open ? appConfig.ui.icons.close : props.menuIcon"
        :class="
          twMerge(
            defaultToggleClass,
            props.toggleClass as string,
            props.toggleSide === 'right' ? '-me-1.5' : '-ms-1.5',
          )
        "
        @click="toggleOpen"
      />
    </slot>
  </DefineToggleTemplate>

  <DefineLeftTemplate>
    <div :class="twMerge(defaultLeftClass, props.leftClass as string)">
      <ReuseToggleTemplate v-if="toggleSide === 'left'" />

      <slot name="left">
        <ULink
          :to="to"
          :aria-label="ariaLabel"
          :class="twMerge(defaultTitleClass, props.titleClass as string)"
        >
          <slot name="title">
            {{ title }}
          </slot>
        </ULink>
      </slot>
    </div>
  </DefineLeftTemplate>

  <DefineRightTemplate>
    <div :class="twMerge(defaultRightClass, props.rightClass as string)">
      <slot name="right" />

      <ReuseToggleTemplate v-if="toggleSide === 'right'" />
    </div>
  </DefineRightTemplate>

  <Primitive
    :as="as"
    v-bind="$attrs"
    :class="twMerge(defaultClass, props.class as string)"
  >
    <slot name="top" />

    <UContainer
      :class="twMerge(defaultContainerClass, props.containerClass as string)"
    >
      <ReuseLeftTemplate />

      <div class="hidden lg:flex">
        <slot />
      </div>

      <ReuseRightTemplate />
    </UContainer>

    <slot name="bottom" />
  </Primitive>

  <Menu
    v-model:open="open"
    v-bind="menuProps"
    :ui="{
      overlay: twMerge(defaultToggleClass, props.toggleClass as string),
      content: twMerge(defaultToggleClass, props.toggleClass as string),
    }"
  >
    <template #content>
      <slot name="content">
        <div
          v-if="mode !== 'drawer'"
          :class="
            twMerge(defaultMenuHeaderClass, props.menuHeaderClass as string)
          "
        >
          <ReuseLeftTemplate />

          <ReuseRightTemplate />
        </div>

        <div class="overflow-y-auto p-4 sm:p-6">
          <slot name="body" />
        </div>
      </slot>
    </template>
  </Menu>
</template>

<script setup lang="ts" generic="T extends 'modal' | 'slideover' | 'drawer'">
import { UDrawer, UModal, USlideover } from "#components";
import type { DrawerProps, ModalProps, SlideoverProps } from "@nuxt/ui";
import { defu } from "defu";
import { Primitive, type PrimitiveProps } from "reka-ui";
import { twMerge } from "tailwind-merge";

type HeaderMenu<T> = T extends "modal"
  ? ModalProps
  : T extends "slideover"
    ? SlideoverProps
    : T extends "drawer"
      ? DrawerProps
      : never;

defineOptions({ inheritAttrs: false });

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    as?: PrimitiveProps["as"];
    title?: string;
    to?: string;
    mode?: T;
    menu?: HeaderMenu<T>;
    menuIcon?: string;
    toggleSide?: "left" | "right";
    class?: unknown;
    containerClass?: unknown;
    toggleClass?: unknown;
    titleClass?: unknown;
    leftClass?: unknown;
    rightClass?: unknown;
    menuHeaderClass?: unknown;
  }>(),
  {
    as: "header",
    title: "Landing UI",
    to: "/",
    mode: "modal",
    menu: undefined,
    menuIcon: "lucide:menu",
    toggleSide: "right",
    class: undefined,
    containerClass: undefined,
    toggleClass: undefined,
    titleClass: undefined,
    leftClass: undefined,
    rightClass: undefined,
    menuHeaderClass: undefined,
  },
);

const slots = defineSlots();
const appConfig = useAppConfig();
const route = useRoute();

const [DefineLeftTemplate, ReuseLeftTemplate] = createReusableTemplate();
const [DefineRightTemplate, ReuseRightTemplate] = createReusableTemplate();
const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate();

const ariaLabel = computed(() => {
  const slotText = slots.title && getSlotChildrenText(slots.title());
  return (slotText || props.title).trim();
});

const open = defineModel("open", { type: Boolean, ...{ default: false } });

watch(
  () => route.fullPath,
  () => {
    open.value = false;
  },
);

const defaultClass =
  "bg-default/75 backdrop-blur border-b border-default sticky top-0 z-50 h-[--spacing(16)]";
const defaultContainerClass = "flex h-full items-center justify-between gap-3";
const defaultTitleClass =
  "shrink-0 font-bold text-xl text-highlighted flex items-end gap-1.5";
const defaultLeftClass = "lg:flex-1 flex items-center gap-1.5";
const defaultRightClass = "flex items-center justify-end lg:flex-1 gap-1.5";
const defaultToggleClass = "lg:hidden";
const defaultMenuHeaderClass =
  "px-4 sm:px-6 py-4 shrink-0 flex items-center justify-between gap-3 h-[--spacing(16)]";

const Menu = computed<HeaderMenu<T>>(
  () =>
    ({
      slideover: USlideover,
      modal: UModal,
      drawer: UDrawer,
    })[props.mode],
);
const menuProps = toRef(() =>
  defu(
    props.menu,
    {
      content: {
        onOpenAutoFocus: (e: Event) => e.preventDefault(),
      },
    },
    props.mode === "modal" ? { fullscreen: true, transition: false } : {},
  ),
);

const toggleOpen = () => {
  open.value = !open.value;
};
</script>
