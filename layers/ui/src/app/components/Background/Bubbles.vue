<template>
  <div class="pointer-events-none absolute inset-x-0 inset-y-0 overflow-hidden">
    <div class="bubbles absolute inset-x-0 top-0 size-full">
      <div
        v-for="(layer, index) in bubbleLayers"
        :key="index"
        class="bubble-layer"
        :style="{
          '--bubble-duration': `${layer.duration}s`,
          '--bubble-opacity': layer.opacity,
          '--bubble-color': color,
        }"
      >
        <div
          v-for="(bubble, bubbleIndex) in layer.bubbles"
          :key="bubbleIndex"
          class="bubble absolute rounded-full"
          :style="{
            left: `${bubble.x}px`,
            top: `${bubble.y}px`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            backgroundColor: 'var(--bubble-color)',
            opacity: 'var(--bubble-opacity)',
            filter: 'blur(8px)',
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Bubble {
  x: number;
  y: number;
  size: number;
}

const props = withDefaults(
  defineProps<{
    bubbleCount?: number;
    color?: string;
    speed?: "slow" | "normal" | "fast";
    size?: { min: number; max: number };
  }>(),
  {
    bubbleCount: 60,
    color: "var(--ui-primary)",
    speed: "normal",
    size: () => ({
      min: 30,
      max: 200,
    }),
  },
);

// Generate random bubble positions and sizes
const generateStars = (count: number): Bubble[] => {
  return Array.from({ length: count }, () => ({
    x: Math.floor(Math.random() * 2000),
    y: Math.floor(Math.random() * 2000),
    size:
      typeof props.size === "number"
        ? props.size
        : Math.random() * (props.size.max - props.size.min) + props.size.min,
  }));
};

// Define speed configurations once
const speedMap = {
  slow: { duration: 200, opacity: 0.5, ratio: 0.3 },
  normal: { duration: 150, opacity: 0.75, ratio: 0.3 },
  fast: { duration: 100, opacity: 1, ratio: 0.4 },
};

// Use a more efficient approach to generate and store bubbles
const bubbles = useState<{ slow: Bubble[]; normal: Bubble[]; fast: Bubble[] }>(
  "bubbles",
  () => {
    return {
      slow: generateStars(Math.floor(props.bubbleCount * speedMap.slow.ratio)),
      normal: generateStars(
        Math.floor(props.bubbleCount * speedMap.normal.ratio),
      ),
      fast: generateStars(Math.floor(props.bubbleCount * speedMap.fast.ratio)),
    };
  },
);

// Compute bubble layers with different speeds and opacities
const bubbleLayers = computed(() => [
  { bubbles: bubbles.value.fast, ...speedMap.fast },
  { bubbles: bubbles.value.normal, ...speedMap.normal },
  { bubbles: bubbles.value.slow, ...speedMap.slow },
]);
</script>

<style scoped>
.bubbles {
  left: 50%;
  transform: translate(-50%);
  -webkit-mask-image: linear-gradient(
    180deg,
    rgba(217, 217, 217, 0) 0%,
    rgba(217, 217, 217, 0.8) 25%,
    #d9d9d9 50%,
    rgba(217, 217, 217, 0.8) 75%,
    rgba(217, 217, 217, 0) 100%
  );
  mask-image: linear-gradient(
    180deg,
    rgba(217, 217, 217, 0) 0%,
    rgba(217, 217, 217, 0.8) 25%,
    #d9d9d9 50%,
    rgba(217, 217, 217, 0.8) 75%,
    rgba(217, 217, 217, 0) 100%
  );
  -webkit-mask-size: cover;
  mask-size: cover;
}

.bubble-layer {
  animation: risingStarsAnimation linear infinite;
  animation-duration: var(--bubble-duration);
  will-change: transform;
}

@keyframes risingStarsAnimation {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-2000px);
  }
}
</style>
