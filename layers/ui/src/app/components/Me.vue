<template>
  <Primitive
    :as="as"
    :data-orientation="orientation"
    :class="
      twMerge(
        defaultClass,
        orientation === 'horizontal' ? 'flex items-center' : 'flex flex-col',
        size === '3xs' && 'gap-1',
        size === '2xs' && 'gap-1.5',
        size === 'xs' && 'gap-1.5',
        size === 'sm' && 'gap-2',
        size === 'md' && 'gap-2',
        size === 'lg' && 'gap-2.5',
        size === 'xl' && 'gap-2.5',
        size === '2xl' && 'gap-3',
        size === '3xl' && 'gap-3',
        props.class as string,
      )
    "
    @click="onClick"
  >
    <slot name="avatar">
      <UChip
        v-if="chip && avatar"
        inset
        v-bind="typeof chip === 'object' ? chip : {}"
        :size="size"
      >
        <UAvatar
          :alt="name"
          v-bind="avatar"
          :size="size"
          :class="
            twMerge(
              defaultAvatarClass,
              to
                ? 'transform transition-transform duration-200 group-hover/user:scale-115'
                : '',
              props.avatarClass as string,
            )
          "
        />
      </UChip>
      <UAvatar
        v-else-if="avatar"
        :alt="name"
        v-bind="avatar"
        :size="size"
        :class="
          twMerge(
            defaultAvatarClass,
            to
              ? 'transform transition-transform duration-200 group-hover/user:scale-115'
              : '',
            props.avatarClass as string,
          )
        "
      />
    </slot>

    <div
      :class="
        twMerge(
          defaultWrapperClass,
          size === '3xs' && 'flex items-center gap-1',
          size === '2xs' && 'flex items-center gap-1.5',
          size === 'xs' && 'flex items-center gap-1.5',
          props.wrapperClass as string,
        )
      "
    >
      <ULink
        v-if="to"
        :aria-label="name"
        v-bind="{ to, target, ...$attrs }"
        class="peer focus:outline-none"
        tabindex="-1"
        raw
      >
        <span class="absolute inset-0" aria-hidden="true" />
      </ULink>

      <slot>
        <p
          v-if="name || !!slots.name"
          :class="
            twMerge(
              defaultNameClass,
              to
                ? 'text-default peer-hover:text-highlighted transition-colors'
                : 'text-highlighted',
              size === '3xs' && 'text-xs',
              size === '2xs' && 'text-xs',
              size === 'xs' && 'text-xs',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-sm',
              size === 'xl' && 'text-base',
              size === '2xl' && 'text-base',
              size === '3xl' && 'text-lg',
              props.nameClass as string,
            )
          "
        >
          <slot name="name">
            {{ name }}
          </slot>
        </p>
        <p
          v-if="description || !!slots.description"
          :class="
            twMerge(
              defaultDescriptionClass,
              to ? 'peer-hover:text-toned transition-colors' : '',
              size === '3xs' && 'text-xs',
              size === '2xs' && 'text-xs',
              size === 'xs' && 'text-xs',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-xs',
              size === 'lg' && 'text-sm',
              size === 'xl' && 'text-sm',
              size === '2xl' && 'text-base',
              size === '3xl' && 'text-base',
              props.descriptionClass as string,
            )
          "
        >
          <slot name="description">
            {{ description }}
          </slot>
        </p>
      </slot>
    </div>
  </Primitive>
</template>

<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import type { AvatarProps, ChipProps } from "@nuxt/ui";
import type {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
} from "vue-router";
import { twMerge } from "tailwind-merge";

export interface MeProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps["as"];
  name?: string;
  description?: string;
  avatar?: Omit<AvatarProps, "size">;
  chip?: boolean | Omit<ChipProps, "size" | "inset">;
  /**
   * @defaultValue 'md'
   */
  size?: "md" | "xs" | "sm" | "lg" | "xl" | "3xs" | "2xs" | "2xl" | "3xl";
  /**
   * The orientation of the user.
   * @defaultValue 'horizontal'
   */
  orientation?: "horizontal" | "vertical";
  to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
  target?: null | "_blank" | "_parent" | "_self" | "_top" | (string & {});
  onClick?: (event: MouseEvent) => void | Promise<void>;
  class?: unknown;
  wrapperClass?: unknown;
  nameClass?: unknown;
  descriptionClass?: unknown;
  avatarClass?: unknown;
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<MeProps>(), {
  as: "div",
  name: undefined,
  description: undefined,
  avatar: undefined,
  chip: undefined,
  size: "md",
  orientation: "horizontal",
  to: undefined,
  target: undefined,
  onClick: undefined,
  class: undefined,
  wrapperClass: undefined,
  nameClass: undefined,
  descriptionClass: undefined,
  avatarClass: undefined,
});

const defaultClass = "relative group/user";
const defaultWrapperClass = "";
const defaultNameClass = "font-medium";
const defaultDescriptionClass = "text-muted";
const defaultAvatarClass = "shrink-0";

const slots = defineSlots();
</script>
