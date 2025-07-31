<template>
  <Section class="p-6">
    <slot>
      <Img
        v-if="props.logoUrl"
        :src="props.logoUrl"
        alt="GamBit"
        class="h-12 w-auto"
      />
    </slot>
  </Section>
</template>

<script setup lang="ts">
import { Section, Img } from "@vue-email/components";
const props = defineProps<{
  logoUrl?: string;
}>();
</script>
