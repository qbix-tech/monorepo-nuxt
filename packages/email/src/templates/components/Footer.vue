<template>
  <Section class="text-center">
    <Text class="text-xs text-gray-500">
      You are receiving this email as it contains important information
      regarding your account. <br />
      Please do not reply directly to this email.
    </Text>
    <Text class="text-xs text-gray-500">
      ©
      {{
        emailConfig.copyright.year === new Date().getFullYear()
          ? emailConfig.copyright.year
          : `${emailConfig.copyright.year} - ${new Date().getFullYear()}`
      }}
      <span class="font-bold">{{ emailConfig.copyright.owner }}</span
      >. All rights reserved.
    </Text>
  </Section>
</template>

<script setup lang="ts">
import emailConfig from "../../../email.config";
import { Section, Text } from "@vue-email/components";
</script>
