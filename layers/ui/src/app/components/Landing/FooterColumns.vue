<template>
  <Primitive :as="as" :class="twMerge(defaultClass, props.class as string)">
    <div
      v-if="!!slots.left"
      :class="twMerge(defaultLeftClass, props.leftClass as string)"
    >
      <slot name="left" />
    </div>

    <div
      v-if="!!slots.default || columns?.length"
      :class="twMerge(defaultCenterClass, props.centerClass as string)"
    >
      <slot>
        <div v-for="(column, index) in columns" :key="index">
          <h3 :class="twMerge(defaultLabelClass, props.labelClass as string)">
            <slot name="column-label" :column="column">
              {{ column.label }}
            </slot>
          </h3>

          <ul :class="twMerge(defaultListClass, props.listClass as string)">
            <li
              v-for="(link, linkIndex) in column.children"
              :key="linkIndex"
              :class="twMerge(defaultItemClass, props.itemClass as string)"
            >
              <ULink
                v-slot="{ active, ...slotProps }"
                v-bind="pickLinkProps(link)"
                custom
              >
                <ULinkBase
                  v-bind="slotProps"
                  :class="
                    twMerge(
                      defaultLinkClass,
                      active
                        ? 'text-primary font-medium'
                        : 'text-muted hover:text-default transition-colors',
                      props.linkClass as string,
                    )
                  "
                >
                  <slot name="link" :link="link" :active="active">
                    <slot name="link-leading" :link="link" :active="active">
                      <UIcon
                        v-if="link.icon"
                        :name="link.icon"
                        :class="
                          twMerge(
                            defaultLinkLeadingIconClass,
                            props.linkLeadingIconClass as string,
                          )
                        "
                      />
                    </slot>

                    <span
                      v-if="link.label || !!slots['link-label']"
                      :class="
                        twMerge(
                          defaultLinkLabelClass,
                          props.linkLabelClass as string,
                        )
                      "
                    >
                      <slot name="link-label" :link="link" :active="active">
                        {{ link.label }}
                      </slot>

                      <UIcon
                        v-if="link.target === '_blank'"
                        :name="appConfig.ui.icons.external"
                        :class="
                          twMerge(
                            defaultLinkLabelExternalIconClass,
                            props.linkLabelExternalIconClass as string,
                          )
                        "
                      />
                    </span>

                    <slot name="link-trailing" :link="link" :active="active" />
                  </slot>
                </ULinkBase>
              </ULink>
            </li>
          </ul>
        </div>
      </slot>
    </div>

    <div
      v-if="!!slots.right"
      :class="twMerge(defaultRightClass, props.rightClass as string)"
    >
      <slot name="right" />
    </div>
  </Primitive>
</template>

<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import type { LinkProps } from "@nuxt/ui";
import { twMerge } from "tailwind-merge";

export interface LandingFooterColumnLink extends Omit<LinkProps, "custom>"> {
  label: string;
  icon?: string;
  class?: unknown;
}

export interface LandingFooterColumn<
  T extends LandingFooterColumnLink = LandingFooterColumnLink,
> {
  label: string;
  children?: T[];
}

export interface LandingFooterColumnsProps<
  T extends LandingFooterColumnLink = LandingFooterColumnLink,
> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps["as"];
  columns?: LandingFooterColumn<T>[];
  class?: unknown;
  leftClass?: unknown;
  centerClass?: unknown;
  rightClass?: unknown;
  labelClass?: unknown;
  listClass?: unknown;
  itemClass?: unknown;
  linkClass?: unknown;
  linkLeadingIconClass?: unknown;
  linkLabelClass?: unknown;
  linkLabelExternalIconClass?: unknown;
}
</script>

<script setup lang="ts">
const appConfig = useAppConfig();

const props = withDefaults(defineProps<LandingFooterColumnsProps>(), {
  as: "nav",
  columns: () => [],
  class: undefined,
  leftClass: undefined,
  centerClass: undefined,
  rightClass: undefined,
  labelClass: undefined,
  listClass: undefined,
  itemClass: undefined,
  linkClass: undefined,
  linkLeadingIconClass: undefined,
  linkLabelClass: undefined,
  linkLabelExternalIconClass: undefined,
});

const defaultClass = "xl:grid xl:grid-cols-3 xl:gap-8";
const defaultLeftClass = "mb-10 xl:mb-0";
const defaultCenterClass =
  "flex flex-col lg:grid grid-flow-col auto-cols-fr gap-8 xl:col-span-2";
const defaultRightClass = "mt-10 xl:mt-0";
const defaultLabelClass = "text-sm font-semibold";
const defaultListClass = "mt-6 space-y-4";
const defaultItemClass = "relative";
const defaultLinkClass =
  "group text-sm flex items-center gap-1.5 focus-visible:outline-primary";
const defaultLinkLeadingIconClass = "size-5 shrink-0";
const defaultLinkLabelClass = "truncate";
const defaultLinkLabelExternalIconClass =
  "size-3 absolute top-0 text-dimmed inline-block";

const slots = defineSlots();

const pickLinkProps = (link: LandingFooterColumnLink) => {
  const keys = Object.keys(link);
  const ariaKeys = keys.filter((key) => key.startsWith("aria-"));
  const dataKeys = keys.filter((key) => key.startsWith("data-"));
  const propsToInclude = [
    "active",
    "activeClass",
    "ariaCurrentValue",
    "as",
    "disabled",
    "exact",
    "exactActiveClass",
    "exactHash",
    "exactQuery",
    "external",
    "href",
    "download",
    "inactiveClass",
    "noPrefetch",
    "noRel",
    "prefetch",
    "prefetchedClass",
    "rel",
    "replace",
    "target",
    "to",
    "type",
    "title",
    "onClick",
    ...ariaKeys,
    ...dataKeys,
  ];
  return reactivePick(
    link,
    ...(propsToInclude as (keyof LandingFooterColumnLink)[]),
  );
};
</script>
