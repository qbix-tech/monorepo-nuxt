<template>
  <PageCard
    title="Password"
    description="Confirm your current password before setting a new one."
    variant="subtle"
  >
    <UForm
      :schema="passwordSchema"
      :state="password"
      :validate="validate"
      class="flex max-w-xs flex-col gap-4"
    >
      <UFormField name="current">
        <UInput
          v-model="password.current"
          type="password"
          placeholder="Current password"
          class="w-full"
        />
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="password.new"
          type="password"
          placeholder="New password"
          class="w-full"
        />
      </UFormField>

      <UButton label="Update" class="w-fit" type="submit" />
    </UForm>
  </PageCard>

  <PageCard
    title="Account"
    description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
    class="from-error/10 to-default bg-gradient-to-tl from-5%"
  >
    <template #footer>
      <UButton label="Delete account" color="error" />
    </template>
  </PageCard>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormError } from "@nuxt/ui";

const passwordSchema = z.object({
  current: z.string().min(8, "Must be at least 8 characters"),
  new: z.string().min(8, "Must be at least 8 characters"),
});

type PasswordSchema = z.output<typeof passwordSchema>;

const password = reactive<Partial<PasswordSchema>>({
  current: undefined,
  new: undefined,
});

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = [];
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: "new", message: "Passwords must be different" });
  }
  return errors;
};
</script>
