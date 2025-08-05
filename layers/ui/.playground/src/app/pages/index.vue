<template>
  <BackgroundLampEffect
    class="text-primary absolute -top-px w-full shrink-0 transition-all"
    :class="[
      isLoading ? 'animate-pulse' : appear ? '' : 'opacity-0',
      appeared ? 'duration-[400ms]' : 'duration-1000',
    ]"
    height="320"
  />

  <div class="relative">
    <PageHero
      title="@org/ui"
      description="Starting point for your project's UI."
      :links="links"
      container-class="md:pt-18 lg:pt-28"
    >
      <template #bottom>
        <PageMarquee>
          <UIcon name="simple-icons:nuxt" class="size-10 shrink-0" />
          <UIcon name="simple-icons:vuedotjs" class="size-10 shrink-0" />
          <UIcon
            name="simple-icons:amazonwebservices"
            class="size-10 shrink-0"
          />
          <UIcon name="simple-icons:terraform" class="size-10 shrink-0" />
          <UIcon name="simple-icons:opentofu" class="size-10 shrink-0" />
          <UIcon name="simple-icons:docker" class="size-10 shrink-0" />
          <UIcon name="simple-icons:kubernetes" class="size-10 shrink-0" />
          <UIcon name="simple-icons:github" class="size-10 shrink-0" />
          <UIcon name="simple-icons:prometheus" class="size-10 shrink-0" />
          <UIcon name="simple-icons:dotnet" class="size-10 shrink-0" />
          <UIcon name="simple-icons:cloudflare" class="size-10 shrink-0" />
          <UIcon name="simple-icons:flutter" class="size-10 shrink-0" />
        </PageMarquee>
      </template>
    </PageHero>

    <PageSection
      title="Reusable UI Components"
      description="@org/ui is a collection of reusable UI components and utilities designed to help you build modern web applications with Nuxt 3. It provides a consistent design system, accessibility features, and a wide range of customizable components."
      :features="features"
      orientation="horizontal"
      container-class="lg:px-0 2xl:px-20 mx-0 max-w-none md:mr-10"
      features-class="gap-0"
      reverse
    >
      <img
        src="/images/macbook.svg"
        class="left-0 hidden w-full max-w-2xl lg:block 2xl:hidden"
      />
      <img
        src="/images/macbook-mobile.svg"
        class="block lg:hidden 2xl:block 2xl:w-full 2xl:max-w-2xl"
      />
    </PageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <PageSection
      id="development"
      title="Development"
      description="@org/ui comes with a playground for you to test and develop your UI components, so that you can develop your components in isolation and see how they look and behave in different scenarios."
      title-class="text-left @container relative flex"
      description-class="text-left"
      orientation="horizontal"
      class="relative overflow-hidden"
    >
      <div
        class="bg-primary absolute top-10 -left-10 z-10 size-[300px] rounded-full opacity-30 blur-[200px]"
      />
      <div
        class="bg-primary absolute -right-10 -bottom-10 z-10 size-[300px] rounded-full opacity-30 blur-[200px]"
      />

      <div class="group relative my-5 [&>pre]:my-0 [&>pre]:rounded-t-none">
        <div
          class="border-muted bg-default relative flex items-center gap-1.5 rounded-t-md border border-b-0 px-4 py-3"
        >
          <UIcon name="lucide:terminal" class="size-4 shrink-0" />
          <span class="text-default text-sm/6">Terminal</span>
        </div>

        <UButton
          :icon="copied ? 'lucide:check' : 'lucide:copy'"
          color="neutral"
          variant="outline"
          size="sm"
          tabindex="-1"
          class="absolute top-[11px] right-[11px] transition lg:opacity-0 lg:group-hover:opacity-100"
          @click="copy('pnpm dev:layer:ui')"
        />

        <pre
          class="group border-muted bg-muted overflow-x-auto rounded-md border px-4 py-3 font-mono text-sm/6 break-words whitespace-pre-wrap focus:outline-none"
        >
