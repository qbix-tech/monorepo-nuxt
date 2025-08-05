<template>
  <UApp :locale="locales[locale === 'zh' ? 'zh_cn' : locale]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import * as locales from "@nuxt/ui/locale";
const { locale } = useI18n();

useCookieConsent();
</script>
