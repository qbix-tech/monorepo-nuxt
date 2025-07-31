/**
 * Extracts the key of a Map type.
 *
 * @example
 * type MapType = Map<"A" | "B" | "C", number>;
 * type Key = KeyOfMap<MapType>; // "A" | "B" | "C"
 */
export type KeyOfMap<M extends Map<unknown, unknown>> =
  M extends Map<infer K, unknown> ? K : never;

/**
 * Makes specified properties of a type optional while keeping others as is.
 *
 * @example
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * // Make email optional
 * type OptionalEmailUser = Optional<User, 'email'>;
 * // Result: { id: number; name: string; email?: string; }
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Recursively make every properties undefineable (useful for forms)
 *
 * @example
 * type Schema = {
 *   id: string,
 *   name: string,
 *   children: {
 *     id: string,
 *     name: string,
 *   }[]
 * }
 *
 * type OptionalAllSchema = OptionalAll<Schema>
 * // Result: { id?: string, name?: string, children: ({ id?: string, name?: string} | {} | undefined)[] }
 */
export type OptionalAll<T> = T extends Date
  ? T | undefined
  : T extends Array<infer U>
    ? Array<OptionalAll<U> | object | undefined>
    : T extends object
      ? {
          [P in keyof T]: P extends keyof T
            ? T[P] extends Array<infer V>
              ? Array<OptionalAll<V> | object | undefined>
              : OptionalAll<T[P]> | undefined
            : never;
        }
      : T | undefined;

/**
 * Makes specified properties of a type required while keeping others as is.
 *
 * @example
 * interface User {
 *   id?: number;
 *   name?: string;
 *   email?: string;
 * }
 *
 * // Make id and email required
 * type RequiredIdEmailUser = Mandatory<User, 'id' | 'email'>;
 * // Result: { id: number; name?: string; email: string; }
 */
export type Mandatory<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Simplifies an object type to its most basic representation.
 *
 * @example
 * // Input type with intersection
 * type Complex = { a: string } & { b: number };
 *
 * // Using Prettify to simplify
 * type Simple = Prettify<Complex>;
 * // Result: { a: string; b: number }
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Simplifies an object or array type recursively to its most basic representation.
 *
 * @example
 * // Complex nested type
 * type Complex = Array<
 *   SerializeObject<{
 *     data: Array<SerializeObject<{ date: number } & { name: string } & { amount: number }>>;
 *     metadata: { date: Date } & { name: string } & { amount: number };
 *   }>
 * >;
 *
 * // Using Simplify to flatten the structure
 * type Simple = Simplify<Complex>;
 * // Result: {
 * //   data: { date: string; name: string; amount: number }[];
 * //   metadata: { date: string; name: string; amount: number };
 * // }[]
 */
export type Simplify<T> =
  T extends Array<infer Shape>
    ? Array<Simplify<Shape>>
    : T extends Date
      ? Date
      : T extends object
        ? {
            [K in keyof T]: Simplify<T[K]>;
          }
        : T;
