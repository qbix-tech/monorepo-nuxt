import {
  toDate,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  addBusinessDays,
} from "date-fns";
import { tz, TZDate } from "@date-fns/tz";

export const AsiaSingapore = "Asia/Singapore" as const;
export const GMT8 = tz(AsiaSingapore);

/**
 * Coerces a date to a Date object, using `toDate()` from date-fns.
 *
 * @param date - The date to coerce.
 *
 * @returns The coerced Date object.
 */
export const coerceDate = (date?: Parameters<typeof toDate>[0]) =>
  toDate(date ?? new Date());

/**
 * Converts a date to a TZDate object in the specified timezone. Defaults to `Asia/Singapore`.
 */
export const withDateContext = (date: Date, tz: string = AsiaSingapore) => {
  return new TZDate(date, tz);
};

/**
 * Wrapper for date-fns startOfDay function with sensible date coercion using `toDate()`
 * and will compute in `GMT+8` regardless of the server's or client's timezone.
 *
 * @param date defaults to the current date if no date is provided.
 *
 * @returns the start of the date for the given date.
 */
export const getStartOfDay = (date?: Parameters<typeof toDate>[0]) => {
  return startOfDay(coerceDate(date), { in: GMT8 });
};

/**
 * Wrapper for date-fns endOfDay function with sensible date coercion using `toDate()`
 * and will compute in `GMT+8` regardless of the server's or client's timezone.
 *
 * @param date defaults to the current date if no date is provided.
 * @param exclusiveEnd - If true, returns the end of the day as the start of the next day
 *
 * @returns the end of the day for the given date.
 */
export const getEndOfDay = (
  date?: Parameters<typeof toDate>[0],
  exclusiveEnd?: boolean,
) => {
  const result = endOfDay(coerceDate(date), { in: GMT8 });
  if (exclusiveEnd) {
    return new Date(result.getTime() + 1);
  }
  return result;
};

/**
 * Wrapper for date-fns startOfWeek function with sensible date coercion using `toDate()`
 * and will compute in `GMT+8` regardless of the server's or client's timezone.
 *
 * @param date defaults to the current date if no date is provided.
 *
 * @returns the start of the week for the given date, with week starting on Monday.
 */
export const getStartOfWeek = (date?: Parameters<typeof toDate>[0]) => {
  return startOfWeek(coerceDate(date), { weekStartsOn: 1, in: GMT8 });
};

/**
 * Wrapper for date-fns endOfWeek function with sensible date coercion using `toDate()`
 * and will compute in `GMT+8` regardless of the server's or client's timezone.
 *
 * @param date defaults to the current date if no date is provided.
 * @param exclusiveEnd - If true, returns the end of the day as the start of the next day
 *
 * @returns the end of the week for the given date, with week starting on Monday.
 */
export const getEndOfWeek = (
  date?: Parameters<typeof toDate>[0],
  exclusiveEnd?: boolean,
) => {
  const result = endOfWeek(coerceDate(date), {
    weekStartsOn: 1,
    in: GMT8,
  });
  if (exclusiveEnd) {
    return new Date(result.getTime() + 1);
  }
  return result;
};

/**
 * Wrapper for date-fns startOfMonth function with sensible date coercion using `toDate()`
 * and will compute in `GMT+8` regardless of the server's or client's timezone.
 *
 * @param date defaults to the current date if no date is provided.
 *
 * @returns the start of the month for the given date.
 */
export const getStartOfMonth = (date?: Parameters<typeof toDate>[0]) => {
  return startOfMonth(coerceDate(date), { in: GMT8 });
};

/**
 * Wrapper for date-fns endOfMonth function with sensible date coercion using `toDate()`
 * and will compute in `GMT+8` regardless of the server's or client's timezone.
 *
 * @param date defaults to the current date if no date is provided.
 * @param exclusiveEnd - If true, returns the end of the day as the start of the next day
 *
 * @returns the end of the month for the given date.
 */
export const getEndOfMonth = (
  date?: Parameters<typeof toDate>[0],
  exclusiveEnd?: boolean,
) => {
  const result = endOfMonth(coerceDate(date), { in: GMT8 });
  if (exclusiveEnd) {
    return new Date(result.getTime() + 1);
  }
  return result;
};

/**
 * Wrapper for date-fns startOfQuarter function with sensible date coercion using `toDate()`
 * and will compute in `GMT+8` regardless of the server's or client's timezone.
 *
 * @param date defaults to the current date if no date is provided.
 * @param exclusiveEnd - If true, returns the end of the day as the start of the next day
 *
 * @returns the end of the month for the given date.
 */
export const getStartOfQuarter = (
  date?: Parameters<typeof toDate>[0],
  exclusiveEnd?: boolean,
) => {
  const result = startOfQuarter(coerceDate(date), { in: GMT8 });
  if (exclusiveEnd) {
    return new Date(result.getTime() + 1);
  }
  return result;
};

/**
 * Wrapper for date-fns endOfQuarter function with sensible date coercion using `toDate()`
 * and will compute in `GMT+8` regardless of the server's or client's timezone.
 *
 * @param date defaults to the current date if no date is provided.
 * @param exclusiveEnd - If true, returns the end of the day as the start of the next day
 *
 * @returns the end of the month for the given date.
 */
export const getEndOfQuarter = (
  date?: Parameters<typeof toDate>[0],
  exclusiveEnd?: boolean,
) => {
  const result = endOfQuarter(coerceDate(date), { in: GMT8 });
  if (exclusiveEnd) {
    return new Date(result.getTime() + 1);
  }
  return result;
};

/**
 * Wrapper for date-fns startOfYear function with sensible date coercion using `toDate()`
 * and will compute in `GMT+8` regardless of the server's or client's timezone.
 *
 * @param date defaults to the current date if no date is provided.
 * @param exclusiveEnd - If true, returns the end of the day as the start of the next day
 *
 * @returns the end of the month for the given date.
 */
export const getStartOfYear = (
  date?: Parameters<typeof toDate>[0],
  exclusiveEnd?: boolean,
) => {
  const result = startOfYear(coerceDate(date), { in: GMT8 });
  if (exclusiveEnd) {
    return new Date(result.getTime() + 1);
  }
  return result;
};

/**
 * Wrapper for date-fns endOfYear function with sensible date coercion using `toDate()`
 * and will compute in `GMT+8` regardless of the server's or client's timezone.
 *
 * @param date defaults to the current date if no date is provided.
 * @param exclusiveEnd - If true, returns the end of the day as the start of the next day
 *
 * @returns the end of the month for the given date.
 */
export const getEndOfYear = (
  date?: Parameters<typeof toDate>[0],
  exclusiveEnd?: boolean,
) => {
  const result = endOfYear(coerceDate(date), { in: GMT8 });
  if (exclusiveEnd) {
    return new Date(result.getTime() + 1);
  }
  return result;
};

/**
 * Wrapper for date-fns addBusinessDays with sensible date coercion using `toDate()`
 * and will compute in `GMT+8` regardless of the server's or client's timezone.
 *
 * @param date defaults to the current date if no date is provided.
 *
 * @returns the next business day for the given date
 */
export const getNextBusinessDay = (
  date?: Parameters<typeof toDate>[0],
  amount: number = 1,
) => {
  return addBusinessDays(coerceDate(date), amount, { in: GMT8 });
};
