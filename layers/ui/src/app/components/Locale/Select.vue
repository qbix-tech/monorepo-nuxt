<template>
  <USelectMenu
    v-model="locale"
    :search-input="false"
    value-key="code"
    label-key="name"
    :items="locales"
  >
    <template #leading>
      <span v-if="locale" class="size-5 text-center">
        {{ getEmojiFlag(locale) }}
      </span>
    </template>

    <template #item-leading="{ item }">
      <span class="size-5 text-center">
        {{ getEmojiFlag(item.code) }}
      </span>
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();

watch(
  () => locale.value,
  (val) => {
    if (val) {
      setLocale(val);
    }
  },
);

const getEmojiFlag = (locale: string) => {
  const languageToCountry = {
    ar: "sa",
    // Arabic -> Saudi Arabia
    bn: "bd",
    // Bengali -> Bangladesh
    ca: "es",
    // Catalan -> Spain
    ckb: "iq",
    // Central Kurdish -> Iraq
    cs: "cz",
    // Czech -> Czech Republic (note: modern country code is actually 'cz')
    da: "dk",
    // Danish -> Denmark
    el: "gr",
    // Greek -> Greece
    en: "gb",
    // English -> Great Britain
    et: "ee",
    // Estonian -> Estonia
    he: "il",
    // Hebrew -> Israel
    hi: "in",
    // Hindi -> India
    hy: "am",
    // Armenian -> Armenia
    ja: "jp",
    // Japanese -> Japan
    kk: "kz",
    // Kazakh -> Kazakhstan
    km: "kh",
    // Khmer -> Cambodia
    ko: "kr",
    // Korean -> South Korea
    ky: "kg",
    // Kyrgyz -> Kyrgyzstan
    lb: "lu",
    // Luxembourgish -> Luxembourg
    ms: "my",
    // Malay -> Malaysia
    nb: "no",
    // Norwegian Bokmål -> Norway
    sl: "si",
    // Slovenian -> Slovenia
    sv: "se",
    // Swedish -> Sweden
    uk: "ua",
    // Ukrainian -> Ukraine
    ur: "pk",
    // Urdu -> Pakistan
    vi: "vn",
    // Vietnamese -> Vietnam
    zh: "cn", // Chinese -> China
  };
  const baseLanguage = locale.split("-")[0]?.toLowerCase() || locale;
  const countryCode =
    languageToCountry[baseLanguage as keyof typeof languageToCountry] ||
    locale.replace(/^.*-/, "").slice(0, 2);
  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
};
</script>
