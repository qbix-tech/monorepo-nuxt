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
            <DatePicker v-model="date" variant="outline" />
            <DateRangePicker v-model="range" variant="outline" />
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
            class="dark:bg-muted/20 bg-muted flex h-40 items-center justify-center gap-8 rounded-md p-4"
          >
            <SafeTemplate v-bind="{ data, status, error, refresh }">
              <template #default="{ data: safeData }">
                <span class="text-success">
                  {{ safeData }}
                </span>
              </template>
            </SafeTemplate>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold"> Safe Template </span>
            <span class="text-muted text-sm">
              Easily handle type-safe bridge between asynchronous data fetching
              and contents.
            </span>
          </div>
        </PageCard>
        <PageCard
          container-class="p-4 sm:p-4"
          title-class="flex items-center gap-1"
        >
          <div
            class="dark:bg-muted/20 bg-muted flex h-40 items-center justify-center gap-2 rounded-md px-8 py-2"
          >
            <FlashInfo class="size-16" pulse />
            <FlashSuccess class="size-16" pulse />
            <FlashWarning class="size-16" pulse />
            <FlashError class="size-16" pulse />
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold"> Flash Status </span>
            <span class="text-muted text-sm">
              Flash status component used to communicate the outcome of a
              critical user action – whether it's a triumphant success or a
              serious error.
            </span>
          </div>
        </PageCard>
        <PageCard
          container-class="p-4 sm:p-4"
          title-class="flex items-center gap-1"
        >
          <div class="dark:bg-muted/20 bg-muted h-40 rounded-md px-8 py-2">
            <CardAction
              v-bind="cardActionState"
              header-class="min-h-0"
              title-class="text-xs"
              :ui="{
                root: 'overflow-hidden',
                header: 'px-3 py-2 sm:px-3 sm:py-2',
                body: 'px-3 py-4 sm:px-3 sm:py-4 h-16',
                footer: 'px-3 py-2 sm:px-3 sm:py-2',
              }"
            >
              <template #body-loading>
                <LoadingSpinner min-height="0" size="2rem" />
              </template>
              <template #footer-loading>
                <div class="flex justify-end">
                  <USkeleton class="h-6 w-11" />
                </div>
              </template>
              <template #title="{ currentStep }">
                Step {{ currentStep }}
              </template>
              <template #body>
                <Placeholder class="h-8" />
              </template>
              <template #footer>
                <div class="flex justify-end">
                  <UButton
                    size="xs"
                    label="Next"
                    color="neutral"
                    variant="solid"
                    @click="cardActionNext"
                  />
                </div>
              </template>
            </CardAction>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold"> Card Action </span>
            <span class="text-muted text-sm">
              Easily create actions within a card component, with virtually
              unlimited steps.
            </span>
          </div>
        </PageCard>
        <PageCard
          container-class="p-4 sm:p-4"
          title-class="flex items-center gap-1"
        >
          <div
            class="dark:bg-muted/20 bg-muted flex h-40 items-center justify-center rounded-md px-8 py-2"
          >
            <TransitionFade :duration-in-seconds="0.3" mode="out-in">
              <FlashInfo v-if="transitionCount % 4 === 0" />
              <FlashSuccess v-else-if="transitionCount % 4 === 1" />
              <FlashWarning v-else-if="transitionCount % 4 === 2" />
              <FlashError v-else-if="transitionCount % 4 === 3" />
            </TransitionFade>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold"> Easy Transitions </span>
            <span class="text-muted text-sm">
              Easily define transitions between components.
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
        <PageCard
          container-class="p-4 sm:p-4"
          title-class="flex items-center gap-1"
        >
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
            <span class="text-lg font-semibold">
              Password Strength Indicator
            </span>
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
        <PageCard
          container-class="p-4 sm:p-4"
          title-class="flex items-center gap-1"
        >
          <div
            class="dark:bg-muted/20 bg-muted relative flex h-40 overflow-hidden rounded-md"
          >
            <PageMarquee
              orientation="vertical"
              class="w-full [--gap:--spacing(4)] before:h-1/5 after:h-1/5"
            >
              <UCard
                v-for="(item, index) in testimonials"
                :key="index"
                :ui="{
                  body: 'space-y-2 sm:px-3 sm:py-3',
                  root: 'w-full max-w-80 sm:w-60',
                }"
              >
                <div class="flex gap-1.5">
                  <UAvatar :src="item.avatar.src" :alt="item.name" />
                  <div>
                    <span class="block text-xs">{{ item.name }}</span>
                    <span class="text-muted block text-xs"
                      >@{{ item.username }}</span
                    >
                  </div>
                </div>
                <p class="text-xs">
                  {{ item.feedback }}
                </p>
              </UCard>
            </PageMarquee>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold"> Marquee </span>
            <span class="text-muted text-sm">
              A marquee component that can be used to display a scrolling text,
              images or a component.
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

