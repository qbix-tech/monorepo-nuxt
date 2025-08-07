<template>
  <PageCard
    container-class="p-4 sm:p-4"
    title-class="flex items-center gap-1"
    class="overflow-hidden"
  >
    <div class="bg-muted dark:bg-muted/20 relative h-40 rounded-md">
      <LazyBackgroundBubbles :bubble-count="200" />
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-lg font-semibold"> Backgrounds </span>
      <span class="text-muted text-sm">
        A range of background components that can be used to create visually
        appealing sections in your application.
      </span>
    </div>
  </PageCard>
</template>
