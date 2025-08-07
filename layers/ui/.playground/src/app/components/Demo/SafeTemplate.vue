<template>
  <PageCard container-class="p-4 sm:p-4" title-class="flex items-center gap-1">
    <div
      class="dark:bg-muted/20 bg-muted flex h-40 items-center justify-center gap-8 rounded-md p-12"
    >
      <SafeTemplate v-bind="{ data, status, error, refresh }" mode="text">
        <template #default="{ data: user }">
          <UCard>
            <Me
              :name="user.name"
              :description="'@' + user.username"
              :avatar="{
                src: user.avatar.src,
                alt: user.name,
              }"
            />
          </UCard>
        </template>
      </SafeTemplate>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-lg font-semibold"> Safe Template </span>
      <span class="text-muted text-sm">
        Easily handle type-safe bridge between asynchronous data fetching and
        contents.
      </span>
    </div>
  </PageCard>
</template>

<script setup lang="ts">
const responsePayload = {
  name: "Clayton Chew",
  username: "claytonchew",
  avatar: { src: "https://github.com/claytonchew.png" },
};

const { data, status, error, refresh } = useFetch<typeof responsePayload>(
  "/api/simulate",
  {
    method: "POST",
    query: {
      success_rate: 0.5,
      delay: 2000,
    },
    body: {
      response: responsePayload,
    },
    retry: false,
  },
);

onMounted(() => {
  const interval = setInterval(() => {
    refresh();
  }, 5000);
  onBeforeUnmount(() => {
    clearInterval(interval);
  });
});
</script>
