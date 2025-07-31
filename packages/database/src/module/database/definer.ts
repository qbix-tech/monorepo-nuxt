import type {
  DrizzlePGConfig,
  DrizzlePGClientConfig,
  DrizzlePGPoolConfig,
} from "./types";

export const defineDrizzlePGConfig = <T extends DrizzlePGConfig>(config: T) => {
  return config as T["pg"]["connection"] extends "client"
    ? DrizzlePGClientConfig
    : DrizzlePGPoolConfig;
};
