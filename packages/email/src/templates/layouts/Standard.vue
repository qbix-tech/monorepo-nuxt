<template>
  <Tailwind :config="tailwindCSSConfig">
    <Html>
      <Head />
      <Preview v-if="props.preview"> {{ props.preview }} </Preview>
      <Body class="mx-auto my-auto bg-white font-sans">
        <Container class="mt-2 max-w-[640px]">
          <slot name="header" v-bind="{ logoUrl }">
            <Header :logo-url="props.logoUrl" />
          </slot>
          <Container class="mt-2 mb-4 border border-solid border-gray-200 pb-6">
            <slot />
          </Container>
        </Container>
        <slot name="footer">
          <Container class="mb-8 max-w-[640px]">
            <Footer />
          </Container>
        </slot>
      </Body>
    </Html>
  </Tailwind>
</template>

<script setup lang="ts">
import tailwindCSSConfig from "./tailwindcss.config";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import {
  Tailwind,
  Html,
  Head,
  Preview,
  Body,
  Container,
} from "@vue-email/components";

const props = defineProps<{
  preview?: string;
  logoUrl?: string;
}>();
</script>
