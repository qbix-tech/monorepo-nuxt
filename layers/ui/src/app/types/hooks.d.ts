import type { HookResult } from "@nuxt/schema";

declare module "#app" {
  interface RuntimeNuxtHooks {
    /**
     * Emitted when the dashboard search is toggled.
     */
    "dashboard:search:toggle": () => HookResult;
    /**
     * Emitted when the dashboard sidebar is toggled.
     */
    "dashboard:sidebar:toggle": () => HookResult;
    /**
     * Emitted when the dashboard sidebar is collapsed or expanded.
     */
    "dashboard:sidebar:collapse": (value: boolean) => HookResult;
  }
}
