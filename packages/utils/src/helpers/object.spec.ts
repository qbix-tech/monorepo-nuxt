import { describe, it, expect } from "vitest";
import {
  isPlainObject,
  mergeObject,
  objectOmitByKey,
  objectOmitByKeys,
} from "./object";

describe("isPlainObject", () => {
  it("should return true for plain objects", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1, b: 2 })).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it("should return false for null", () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it("should return false for non-objects", () => {
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject(123)).toBe(false);
    expect(isPlainObject("string")).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(Symbol("test"))).toBe(false);
  });

  it("should return false for arrays", () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject([1, 2, 3])).toBe(false);
  });

  it("should return false for instances of classes", () => {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class TestClass {}
    expect(isPlainObject(new TestClass())).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(new Map())).toBe(false);
    expect(isPlainObject(new Set())).toBe(false);
  });

  it("should return false for objects with Symbol.iterator", () => {
    const objWithIterator = {
      [Symbol.iterator]: function* () {
        yield 1;
        yield 2;
      },
    };
    expect(isPlainObject(objWithIterator)).toBe(false);
  });

  it("should handle objects with Symbol.toStringTag correctly", () => {
    const module = { [Symbol.toStringTag]: "Module" };
    Object.defineProperty(module, Symbol.toStringTag, {
      value: "Module",
      enumerable: false,
    });
    expect(isPlainObject(module)).toBe(true);

    const nonModule = { [Symbol.toStringTag]: "NotModule" };
    Object.defineProperty(nonModule, Symbol.toStringTag, {
      value: "NotModule",
      enumerable: false,
    });
    expect(isPlainObject(nonModule)).toBe(false);
  });
});

