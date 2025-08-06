<template>
  <Primitive :as="as" :class="twMerge(defaultClass, props.class as string)">
    <UProgress
      :color="color"
      :model-value="score"
      :max="maxScore"
      :size="progressSize"
    />

    <p :class="twMerge(defaultTitleClass, props.titleClass as string)">
      <slot name="title">
        {{ title ?? t("ui.passwordStrengthIndicator.title") }}
      </slot>
    </p>

    <ul
      :class="twMerge(defaultListClass, props.listClass as string)"
      :arial-label="t('ui.passwordStrengthIndicator.ariaLabel')"
    >
      <li
        v-for="(req, index) in strength"
        :key="index"
        :class="
          twMerge(
            defaultListItemClass,
            props.listItemClass as string,
            req.regex.test(model ?? '') ? 'text-success' : 'text-muted',
          )
        "
      >
        <UIcon
          :name="req.met ? metIcon : notMetIcon"
          :class="twMerge(defaultIconClass, props.iconClass as string)"
        />

        <span
          :class="
            twMerge(defaultListItemTextClass, props.listItemTextClass as string)
          "
        >
          {{
            req.text ??
            (req.i18n && req.i18n.key
              ? t(req.i18n.key, { count: req.i18n.count })
              : "")
          }}
          <span class="sr-only">
            {{
              req.met
                ? ` - ${t("ui.passwordStrengthIndicator.requirementMet")}`
                : ` - ${t("ui.passwordStrengthIndicator.requirementNotMet")}`
            }}
          </span>
        </span>
      </li>
    </ul>
  </Primitive>
</template>

<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import type { ProgressProps } from "@nuxt/ui";
import { twMerge } from "tailwind-merge";

interface i18nProps {
  key: string;
  count?: number;
}

export interface PasswordStrengthRequirement {
  regex: RegExp;
  text?: string;
  i18n?: i18nProps;
}

export interface PasswordStrengthIndicatorProps {
  as?: PrimitiveProps["as"];
  title?: string;
  progress?: boolean;
  progressSize?: ProgressProps["size"];
  requirements?: PasswordStrengthRequirement[];
  class?: unknown;
  titleClass?: unknown;
  listClass?: unknown;
  listItemClass?: unknown;
  listItemTextClass?: unknown;
  metIcon?: string;
  notMetIcon?: string;
  iconClass?: string;
}
</script>

<script setup lang="ts">
const { t } = useI18n();

const props = withDefaults(defineProps<PasswordStrengthIndicatorProps>(), {
  as: "div",
  title: undefined,
  progress: true,
  progressSize: "sm",
  requirements: () => [
    {
      regex: /.{12,}/,
      i18n: {
        key: "ui.passwordStrengthIndicator.atLeastXCharacters",
        count: 12,
      },
    },
    {
      regex: /\d/,
      i18n: { key: "ui.passwordStrengthIndicator.atLeastXNumbers" },
    },
    {
      regex: /[a-z]/,
      i18n: { key: "ui.passwordStrengthIndicator.atLeastXLowercaseLetters" },
    },
    {
      regex: /[A-Z]/,
      i18n: { key: "ui.passwordStrengthIndicator.atLeastXUppercaseLetters" },
    },
    {
      regex: /[\W_]/,
      i18n: { key: "ui.passwordStrengthIndicator.atLeastXSpecialCharacters" },
    },
  ],
  class: undefined,
  titleClass: undefined,
  listClass: undefined,
  listItemClass: undefined,
  listItemTextClass: undefined,
  metIcon: "lucide:circle-check",
  notMetIcon: "lucide:circle-x",
  iconClass: undefined,
});

const defaultClass = "space-y-2";
const defaultTitleClass = "text-sm font-medium";
const defaultListClass = "space-y-1";
const defaultListItemClass = "flex items-center gap-1";
const defaultListItemTextClass = "text-xs font-light";
const defaultIconClass = "size-4 shrink-0";

const model = defineModel<string | undefined>({ default: undefined });

const checkStrength = (password: string) => {
  return props.requirements.map((r) => ({ ...r, met: r.regex.test(password) }));
};
// const computeScore = (password: string): number => {
//   if (!model.value || !model.value.length) return 0;

//   return props.requirements.reduce((score, requirement) => {
//     if (requirement.regex.test(password)) {
//       return score + 1;
//     }
//     return score;
//   }, 0);
// };

const computeColor = (score: number): ProgressProps["color"] => {
  const maxScore = props.requirements.length;
  const percentage = (score / maxScore) * 100;

  if (percentage === 100) {
    return "success";
  } else if (percentage >= 40) {
    return "warning";
  } else if (percentage >= 20) {
    return "error";
  } else {
    return "neutral";
  }
};

const maxScore = computed(() => props.requirements.length);
const strength = computed(() => checkStrength(model.value ?? ""));
const score = computed(() => strength.value.filter((r) => r.met).length);
const color = computed<ProgressProps["color"]>(() => computeColor(score.value));

defineExpose({
  score,
  maxScore,
  strength,
  color,
  isValid: computed(() => score.value === maxScore.value),
});
</script>
