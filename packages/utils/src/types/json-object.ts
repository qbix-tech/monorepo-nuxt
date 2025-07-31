/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

export type JSONPrimitive =
  | string
  | number
  | boolean
  | JSONObject
  | null
  | undefined;

export type JSONObject = { [key: string]: JSONPrimitive } | JSONObject[];

export type NonJSONPrimitive = undefined | Function | symbol;

export type IsAny<T> = 0 extends 1 & T ? true : false;

export type FilterKeys<TObj extends object, TFilter> = {
  [TKey in keyof TObj]: TObj[TKey] extends TFilter ? TKey : never;
}[keyof TObj];

export type Serialize<T> =
  IsAny<T> extends true
    ? any
    : T extends JSONPrimitive | undefined
      ? T
      : T extends Map<any, any> | Set<any>
        ? Record<string, never>
        : T extends NonJSONPrimitive
          ? never
          : T extends {
                toJSON(): infer U;
              }
            ? U
            : T extends []
              ? []
              : T extends [unknown, ...unknown[]]
                ? SerializeTuple<T>
                : T extends ReadonlyArray<infer U>
                  ? (U extends NonJSONPrimitive ? null : Serialize<U>)[]
                  : T extends object
                    ? SerializeObject<T>
                    : never;

/** JSON serialize [tuples](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) */
export type SerializeTuple<T extends [unknown, ...unknown[]]> = {
  [k in keyof T]: T[k] extends NonJSONPrimitive ? null : Serialize<T[k]>;
};

/** JSON serialize objects (not including arrays) and classes */
export type SerializeObject<T extends object> = {
  [k in keyof Omit<T, FilterKeys<T, NonJSONPrimitive>>]: Serialize<T[k]>;
};
