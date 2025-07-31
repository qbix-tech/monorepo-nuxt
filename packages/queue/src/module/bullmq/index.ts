/* eslint-disable @typescript-eslint/no-explicit-any */
import type { QueueOptions, Processor, WorkerOptions } from "bullmq";
import { Queue, Worker } from "bullmq";
import { defu } from "defu";
import { Redis } from "ioredis";

const QUEUE_PREFIX = "queue:bullmq" as const;

const DEFAULT_QUEUE_OPTS = {
  defaultJobOptions: {
    removeOnComplete: true,
  },
} as const;

const DEFAULT_WORKER_OPTS = {
  concurrency: 10,
} as const;

// we use a queue map to store queue instances, so that we can reuse them
const queueMap = new Map<string, Queue>();

/**
 * Creates or retrieves a queue instance for the given type.
 */
export const useQueue = <
  DataType = any,
  ResultType = any,
  NameType extends string = string,
>(
  type: string,
  opts?: Partial<Omit<QueueOptions, "connection" | "prefix">>,
) => {
  if (queueMap.has(type)) {
    return queueMap.get(type)! as Queue<DataType, ResultType, NameType>;
  }

  const { REDIS_URL } = process.env;
  if (!REDIS_URL) throw new Error("env REDIS_URL is not defined");

  opts = defu(opts, DEFAULT_QUEUE_OPTS);

  const connection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 5,
  });

  queueMap.set(
    type,
    new Queue<DataType, ResultType, NameType>(type, {
      ...opts,
      connection,
      prefix: QUEUE_PREFIX,
    }),
  );

  return queueMap.get(type) as Queue<DataType, ResultType, NameType>;
};

/**
 * Creates a worker instance for the given type.
 */
export const useWorker = <
  DataType = any,
  ResultType = any,
  NameType extends string = string,
>(
  type: string,
  fn: string | URL | Processor<DataType, ResultType, NameType>,
  opts: Partial<Omit<WorkerOptions, "connection" | "prefix">>,
) => {
  const { REDIS_URL } = process.env;
  if (!REDIS_URL) throw new Error("env REDIS_URL is not defined");

  opts = defu(opts, DEFAULT_WORKER_OPTS);

  const connection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
  });
  return new Worker<DataType, ResultType, NameType>(type, fn, {
    ...opts,
    connection,
    prefix: QUEUE_PREFIX,
  });
};
