<template>
  <UContainer class="max-w-2xl">
    <CardAction v-bind="state">
      <template #1-body>
        <Placeholder class="h-32" />
      </template>
      <template #1-footer>
        <div class="flex justify-end">
          <UButton label="Next" color="neutral" variant="solid" @click="next" />
        </div>
      </template>

      <template #2-body>
        <Placeholder class="h-32" />
      </template>
      <template #2-footer>
        <div class="flex justify-end">
          <UButton label="Next" color="neutral" variant="solid" @click="next" />
        </div>
      </template>
    </CardAction>
  </UContainer>
</template>

<script setup lang="ts">
const state = ref({
  title: "Example",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  currentStep: 1,
  loading: true,
  close: true,
  transitionMode: "slide",
});

const next = () => {
  let nextStep: number;
  if (state.value.currentStep < 2) {
    nextStep = state.value.currentStep + 1;
  } else {
    nextStep = 1;
  }
  state.value.currentStep = nextStep;
};

onMounted(() => {
  setTimeout(() => {
    state.value.loading = false;
  }, 1000);
});
</script>
