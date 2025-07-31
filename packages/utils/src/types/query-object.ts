/* eslint-disable @typescript-eslint/no-explicit-any */

export type QueryValue =
  | string
  | number
  | undefined
  | null
  | boolean
  | Array<QueryValue>
  | Record<string, any>;

export type QueryObject = Record<string, QueryValue | QueryValue[]>;
