<template>
  <PageCard container-class="p-4 sm:p-4" title-class="flex items-center gap-1">
    <div
      class="dark:bg-muted/20 bg-muted flex h-40 items-center justify-center gap-2 rounded-md px-8 py-2"
    >
      <FlashInfo class="size-16" pulse />
      <FlashSuccess class="size-16" pulse />
      <FlashWarning class="size-16" pulse />
      <FlashError class="size-16" pulse />
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-lg font-semibold"> Flash Status </span>
      <span class="text-muted text-sm">
        Flash status component used to communicate the outcome of a critical
        user action – whether it's a triumphant success or a serious error.
      </span>
    </div>
  </PageCard>
</template>
