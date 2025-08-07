<template>
  <PageCard container-class="p-4 sm:p-4" title-class="flex items-center gap-1">
    <div
      class="dark:bg-muted/20 bg-muted flex h-40 items-center justify-center rounded-md px-8 py-2"
    >
      <TransitionFade :duration-in-seconds="0.3" mode="out-in">
        <FlashInfo v-if="count % 4 === 0" />
        <FlashSuccess v-else-if="count % 4 === 1" />
        <FlashWarning v-else-if="count % 4 === 2" />
        <FlashError v-else-if="count % 4 === 3" />
      </TransitionFade>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-lg font-semibold"> Easy Transitions </span>
      <span class="text-muted text-sm">
        Easily define transitions between components.
      </span>
    </div>
  </PageCard>
</template>

<script setup lang="ts">
const count = ref(1);

onMounted(() => {
  const interval = setInterval(() => {
    count.value = count.value + 1;
  }, 2000);
  onBeforeMount(() => {
    clearInterval(interval);
  });
});
</script>
