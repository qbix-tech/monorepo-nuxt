<template>
  <PageCard container-class="p-4 sm:p-4" title-class="flex items-center gap-1">
    <div
      class="bg-muted dark:bg-muted/20 flex h-40 items-center justify-center gap-8 rounded-md"
    >
      <ColorModeButton />
      <ColorModeSelect />
      <ColorModeSwitch />
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-lg font-semibold"> Color Mode </span>
      <span class="text-muted text-sm">
        Color mode utility components to switch between light and dark modes.
      </span>
    </div>
  </PageCard>
</template>
