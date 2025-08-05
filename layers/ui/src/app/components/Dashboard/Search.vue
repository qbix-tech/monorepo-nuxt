<template>
  <UModal
    v-model:open="open"
    :title="props.title"
    :description="props.description"
    :class="twMerge(defaultModalClass, props.modalClass as string)"
  >
    <template #content>
      <slot name="content">
        <UCommandPalette
          ref="commandPaletteRef"
          v-model:search-term="searchTerm"
          v-bind="commandPaletteProps"
          :groups="groups"
          :fuse="fuse"
          :ui="{
            ...ui,
            input: twMerge(defaultInputClass, props.inputClass as string),
          }"
          @update:model-value="onSelect"
          @update:open="open = $event"
        >
          <template v-for="(_, name) in proxySlots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </UCommandPalette>
      </slot>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useForwardProps } from "reka-ui";
import type { UseFuseOptions } from "@vueuse/integrations";
import { defu } from "defu";
import { twMerge } from "tailwind-merge";

import type {
  ButtonProps,
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteProps,
} from "@nuxt/ui";

const { t } = useI18n();
const _colorMode = useColorMode();

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    icon?: string;
    placeholder?: string;
    autofocus?: boolean;
    loading?: boolean;
    loadingIcon?: string;
    close?: boolean | Partial<ButtonProps>;
    closeIcon?: string;
    shortcut?: string;
    groups?: CommandPaletteGroup<CommandPaletteItem>[];
    fuse?: UseFuseOptions<CommandPaletteItem>;
    colorMode?: boolean;
    systemIcon?: string;
    darkIcon?: string;
    lightIcon?: string;
    modalClass?: unknown;
    inputClass?: unknown;
    ui?: CommandPaletteProps["ui"];
  }>(),
  {
    title: undefined,
    description: undefined,
    icon: undefined,
    placeholder: undefined,
    autofocus: true,
    loading: undefined,
    loadingIcon: undefined,
    close: true,
    closeIcon: undefined,
    shortcut: "meta_k",
    groups: undefined,
    fuse: undefined,
    colorMode: true,
    systemIcon: "lucide:monitor",
    lightIcon: "lucide:sun",
    darkIcon: "lucide:moon",
    modalClass: undefined,
    inputClass: undefined,
    ui: undefined,
  },
);

const defaultModalClass = "sm:max-w-3xl sm:h-[28rem]";
const defaultInputClass = "[&>input]:text-base/5";

const slots = defineSlots();
const open = defineModel<boolean>("open", { default: false });
const searchTerm = defineModel<string>("searchTerm", { default: "" });

useRuntimeHook("dashboard:search:toggle", () => {
  open.value = !open.value;
});

const commandPaletteProps = useForwardProps(
  reactivePick(
    props,
    "icon",
    "placeholder",
    "autofocus",
    "loading",
    "loadingIcon",
    "close",
    "closeIcon",
  ),
);
const proxySlots = objectOmit(slots, ["content"]);
const fuse = computed(() =>
  defu({}, props.fuse, {
    fuseOptions: {},
  }),
);

const groups = computed(() => {
  const groups2 = [];
  groups2.push(...(props.groups || []));
  if (props.colorMode && !_colorMode?.forced) {
    groups2.push({
      id: "theme",
      label: t("ui.dashboard.search.label.theme"),
      items: [
        {
          label: t("ui.colorMode.system"),
          icon: props.systemIcon,
          active: _colorMode.preference === "system",
          onSelect: () => {
            _colorMode.preference = "system";
          },
        },
        {
          label: t("ui.colorMode.light"),
          icon: props.lightIcon,
          active: _colorMode.preference === "light",
          onSelect: () => {
            _colorMode.preference = "light";
          },
        },
        {
          label: t("ui.colorMode.dark"),
          icon: props.darkIcon,
          active: _colorMode.preference === "dark",
          onSelect: () => {
            _colorMode.preference = "dark";
          },
        },
      ],
    });
  }
  return groups2;
});

const onSelect = (item: CommandPaletteItem) => {
  if (item.disabled) {
    return;
  }
  open.value = false;
  searchTerm.value = "";
};

defineShortcuts({
  [props.shortcut]: {
    usingInput: true,
    handler: () => (open.value = !open.value),
  },
});

const commandPaletteRef = useTemplateRef("commandPaletteRef");
defineExpose({
  commandPaletteRef,
});
</script>
