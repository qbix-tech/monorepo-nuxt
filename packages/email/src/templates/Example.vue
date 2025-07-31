<template>
  <Layout :logo-url="props.commons.logoUrl" :preview="previewText">
    <Section v-if="props.commons.heroImageUrl">
      <Img :src="props.commons.heroImageUrl" alt="Hero" class="h-auto w-full" />
    </Section>
    <Container class="mt-6 px-8">
      <Heading as="h1" class="text-center text-2xl font-bold">
        Example Heading
      </Heading>
      <Section>
        <Text v-if="props.name" class="text-base">
          Hi <span class="font-bold">{{ props.name }}</span
          >,
        </Text>
        <Text class="text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          consectetur viverra viverra. Aliquam et condimentum justo, quis
          posuere odio. Ut commodo luctus gravida. Cras pretium turpis eget nisi
          tempus, ac sollicitudin odio posuere. Nam vitae nisl erat. Phasellus
          in erat vitae erat vestibulum pellentesque a in libero. Duis vel mi
          vitae leo efficitur facilisis sed sed mi. Cras efficitur ut neque id
          lobortis.
        </Text>
        <Text class="text-base">
          Fusce sed consequat mi. Nunc dui lorem, fermentum sed tincidunt a,
          blandit vestibulum lorem. Fusce porttitor eu tortor at hendrerit.
          Maecenas dolor nibh, bibendum at sagittis quis, tristique vel sapien.
          Fusce ultricies elit at justo consequat, sed efficitur dui lacinia. Ut
          vehicula vel magna sit amet luctus. Donec ullamcorper lacinia ex, in
          elementum mi malesuada sit amet.
        </Text>
        <Text class="text-base">
          Donec a imperdiet lectus. Nulla eleifend, dolor ut luctus maximus,
          orci ex varius urna, ac semper felis lacus rutrum neque. Maecenas
          sollicitudin vitae mauris at volutpat. Curabitur aliquet tincidunt est
          non porttitor. Fusce efficitur semper finibus. Suspendisse in nulla
          egestas, semper augue nec, vehicula tortor. Curabitur rhoncus erat a
          mi condimentum, non pellentesque augue pharetra. Suspendisse felis
          magna, pellentesque id urna vitae, convallis lacinia nibh. Duis
          egestas et ipsum elementum commodo. In interdum commodo erat eu
          placerat. Nunc a velit nisl.
        </Text>
      </Section>
    </Container>
  </Layout>
</template>

<script setup lang="ts">
import Layout from "./layouts/Standard.vue";
import type { EmailBaseProps } from "../index";
import { Container, Section, Heading, Img, Text } from "@vue-email/components";

const previewText = "Example Email";
const props = defineProps<
  EmailBaseProps & {
    name: string;
  }
>();
</script>
