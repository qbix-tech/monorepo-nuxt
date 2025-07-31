import type { SeedModule, SeedConfig, SeedStep } from "./types";
import type {
  DrizzlePGDatabase,
  DrizzlePGTransaction,
} from "../database/types";

class Seed implements SeedModule {
  private jobLogs: Record<string, boolean> = {};
  private testLogs: Record<string, boolean> = {};

  constructor(private config: SeedConfig) {}

  private async runSteps(tx: DrizzlePGTransaction, steps: SeedStep[]) {
    for (const step of steps) {
      try {
        await step.seed(tx);
      } catch (error) {
        if (!step.continueOnError) {
          throw error;
        }
        // eslint-disable-next-line no-console
        console.error(
          `Error in step${step?.name ? " " + step.name : ""}:`,
          error,
        );
        // eslint-disable-next-line no-console
        console.error("Ignoring error and continuing...");
      }
    }
  }

  private async runJob(
    tx: DrizzlePGTransaction,
    jobId: string,
    continueOnError?: boolean,
  ) {
    if (this.jobLogs[jobId]) {
      return;
    }

    // eslint-disable-next-line no-console
    console.info(`Running job: ${jobId}`);

    const job = this.config.seed.jobs![jobId];

    if (job!.dependsOn) {
      for (const dependency of job!.dependsOn) {
        const dependedJob = this.config.seed.jobs![dependency];
        try {
          await this.runJob(tx, dependency, job!.continueOnError);
        } catch (error) {
          if (
            !dependedJob!.continueOnError &&
            !job!.continueOnError &&
            !continueOnError
          ) {
            throw error;
          }
          // eslint-disable-next-line no-console
          console.error(`Error in job ${dependency}:`, error);
          // eslint-disable-next-line no-console
          console.error("Ignoring error and continuing...");
        }
      }
    }

    try {
      await this.runSteps(tx, job!.steps);
    } catch (error) {
      if (!job!.continueOnError) {
        throw error;
      }
      // eslint-disable-next-line no-console
      console.error(`Error in job ${jobId}:`, error);
      // eslint-disable-next-line no-console
      console.error("Ignoring error and continuing...");
    } finally {
      this.jobLogs[jobId] = true;
    }
    // eslint-disable-next-line no-console
    console.info("");
  }

  private async runTest(
    tx: DrizzlePGTransaction,
    testId: string,
    continueOnError?: boolean,
  ) {
    if (this.testLogs[testId]) {
      return;
    }

    // eslint-disable-next-line no-console
    console.info(`Running test: ${testId}`);

    const test = this.config.seed.tests![testId];

    if (test!.dependsOn) {
      for (const dependency of test!.dependsOn) {
        const dependedTest = this.config.seed.tests![dependency];
        try {
          await this.runTest(tx, dependency, test!.continueOnError);
        } catch (error) {
          if (
            !dependedTest!.continueOnError &&
            !test!.continueOnError &&
            !continueOnError
          ) {
            throw error;
          }
          // eslint-disable-next-line no-console
          console.error(`Error in test ${dependency}:`, error);
          // eslint-disable-next-line no-console
          console.error("Ignoring error and continuing...");
        }
      }
    }

    try {
      await this.runSteps(tx, test!.steps);
    } catch (error) {
      if (!test!.continueOnError) {
        throw error;
      }
      // eslint-disable-next-line no-console
      console.error(`Error in test ${testId}:`, error);
      // eslint-disable-next-line no-console
      console.error("Ignoring error and continuing...");
    } finally {
      this.testLogs[testId] = true;
    }
  }

  async main(
    db: DrizzlePGDatabase | DrizzlePGTransaction,
    seedTests?: boolean,
  ) {
    await db.transaction(async (tx) => {
      if (this.config.seed.jobs) {
        for (const jobId in this.config.seed.jobs) {
          await this.runJob(
            tx,
            jobId,
            this.config.seed.jobs?.[jobId]?.continueOnError,
          );
        }
      }

      if (seedTests === true) {
        for (const testId in this.config.seed.tests) {
          await this.runTest(
            tx,
            testId,
            this.config.seed.tests?.[testId]?.continueOnError,
          );
        }
      }
    });
  }
}

export default Seed;
