import type {
  DrizzlePGDatabase,
  DrizzlePGTransaction,
} from "../database/types";

export interface SeedModule {
  main: (db: DrizzlePGDatabase | DrizzlePGTransaction) => Promise<void>;
}

export interface SeedStep {
  name?: string;
  seed: (tx: DrizzlePGTransaction) => Promise<void> | void;
  continueOnError?: boolean;
}

export interface Job {
  steps: SeedStep[];
  dependsOn?: string[];
  continueOnError?: boolean;
}

export type SeedRunner = {
  versions?: Record<number, SeedStep[]>;
  jobs?: Record<string, Job>;
  tests?: Record<string, Job>;
};

export type SeedConfig = {
  includeTest?: boolean;
  resetVersion?: number;
  seed: SeedRunner;
};
