<template>
  <PageCard container-class="p-4 sm:p-4" title-class="flex items-center gap-1">
    <div
      class="dark:bg-muted/20 bg-muted relative h-40 overflow-hidden rounded-md"
    >
      <ImageLightbox
        src="https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=500&q=90"
        class="object-cover"
      />
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-lg font-semibold"> Lightbox </span>
      <span class="text-muted text-sm">
        A lightbox component that can be used to display images in a modal-like
        overlay.
      </span>
    </div>
  </PageCard>
</template>
