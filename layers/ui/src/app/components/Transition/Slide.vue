<template>
  <Transition name="slide" :mode="mode">
    <slot />
  </Transition>
</template>

<script lang="ts">
import type { TransitionProps } from "vue";

export interface TransitionSlideProps {
  /**
   * Transition mode.
   * @defaultValue "out-in"
   */
  mode?: TransitionProps["mode"];
  /**
   * Duration of the transition in seconds.
   * @defaultValue 0.2
   */
  durationInSeconds?: number;
  /**
   * Unit for the initial distance of the slide transition.
   * @defaultValue "rem"
   */
  distanceUnit?: "rem" | "px";
  /**
   * Initial distance of the slide transition. Negative values slide in from the left.
   * @defaultValue -0.2
   */
  distance?: number;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<TransitionSlideProps>(), {
  mode: "out-in",
  durationInSeconds: 0.2,
  distanceUnit: "rem",
  distance: -0.5,
});

const duration = computed(() => {
  return `${props.durationInSeconds}s`;
});
const distance = computed(() => {
  return `${props.distance}${props.distanceUnit}`;
});
</script>

<style scope>
.slide-enter-active,
.slide-leave-active {
  transition: all v-bind("duration");
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(v-bind("distance"));
}
</style>
