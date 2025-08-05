<template>
  <div>
    <PageCard
      title="Members"
      description="Invite new members by email address."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton label="Invite people" color="neutral" class="w-fit lg:ms-auto" />
    </PageCard>

    <PageCard
      variant="subtle"
      container-class="p-0 sm:p-0 gap-y-0"
      wrapper-class="items-stretch"
      header-class="p-4 mb-0 border-b border-default"
    >
      <template #header>
        <UInput
          v-model="q"
          icon="i-lucide-search"
          placeholder="Search members"
          autofocus
          class="w-full"
        />
      </template>

      <SettingsMembersList :members="filteredMembers" />
    </PageCard>
  </div>
</template>

<script setup lang="ts">
import type { Member } from "#shared/types";

const { data: members } = await useFetch<Member[]>("/api/members", {
  default: () => [],
});

const q = ref("");

const filteredMembers = computed(() => {
  return members.value.filter((member) => {
    return (
      member.name.search(new RegExp(q.value, "i")) !== -1 ||
      member.username.search(new RegExp(q.value, "i")) !== -1
    );
  });
});
</script>
