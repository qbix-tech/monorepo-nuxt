<template>
  <PageCard container-class="p-4 sm:p-4" title-class="flex items-center gap-1">
    <div
      class="dark:bg-muted/20 bg-muted relative h-40 overflow-hidden rounded-md"
    >
      <ColorModeImage
        light="/images/light/chart.svg"
        dark="/images/dark/chart.svg"
      />
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-lg font-semibold"> Charts </span>
      <span class="text-muted text-sm">
        A collection of ready-to-use chart components that can be used to
        display data in a visual format.
      </span>
    </div>
  </PageCard>
</template>
