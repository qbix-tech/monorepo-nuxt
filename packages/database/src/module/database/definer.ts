import type {
  DrizzlePGConfig,
  DrizzlePGClientConfig,
  DrizzlePGPoolConfig,
} from "./types";
import { defu } from "defu";

export const defineDrizzlePGConfig = <T extends DrizzlePGConfig>(config: T) => {
  return defu(config, {
    options: { casing: "snake_case" },
  }) as T["pg"]["connection"] extends "client"
    ? DrizzlePGClientConfig
    : DrizzlePGPoolConfig;
};
