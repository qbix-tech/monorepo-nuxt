import type { HookResult } from "@nuxt/schema";

declare module "#app" {
  interface RuntimeNuxtHooks {
    "dashboard:search:toggle": () => HookResult;
    "dashboard:sidebar:toggle": () => HookResult;
    "dashboard:sidebar:collapse": (value: boolean) => HookResult;
  }
}