pnpm dev:layer:ui</pre
        >
      </div>
    </PageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <PageSection
      id="layouts"
      title="Layouts"
      description="Supports landing-style layouts and dashboard-style layouts, allowing you to create different types of pages with ease."
      class="relative overflow-hidden"
      features-class="lg:grid-cols-2"
    >
      <template #features>
        <PageCard
          v-for="(layout, index) in layouts"
          :key="index"
          class="group"
          spotlight
          container-class="p-4 sm:p-4"
          title-class="flex items-center gap-1"
          :to="layout.to"
        >
          <ColorModeImage
            v-if="layout.image"
            :light="layout.image?.light"
            :dark="layout.image?.dark"
            :alt="layout.title"
            class="size-full"
          />
          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold">
              {{ layout.title }}
              <UBadge
                v-if="layout.badge"
                :label="layout.badge"
                class="-translate-y-0.5 rounded-full"
              />
            </span>
            <span class="text-muted text-sm">
              {{ layout.description }}
            </span>
          </div>
        </PageCard>
      </template>
    </PageSection>

    <PageSection
      id="components"
      title="Components"
      description="A collection of reusable UI components, extended from Nuxt UI and TailwindCSS. These components are designed to provide the primitive base for use, allowing you to create a consistent and modern user interface."
      class="relative overflow-hidden"
    >
      <template #features>
        <PageCard
          container-class="p-4 sm:p-4"
          title-class="flex items-center gap-1"
        >
          <div
            class="bg-muted dark:bg-muted/20 flex h-40 items-center justify-center gap-8 rounded-md"
          >
            <ColorModeButton />
            <ColorModeSelect />
            <ColorModeSwitch />
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold"> Color Mode </span>
            <span class="text-muted text-sm">
              Color mode utility components to switch between light and dark
              modes.
            </span>
          </div>
        </PageCard>
        <PageCard
          container-class="p-4 sm:p-4"
          title-class="flex items-center gap-1"
        >
          <div
            class="bg-muted dark:bg-muted/20 flex h-40 items-center justify-center gap-8 rounded-md"
          >
            <LocaleSelect />
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold"> Locale </span>
            <span class="text-muted text-sm">
              Locale utility components to switch between different languages
              and locales.
            </span>
          </div>
        </PageCard>
        <PageCard
          container-class="p-4 sm:p-4"
          title-class="flex items-center gap-1"
        >
          <div
            class="bg-muted dark:bg-muted/20 flex h-40 flex-col items-center justify-center gap-8 rounded-md"
          >
            <DatePicker v-model="date" variant="subtle" />
            <DateRangePicker v-model="range" variant="subtle" />
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold"> Date Picker </span>
            <span class="text-muted text-sm">
              Date picker components that can be used to select dates and
              ranges.
            </span>
          </div>
        </PageCard>
        <PageCard
          container-class="p-4 sm:p-4"
          title-class="flex items-center gap-1"
          class="overflow-hidden"
        >
          <div class="bg-muted dark:bg-muted/20 relative h-40 rounded-md">
            <LazyBackgroundBubbles :bubble-count="200" />
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold"> Backgrounds </span>
            <span class="text-muted text-sm">
              A range of background components that can be used to create
              visually appealing sections in your application.
            </span>
          </div>
        </PageCard>
        <PageCard
          container-class="p-4 sm:p-4"
          title-class="flex items-center gap-1"
        >
          <div
            class="dark:bg-muted/20 bg-muted flex h-40 items-center justify-center gap-8 rounded-md"
          >
            <LoadingSpinner />
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold"> Safe Containers </span>
            <span class="text-muted text-sm">
              Easily incorporate loader and data-fetch-safe components that can
              be used to indicate data fetching state in your application.
            </span>
          </div>
        </PageCard>
        <PageCard
          container-class="p-4 sm:p-4"
          title-class="flex items-center gap-1"
        >
          <div
            class="dark:bg-muted/20 bg-muted relative h-40 overflow-hidden rounded-md"
          >
            <ImageLightbox
              src="https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=500&q=90"
              class="object-cover"
            />
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold"> Lightbox </span>
            <span class="text-muted text-sm">
              A lightbox component that can be used to display images in a
              modal-like overlay.
            </span>
          </div>
        </PageCard>
        <PageCard
          container-class="p-4 sm:p-4"
          title-class="flex items-center gap-1"
        >
          <div
            class="dark:bg-muted/20 bg-muted relative h-40 overflow-hidden rounded-md"
          >
            <ColorModeImage
              light="/images/light/chart.svg"
              dark="/images/dark/chart.svg"
            />
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold"> Charts </span>
            <span class="text-muted text-sm">
              A collection of ready-to-use chart components that can be used to
              display data in a visual format.
            </span>
          </div>
        </PageCard>
      </template>
    </PageSection>

    <USeparator />

    <PageCTA
      title="Get Started with @org/ui"
      description="Ready to build your next project with @org/ui? Add the following to your nuxt.config.ts file to get started."
      variant="naked"
      class="@container overflow-hidden"
    >
      <div class="group relative my-5 [&>pre]:my-0 [&>pre]:rounded-t-none">
        <div
          class="border-muted bg-default relative flex items-center gap-1.5 rounded-t-md border border-b-0 px-4 py-3"
        >
          <UIcon name="lucide:file" class="size-4 shrink-0" />
          <span class="text-default text-sm/6">nuxt.config.ts</span>
        </div>

        <UButton
          :icon="copied ? 'lucide:check' : 'lucide:copy'"
          color="neutral"
          variant="outline"
          size="sm"
          tabindex="-1"
          class="absolute top-[11px] right-[11px] transition lg:opacity-0 lg:group-hover:opacity-100"
          @click="copy('pnpm dev:layer:ui')"
        />

        <pre
          class="group border-muted bg-muted overflow-x-auto rounded-md border px-4 py-3 font-mono text-sm/6 break-words whitespace-pre-wrap focus:outline-none"
          >{{ codeExample }}</pre
        >
      </div>

      <div
        class="dark:bg-primary absolute left-1/2 size-40 -translate-x-1/2 -translate-y-80 transform rounded-full blur-[250px] sm:size-50"
      />

      <LazyBackgroundStars />
    </PageCTA>
  </div>
