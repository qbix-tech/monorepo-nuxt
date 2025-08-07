<template>
  <PageCard container-class="p-4 sm:p-4" title-class="flex items-center gap-1">
    <div class="dark:bg-muted/20 bg-muted h-40 rounded-md px-8 py-2">
      <CardAction
        v-bind="state"
        header-class="min-h-0"
        title-class="text-xs"
        :ui="{
          root: 'overflow-hidden',
          header: 'px-3 py-2 sm:px-3 sm:py-2',
          body: 'px-3 py-4 sm:px-3 sm:py-4 h-16',
          footer: 'px-3 py-2 sm:px-3 sm:py-2',
        }"
      >
        <template #body-loading>
          <LoadingSpinner min-height="0" size="2rem" />
        </template>
        <template #footer-loading>
          <div class="flex justify-end">
            <USkeleton class="h-6 w-11" />
          </div>
        </template>
        <template #title="{ currentStep }"> Step {{ currentStep }} </template>
        <template #body>
          <Placeholder class="h-8" />
        </template>
        <template #footer>
          <div class="flex justify-end">
            <UButton
              size="xs"
              label="Next"
              color="neutral"
              variant="solid"
              @click="next"
            />
          </div>
        </template>
      </CardAction>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-lg font-semibold"> Card Action </span>
      <span class="text-muted text-sm">
        Easily create actions within a card component, with virtually unlimited
        steps.
      </span>
    </div>
  </PageCard>
</template>

<script setup lang="ts">
const state = ref({
  currentStep: 1,
  close: false,
  transitionMode: "slide",
  loading: false,
});

const next = () => {
  state.value.loading = true;
  state.value.currentStep = state.value.currentStep + 1;
  setTimeout(() => {
    state.value.loading = false;
  }, 1000);
};

onMounted(() => {
  const interval = setInterval(() => {
    next();
  }, 3000);
  onBeforeMount(() => {
    clearInterval(interval);
  });
});
</script>
