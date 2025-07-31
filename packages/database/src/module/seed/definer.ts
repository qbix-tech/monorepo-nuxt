import type { SeedConfig, SeedStep, Job } from "./types";
import type { DrizzlePGTransaction } from "../database/types";

export const defineSeedConfig = (config: SeedConfig): SeedConfig => {
  return config;
};

export const defineStep = (
  fn: (tx: DrizzlePGTransaction) => Promise<void> | void,
  config?: { name?: string; continueOnError?: boolean },
) => {
  return {
    seed: fn,
    name: config?.name,
    continueOnError: config?.continueOnError,
  } as SeedStep;
};

export const defineJob = (
  steps: SeedStep[],
  config?: { dependsOn?: string[]; continueOnError?: boolean },
) => {
  return {
    steps,
    dependsOn: config?.dependsOn,
    continueOnError: config?.continueOnError,
  } as Job;
};
