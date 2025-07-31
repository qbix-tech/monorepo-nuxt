/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DeepPartial } from "ts-essentials";
import type { SerializeObject } from "../types/json-object";

/**
 * Determines whether the provided value is a plain JavaScript object.
 *
 * A plain object is defined as an object that:
 * - Is not null
 * - Has prototype of Object.prototype or null
 * - Is not an iterable
 * - Is not a module
 *
 * @example
 * ```ts
 * isPlainObject({}) // true
 * isPlainObject({ a: 1 }) // true
 * isPlainObject(Object.create(null)) // true
 * isPlainObject([]) // false
 * isPlainObject(null) // false
 * isPlainObject(new Date()) // false
 * ```
 */
export const isPlainObject = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);

  if (
    prototype !== null &&
    prototype !== Object.prototype &&
    Object.getPrototypeOf(prototype) !== null
  ) {
    return false;
  }

  if (Symbol.iterator in value) {
    return false;
  }

  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }

  return true;
};

/**
 * Checks if an object is empty, aka. `{}`.
 */
export const isObjectEmpty = (data: unknown): boolean => {
  return (
    data === null ||
    data === undefined ||
    (typeof data === "object" && Object.keys(data).length === 0) ||
    (Array.isArray(data) && data.length === 0)
  );
};

/**
 * Deeply merges two objects, creating a new object without modifying either input object.
 *
 * Properties from `assignObject` will override properties in `baseObject`.
 * If both objects have an object at the same key, those objects are recursively merged.
 * Null values in `assignObject` will set the corresponding property to undefined, unless `opts.assignNullAsNull = true`, in which case, the property will be explicitly set null.
 * Undefined values in `assignObject` are skipped.
 *
 * @example
 * ```ts
 * // Simple merge
 * const base = { a: 1, b: 2 };
 * const assign = { b: 3, c: 4 };
 * mergeObject(base, assign); // { a: 1, b: 3, c: 4 }
 *
 * // Deep merge
 * const baseNested = { user: { name: 'John', age: 30 } };
 * const assignNested = { user: { age: 31, city: 'New York' } };
 * mergeObject(baseNested, assignNested);
 * // { user: { name: 'John', age: 31, city: 'New York' } }
 *
 * // Handling null values
 * const baseWithProps = { a: 1, b: 2 };
 * const assignWithNull = { b: null };
 * mergeObject(baseWithProps, assignWithNull); // { a: 1 }
 * mergeObject(baseWithProps, assignWithNull, { assignNullAsNull: true }); // { a: 1, b: null }
 * ```
 */
export const mergeObject = <T extends Record<string | number, any>>(
  baseObject: T,
  assignObject: DeepPartial<T>,
  opts?: { assignNullAsNull?: boolean },
): T => {
  if (!isPlainObject(assignObject)) {
    return mergeObject(baseObject, {} as DeepPartial<T>);
  }

  const object: T = Object.assign({}, baseObject);

  for (const key in assignObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }

    const value = assignObject[key];

    if (value === undefined) {
      continue;
    }

    if (value === null) {
      if (opts?.assignNullAsNull) {
        (object as any)[key] = null;
      } else {
        (object as any)[key] = undefined;
      }
      continue;
    }

    if (isPlainObject(value) && isPlainObject(object[key])) {
      (object as any)[key] = mergeObject(object[key], value as any);
    } else {
      (object as any)[key] = value;
    }
  }

  return object;
};

export const serializeObject = <T extends object>(
  data: T,
): SerializeObject<T> => {
  return JSON.parse(JSON.stringify(data));
};

/**
 * Create a new subset object by omit giving keys
 */
export const objectOmit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  const result = structuredClone(obj);
  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete result[key];
  }
  return result;
};

/**
 * Create a new subset object by picking using a given predicate to test if true
 */
export const pickBy = <T>(
  obj: T,
  predicate: (value: T[keyof T]) => boolean,
): Partial<T> => {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (predicate(obj[key])) {
      result[key] = obj[key];
    }
  }
  return result;
};

/**
 * Create a new subset object by omitting using a given predicate to test if true
 */
export const omitBy = <T>(
  obj: T,
  predicate: (value: T[keyof T]) => boolean,
): Partial<T> => {
  return pickBy(obj, (value) => !predicate(value));
};

/**
 * Omit properties from an object by key path(s), supporting nested properties using dot notation.
 *
 * @example
 * // Removes the nested 'bar' property
 * const obj = { foo: { bar: 123, baz: 456 } };
 * const result = objectOmitByKeys(obj, ['foo.bar']); // { foo: { baz: 456 } }
 *
 * @example
 * // Removes multiple properties
 * const obj = { a: 1, b: 2, foo: { bar: 123, baz: 456 } };
 * const result = objectOmitByKeys(obj, ['a', 'foo.bar']); // { b: 2, foo: { baz: 456 } }
 *
 * @param obj - The source object to create a modified copy from
 * @param paths - Array of strings representing property paths to remove, with nested properties
 *               separated by dots (e.g., 'parent.child.grandchild')
 * @returns A new object with the specified properties removed
 */
export const objectOmitByKeys = <T extends object>(
  obj: T,
  paths: string[],
): T => {
  if (paths.length === 0) {
    return structuredClone(obj);
  }

  const cloneObj = structuredClone(obj);

  for (const path of paths) {
    const keys = path.split(".");
    let current: any = cloneObj;
    let valid = true;

    for (let i = 0; i < keys.length - 1; i++) {
      const currentKey = keys[i] as keyof typeof current;
      if (current[currentKey] === undefined) {
        valid = false;
        break;
      }
      current = current[currentKey];
    }

    if (valid) {
      const lastKey = keys[keys.length - 1] as keyof typeof current;
      if (current[lastKey] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete current[lastKey];
      }
    }
  }

  return cloneObj;
};

/**
 * Omit a property from an object by key path, supporting nested properties using dot notation.
 */
export const objectOmitByKey = <T extends object, K extends string>(
  obj: T,
  key: K,
): T => {
  return objectOmitByKeys(obj, [key]);
};

export { deepEqual } from "fast-equals";
export { default as objectHash } from "object-hash";
export type { DeepPartial } from "ts-essentials";