const { data, status, error, refresh } = useFetch("/api/simulate", {
  query: {
    success_rate: 0.5,
    delay: 2000,
    response: "OK",
  },
  retry: false,
});
onMounted(() => {
  const simulateInterval = setInterval(() => {
    refresh();
  }, 5000);
  onBeforeUnmount(() => {
    clearInterval(simulateInterval);
  });
});

const cardActionState = ref({
  currentStep: 1,
  close: false,
  transitionMode: "slide",
  loading: false,
});
const cardActionNext = () => {
  cardActionState.value.loading = true;
  cardActionState.value.currentStep = cardActionState.value.currentStep + 1;
  setTimeout(() => {
    cardActionState.value.loading = false;
  }, 1000);
};
onMounted(() => {
  const simulateActionInterval = setInterval(() => {
    cardActionNext();
  }, 3000);
  onBeforeMount(() => {
    clearInterval(simulateActionInterval);
  });
});

const transitionCount = ref(1);
onMounted(() => {
  const simulateTransitionInterval = setInterval(() => {
    transitionCount.value = transitionCount.value + 1;
  }, 2000);
  onBeforeMount(() => {
    clearInterval(simulateTransitionInterval);
  });
});

const password = ref("");
const show = ref(false);
const passwordIndicatorRef = useTemplateRef("passwordIndicatorRef");

const testimonials = [
  {
    name: "Clayton Chew",
    username: "claytonchew",
    avatar: { src: "https://github.com/claytonchew.png" },
    feedback:
      "@org/ui has been a game-changer for our team. The components are easy to use and integrate seamlessly with our existing Nuxt 3 project.",
  },
  {
    name: "Ronnie Chew",
    username: "ronnie-chew",
    avatar: { src: "https://github.com/ronnie-chew.png" },
    feedback:
      "The design system provided by @org/ui is fantastic. It has helped us maintain a consistent look and feel across our application.",
  },
  {
    name: "Yeoh Lee Ming",
    username: "leeming988QM",
    avatar: { src: "https://github.com/leeming988QM.png" },
    feedback:
      "@org/ui has made it so much easier to build responsive and accessible components. The documentation is also top-notch!",
  },
  {
    name: "Ong Ming Yen",
    username: "ongmingyen",
    avatar: {
      src: "https://github.com/ongmingyen.png",
    },
    feedback:
      "I love how @org/ui provides a wide range of components that are ready to use. It has saved us a lot of development time.",
  },
  {
    name: "Steven Lim",
    username: "steven-QM",
    avatar: {
      src: "https://github.com/steven-QM.png",
    },
    feedback:
      "The @org/ui library is a great addition to our Nuxt 3 project. The components are well-designed and easy to customize.",
  },
  {
    name: "Ang Chee Keat",
    username: "CheeKeat-QM",
    avatar: {
      src: "https://github.com/CheeKeat-QM.png",
    },
    feedback:
      "Using @org/ui has significantly improved our development workflow. The components are intuitive and easy to work with.",
  },
  {
    name: "Reynold Chong",
    username: "reynoldcky",
    avatar: { src: "https://github.com/reynoldcky.png" },
    feedback:
      "The @org/ui components are not only visually appealing but also highly functional. They have enhanced the user experience of our application.",
  },
  {
    name: "Zulfidly Zulkifli",
    username: "fidlyqm",
    avatar: { src: "https://github.com/fidlyqm.png" },
    feedback:
      "I appreciate the effort put into creating @org/ui. The components are well-optimized and perform excellently in our Nuxt 3 application.",
  },
];
</script>
