<template>
  <PageCard container-class="p-4 sm:p-4" title-class="flex items-center gap-1">
    <div
      class="bg-muted dark:bg-muted/20 flex h-40 flex-col items-center justify-center gap-8 rounded-md"
    >
      <InputCurrency
        v-model="input"
        variant="soft"
        size="xl"
        :ui="{
          base: 'ps-14',
        }"
      >
        <template #leading> USD </template>
      </InputCurrency>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-lg font-semibold"> Currency Input </span>
      <span class="text-muted text-sm">
        A currency UInput-compatible component that resembles currency unit,
        with decimal and thousands separators.
      </span>
    </div>
  </PageCard>
</template>

<script setup lang="ts">
const input = ref<string | undefined>("");
</script>