</template>

<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";
import { sub } from "date-fns";

definePageMeta({
  layout: "landing",
});

const { copy, copied } = useClipboard();

const { isLoading } = useLoadingIndicator();
const appear = ref(false);
const appeared = ref(false);
onMounted(() => {
  setTimeout(() => {
    appear.value = true;
    setTimeout(() => {
      appeared.value = true;
    }, 1000);
  }, 0);
});

const links = computed<ButtonProps[]>(() => [
  {
    label: "Switch to Dashboard",
    to: "/dashboard",
    variant: "subtle",
    class: "rounded-full",
    icon: "lucide:arrow-right-left",
  },
]);

const features = computed(() => [
  {
    title: "Supports various layouts",
    description:
      "Easily create different layouts for your application, including landing pages, dashboards, and more.",
    class: "border-l border-primary pl-4",
  },
  {
    title: "Primitive Components",
    description:
      "Extend and customize components to fit your design needs. Use the provided primitives to build your own components.",
    class: "border-l border-default pt-4 pl-4",
  },
  {
    title: "Nuxt UI and Tailwindcss Ready",
    description:
      "Built with Nuxt UI and Tailwind CSS, providing a modern and responsive design system.",
    class: "border-l border-default pt-4 pl-4",
  },
]);

const layouts = computed(() => [
  {
    image: {
      light: "/images/light/landing.svg",
      dark: "/images/dark/landing.svg",
    },
    title: "Landing",
    badge: "This",
    description: "A landing layout with a typical header and a footer.",
  },
  {
    image: {
      light: "/images/light/dashboard.svg",
      dark: "/images/dark/dashboard.svg",
    },
    title: "Dashboard",
    description: "A dashboard layout with customisible panels and widgets.",
    to: "/dashboard",
  },
]);

const codeExample = `export default defineNuxtConfig({
  extends: [
    ["@org/ui", { install: true }],
  ],
});`;

const date = ref(new Date());
const range = ref({
  start: sub(new Date(), { days: 7 }),
  end: new Date(),
});
</script>
