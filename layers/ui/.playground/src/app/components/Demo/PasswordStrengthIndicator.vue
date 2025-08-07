<template>
  <PageCard container-class="p-4 sm:p-4" title-class="flex items-center gap-1">
    <div
      class="dark:bg-muted/20 bg-muted relative h-40 overflow-hidden rounded-md"
    >
      <PasswordStrengthIndicator
        ref="passwordIndicatorRef"
        v-model="password"
        progress-size="lg"
        title-class="px-6"
        list-class="px-6"
      />
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-lg font-semibold"> Password Strength Indicator </span>
      <UFormField>
        <UInput
          v-model="password"
          placeholder="Password"
          :color="passwordIndicatorRef?.color"
          :type="show ? 'text' : 'password'"
          :aria-invalid="!passwordIndicatorRef?.isValid"
          aria-describedby="password-strength"
          :ui="{ trailing: 'pe-1' }"
          class="w-full"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="show ? 'Hide password' : 'Show password'"
              :aria-pressed="show"
              aria-controls="password"
              @click="show = !show"
            />
          </template>
        </UInput>
      </UFormField>
    </div>
  </PageCard>
</template>

<script setup lang="ts">
import { PasswordStrengthIndicator } from "#components";
const password = ref("");
const show = ref(false);
const passwordIndicatorRef = useTemplateRef<typeof PasswordStrengthIndicator>(
  "passwordIndicatorRef",
);
</script>
