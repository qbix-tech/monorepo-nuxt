<template>
  <BackgroundLampEffect
    class="text-primary absolute -top-px w-full shrink-0 transition-all"
    :class="[
      isLoading ? 'animate-pulse' : appear ? '' : 'opacity-0',
      appeared ? 'duration-[400ms]' : 'duration-1000',
    ]"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "landing",
});

const { isLoading } = useLoadingIndicator();
const appear = ref(false);
const appeared = ref(false);
onMounted(() => {
  setTimeout(() => {
    appear.value = true;
    setTimeout(() => {
      appeared.value = true;
    }, 1000);
  }, 0);
});
</script>
