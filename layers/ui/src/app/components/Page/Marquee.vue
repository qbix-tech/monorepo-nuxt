<template>
  <Primitive
    :as="as"
    :class="
      twMerge(
        defaultClass,
        overlay
          ? `before:from-default after:from-default before:pointer-events-none before:absolute before:z-2 before:to-transparent before:content-[''] after:pointer-events-none after:absolute after:z-2 after:to-transparent after:content-['']`
          : '',
        orientation === 'horizontal' ? 'flex-row' : '',
        orientation === 'horizontal' && overlay
          ? 'backface-hidden before:inset-y-0 before:left-0 before:h-full before:w-1/3 before:bg-gradient-to-r after:inset-y-0 after:right-0 after:h-full after:w-1/3 after:bg-gradient-to-l'
          : '',
        orientation === 'vertical' ? 'flex-col' : '',
        orientation === 'vertical' && overlay
          ? 'backface-hidden before:inset-x-0 before:top-0 before:h-1/3 before:w-full before:bg-gradient-to-b after:inset-x-0 after:bottom-0 after:h-1/3 after:w-full after:bg-gradient-to-t'
          : '',
        props.class as string,
      )
    "
  >
    <div
      v-for="i in repeat"
      :key="i"
      :class="
        twMerge(
          defaultContentClass,
          orientation === 'horizontal' ? 'w-full' : 'h-full',
          orientation === 'horizontal'
            ? 'animate-[marquee_var(--duration)_linear_infinite] flex-row backface-hidden rtl:animate-[marquee-rtl_var(--duration)_linear_infinite]'
            : '',
          orientation === 'vertical'
            ? 'h-[fit-content] animate-[marquee-vertical_var(--duration)_linear_infinite] flex-col backface-hidden rtl:animate-[marquee-vertical-rtl_var(--duration)_linear_infinite]'
            : '',
          pauseOnHover ? 'group-hover:[animation-play-state:paused]' : '',
          reverse ? '[animation-direction:reverse]' : '',
          props.contentClass as string,
        )
      "
    >
      <slot />
    </div>
  </Primitive>
</template>

<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import { twMerge } from "tailwind-merge";

export interface PageMarqueeProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps["as"];
  /**
   * Pause the marquee animation when hovered.
   * @defaultValue false
   */
  pauseOnHover?: boolean;
  /**
   * Reverse the marquee animation direction.
   * @defaultValue false
   */
  reverse?: boolean;
  /**
   * The orientation of the marquee.
   * @defaultValue 'horizontal'
   */
  orientation?: "horizontal" | "vertical";
  /**
   * The number of times the group of items should be duplicated.
   * @defaultValue 4
   */
  repeat?: number;
  /**
   * Display an overlay gradient on the marquee.
   * @defaultValue true
   */
  overlay?: boolean;
  class?: unknown;
  contentClass?: unknown;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<PageMarqueeProps>(), {
  as: "div",
  pauseOnHover: false,
  reverse: false,
  orientation: "horizontal",
  repeat: 4,
  overlay: true,
  class: undefined,
  contentClass: undefined,
});

const defaultClass =
  "group relative flex items-center overflow-hidden gap-(--gap) [--gap:--spacing(16)] [--duration:20s]";
const defaultContentClass =
  "flex items-center shrink-0 justify-around gap-(--gap) min-w-max";
</script>

<style>
@keyframes marquee {
  0% {
    transform: translateZ(0);
    will-change: transform;
  }
  to {
    transform: translate3d(calc(-100% - var(--gap)), 0, 0);
    will-change: transform;
  }
}
@keyframes marquee-rtl {
  0% {
    transform: translate3d(100%, 0, 0);
    will-change: transform;
  }
  to {
    transform: translate3d(
      calc(-100% * var(--repeat) - var(--gap) * var(--repeat)),
      0,
      0
    );
    will-change: transform;
  }
}
@keyframes marquee-vertical {
  0% {
    transform: translateZ(0);
    will-change: transform;
  }
  to {
    transform: translate3d(0, calc(-100% - var(--gap)), 0);
    will-change: transform;
  }
}
@keyframes marquee-vertical-rtl {
  0% {
    transform: translate3d(0, 100%, 0);
    will-change: transform;
  }
  to {
    transform: translate3d(
      0,
      calc(-100% * var(--repeat) - var(--gap) * var(--repeat)),
      0
    );
    will-change: transform;
  }
}
</style>