describe("mergeObject", () => {
  it("should merge two simple objects", () => {
    const base = { a: 1, b: 2 };
    const assign = { b: 3, c: 4 };
    const result = mergeObject(base, assign);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
    // Ensure original objects weren't modified
    expect(base).toEqual({ a: 1, b: 2 });
    expect(assign).toEqual({ b: 3, c: 4 });
  });

  it("should deep merge nested objects", () => {
    const base = { a: 1, b: { x: 1, y: 2 } };
    const assign = { b: { y: 3, z: 4 } };
    const result = mergeObject(base, assign);

    expect(result).toEqual({ a: 1, b: { x: 1, y: 3, z: 4 } });
    // Ensure deep properties of original objects weren't modified
    expect(base.b).toEqual({ x: 1, y: 2 });
  });

  it("should handle null values", () => {
    const base = { a: 1, b: { x: 1 } };
    const assign = { a: null, b: null };
    // @ts-expect-error simulating invalid assignment
    const result = mergeObject(base, assign);

    expect(result).toEqual({});
  });

  it("should handle null values by explicitly set null", () => {
    const base = { a: 1, b: { x: 1 } };
    const assign = { a: null, b: null };
    // @ts-expect-error simulating invalid assignment
    const result = mergeObject(base, assign, { assignNullAsNull: true });

    expect(result).toEqual({ a: null, b: null });
  });

  it("should ignore undefined values", () => {
    const base = { a: 1, b: 2 };
    const assign = { a: undefined, c: 3 };
    const result = mergeObject(base, assign);

    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("should ignore __proto__ and constructor properties", () => {
    const base = { a: 1 };
    const assign = { __proto__: { malicious: true }, constructor: Function };
    // @ts-expect-error simulating invalid assignment
    const result = mergeObject(base, assign);

    expect(result).toEqual({ a: 1 });
    // @ts-expect-error simulating invalid assignment
    expect(result.malicious).toBeUndefined();
    expect(Object.getPrototypeOf(result)).toEqual(Object.getPrototypeOf({}));
  });

  it("should return a copy of base object when assign object is not a plain object", () => {
    const base = { a: 1 };
    const nonObjectValues = [null, undefined, 1, "string", [], new Date()];

    nonObjectValues.forEach((value) => {
      // @ts-expect-error simulating invalid assignment
      const result = mergeObject(base, value);
      expect(result).toEqual({ a: 1 });
      expect(result).not.toBe(base); // Should be a new object
    });
  });

  it("should overwrite non-object properties with object properties", () => {
    const base = { a: 1, b: "string" };
    const assign = { a: { nested: true }, b: { nested: true } };
    // @ts-expect-error simulating invalid assignment
    const result = mergeObject(base, assign);

    expect(result).toEqual({
      a: { nested: true },
      b: { nested: true },
    });
  });

  it("should overwrite object properties with non-object properties", () => {
    const base = { a: { nested: true }, b: { nested: true } };
    const assign = { a: 1, b: "string" };
    // @ts-expect-error simulating invalid assignment
    const result = mergeObject(base, assign);

    expect(result).toEqual({ a: 1, b: "string" });
  });

  it("should handle complex nested objects", () => {
    const base = {
      user: {
        name: "John",
        preferences: {
          theme: "light",
          notifications: {
            email: true,
            push: false,
          },
        },
      },
      settings: {
        global: {
          language: "en",
        },
      },
    };

    const assign = {
      user: {
        age: 30,
        preferences: {
          notifications: {
            push: true,
            sms: false,
          },
        },
      },
      settings: {
        global: {
          timezone: "UTC",
        },
        security: {
          twoFactor: true,
        },
      },
    };

    // @ts-expect-error simulating invalid assignment
    const result = mergeObject(base, assign);

    expect(result).toEqual({
      user: {
        name: "John",
        age: 30,
        preferences: {
          theme: "light",
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
        },
      },
      settings: {
        global: {
          language: "en",
          timezone: "UTC",
        },
        security: {
          twoFactor: true,
        },
      },
    });
  });

  it("should handle arrays as assign values (overwrite, not merge)", () => {
    const base = { items: [1, 2, 3] };
    const assign = { items: [4, 5, 6] };
    const result = mergeObject(base, assign);

    expect(result.items).toEqual([4, 5, 6]);
  });

  it("should handle functions in objects", () => {
    const fn1 = () => "base";
    const fn2 = () => "assign";

    const base = { func: fn1 };
    const assign = { func: fn2 };
    const result = mergeObject(base, assign);

    expect(result.func).toBe(fn2);
    expect(result.func()).toBe("assign");
  });

  it("should handle Date objects (overwrite, not merge)", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-02-01");

    const base = { date: date1 };
    const assign = { date: date2 };
    const result = mergeObject(base, assign);

    expect(result.date).toBe(date2);
  });

  it("should handle multiple levels of recursion", () => {
    const base = {
      level1: {
        level2: {
          level3: {
            level4: {
              value: "base",
            },
          },
        },
      },
    };

    const assign = {
      level1: {
        level2: {
          level3: {
            level4: {
              value: "assign",
            },
          },
        },
      },
    };

    const result = mergeObject(base, assign);

    expect(result.level1.level2.level3.level4.value).toBe("assign");
  });
});

describe("objectOmitByKeys", () => {
  it("should remove a top-level property", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = objectOmitByKeys(obj, ["b"]);

    expect(result).toEqual({ a: 1, c: 3 });
    // Ensure original object wasn't modified
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("should remove multiple top-level properties", () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    const result = objectOmitByKeys(obj, ["a", "c"]);

    expect(result).toEqual({ b: 2, d: 4 });
  });

  it("should remove a nested property using dot notation", () => {
    const obj = {
      user: {
        name: "John",
        details: {
          age: 30,
          email: "john@example.com",
        },
      },
      settings: { theme: "dark" },
    };

    const result = objectOmitByKeys(obj, ["user.details.email"]);

    expect(result).toEqual({
      user: {
        name: "John",
        details: {
          age: 30,
        },
      },
      settings: { theme: "dark" },
    });
  });

  it("should remove multiple nested properties", () => {
    const obj = {
      a: {
        b: { c: 1, d: 2 },
        e: 3,
      },
      f: 4,
    };

    const result = objectOmitByKeys(obj, ["a.b.c", "a.e", "f"]);

    expect(result).toEqual({
      a: {
        b: { d: 2 },
      },
    });
  });

  it("should handle non-existent properties gracefully", () => {
    const obj = { a: 1, b: { c: 2 } };
    const result = objectOmitByKeys(obj, ["d", "b.x", "b.c.d"]);

    // Should not change anything since paths don't exist
    expect(result).toEqual({ a: 1, b: { c: 2 } });
  });

  it("should handle empty keys array", () => {
    const obj = { a: 1, b: 2 };
    const result = objectOmitByKeys(obj, []);

    // Should return a clone of the original object
    expect(result).toEqual(obj);
    expect(result).not.toBe(obj);
  });

  it("should handle nested arrays correctly", () => {
    const obj = {
      items: [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ],
    };

    // Remove the name property from the second item
    const result = objectOmitByKeys(obj, ["items.1.name"]);

    expect(result).toEqual({
      items: [{ id: 1, name: "Item 1" }, { id: 2 }],
    });
  });
});

describe("objectOmitByKey", () => {
  it("should call objectOmitByKeys with a single key", () => {
    const obj = { a: 1, b: { c: 2, d: 3 } };

    const result = objectOmitByKey(obj, "b.c");

    expect(result).toEqual({ a: 1, b: { d: 3 } });
  });
});
