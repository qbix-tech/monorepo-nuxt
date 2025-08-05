<template>
  <ul role="list" class="divide-default divide-y">
    <li
      v-for="(member, index) in members"
      :key="index"
      class="flex items-center justify-between gap-3 px-4 py-3 sm:px-6"
    >
      <div class="flex min-w-0 items-center gap-3">
        <UAvatar v-bind="member.avatar" size="md" />

        <div class="min-w-0 text-sm">
          <p class="text-highlighted truncate font-medium">
            {{ member.name }}
          </p>
          <p class="text-muted truncate">
            {{ member.username }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <USelect
          :model-value="member.role"
          :items="['member', 'owner']"
          color="neutral"
          :ui="{ value: 'capitalize', item: 'capitalize' }"
        />

        <UDropdownMenu :items="items" :content="{ align: 'end' }">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Member } from "#shared/types";

defineProps<{
  members: Member[];
}>();

const items = computed(() => [
  {
    label: "Edit member",
    // eslint-disable-next-line no-console
    onSelect: () => console.log("Edit member"),
  },
  {
    label: "Remove member",
    color: "error" as const,
    // eslint-disable-next-line no-console
    onSelect: () => console.log("Remove member"),
  },
]);
</script>
