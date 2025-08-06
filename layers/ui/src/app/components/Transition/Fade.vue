<template>
  <Transition name="fade" :mode="mode">
    <slot />
  </Transition>
</template>

<script lang="ts">
import type { TransitionProps } from "vue";

export interface TransitionFadeProps {
  /**
   * Transition mode.
   * @defaultvalue "out-in"
   */
  mode?: TransitionProps["mode"];
  /**
   * Duration of the transition in seconds.
   * @defaultvalue 0.2
   */
  durationInSeconds?: number;
  /**
   * Unit for the initial distance of the fade transition.
   * @defaultvalue "rem"
   */
  distanceUnit?: "rem" | "px";
  /**
   * Initial distance of the fade transition. Positive values slide in from the bottom.
   * @defaultvalue 0.1
   */
  distance?: number;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<TransitionFadeProps>(), {
  mode: "out-in",
  durationInSeconds: 0.2,
  distanceUnit: "rem",
  distance: 0.3,
});

const duration = computed(() => {
  return `${props.durationInSeconds}s`;
});
const distance = computed(() => {
  return `${props.distance}${props.distanceUnit}`;
});
</script>

<style scope>
.fade-enter-active,
.fade-leave-active {
  transition: all v-bind("duration");
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(v-bind("distance"));
}
</style>
