import type { AllowedComponentProps, VNodeProps } from "vue";
import type { Config as OriginalTailwindConfig } from "tailwindcss";

export type Templates = typeof import("./templates");
export type TemplateName = keyof Templates;
export type EmailComponentRecords = Record<
  TemplateName,
  ExtractComponentProps<Templates[TemplateName]>
>;

export type EmailTailwindConfig = Pick<
  OriginalTailwindConfig,
  | "important"
  | "prefix"
  | "separator"
  | "safelist"
  | "blocklist"
  | "presets"
  | "future"
  | "experimental"
  | "darkMode"
  | "theme"
  | "corePlugins"
  | "plugins"
>;

export interface VNode {
  type: string;
  props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style?: Record<string, any>;
    children?: string | VNode | VNode[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any;
  };
}

export interface EmailBaseProps {
  commons: {
    logoUrl?: string;
    heroImageUrl?: string;
  };
}

export type ExtractComponentProps<TComponent> = TComponent extends new () => {
  $props: infer P;
}
  ? Omit<P, keyof VNodeProps | keyof AllowedComponentProps>
  : never;

export interface EmailConfig {
  copyright: {
    owner: string;
    year: number;
  };
  defaults?: {
    logoUrl?: string;
    heroImageUrl?: string;
  };
}
