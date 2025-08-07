<template>
  <PageCard container-class="p-4 sm:p-4" title-class="flex items-center gap-1">
    <div
      class="bg-muted dark:bg-muted/20 flex h-40 flex-col items-center justify-center gap-4 rounded-md"
    >
      <Me
        :name="user1.name"
        :description="'@' + user1.username"
        :avatar="{ src: user1.avatar.src, alt: user1.name }"
        size="3xs"
      />
      <Me
        :name="user2.name"
        :description="'@' + user2.username"
        :avatar="{ src: user2.avatar.src, alt: user2.name }"
        size="xs"
      />
      <Me
        :name="user3.name"
        :description="'@' + user3.username"
        :avatar="{ src: user3.avatar.src, alt: user3.name }"
        size="sm"
      />
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-lg font-semibold">Me</span>
      <span class="text-muted text-sm">
        A user profile component that displays a user's (or any entity's) name,
        description, and avatar.
      </span>
    </div>
  </PageCard>
</template>

<script setup lang="ts">
const user1 = {
  name: "Clayton Chew",
  username: "claytonchew",
  avatar: { src: "https://github.com/claytonchew.png" },
};

const user2 = {
  name: "Ronnie Chew",
  username: "ronnie-chew",
  avatar: { src: "https://github.com/ronnie-chew.png" },
};

const user3 = {
  name: "Yeoh Lee Ming",
  username: "leeming988QM",
  avatar: { src: "https://github.com/leeming988QM.png" },
};
</script>
