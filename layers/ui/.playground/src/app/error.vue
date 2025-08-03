<template>
  <UApp>
    <Error :error="error" />
  </UApp>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();
</script>
