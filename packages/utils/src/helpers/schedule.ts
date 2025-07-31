/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  add,
  addMilliseconds,
  differenceInCalendarDays,
  areIntervalsOverlapping,
  differenceInCalendarMonths,
  interval,
  min,
  monthsToQuarters,
  monthsToYears,
  subMilliseconds,
  isEqual,
  roundToNearestMinutes,
} from "date-fns";
import { tz } from "@date-fns/tz";

const AsiaSingapore = "Asia/Singapore" as const;
const GMT8 = tz(AsiaSingapore);

/**
 * A safer `tryUseNuxtApp()` compasable than the one provided by Nuxt, literally...
 *
 * Returns the current Nuxt instance.
 *
 * Returns `null` if Nuxt instance is unavailable.
 */
const tryNuxtApp = () => {
  try {
    // @ts-expect-error compatibility with nuxt only
    return tryUseNuxtApp();
  } catch {
    return null;
  }
};

/**
 * Represents a schedule with start and end dates
 */
export type Schedule = {
  [key: string]: any;
  start: Date;
  end: Date;
};

/**
 * Represents a schedule with start and end dates serializeble
 */
export type ScheduleSerializable = {
  [key: string]: any;
  start: Date | string;
  end: Date | string;
};

/**
 * Represents a generated schedule with start date, end date, and days
 */
export type GeneratedScheduleResult = {
  start: Date;
  end: Date;
  days: number;
};

/**
 * Represents a gap between schedules
 */
export type ScheduleGap = {
  start: Date;
  end: Date;
};

/**
 * Sorts an array of schedules by start or end date.
 * @param opts.key - The key to sort by, either "start" or "end". Defaults to "start".
 * @param opts.order - The order to sort by, either "asc" or "desc". Defaults to "asc".
 */
export const sortIntervals = <T extends Partial<Schedule>>(
  schedules: T[],
  opts?: { key?: "start" | "end"; order?: "asc" | "desc" },
): T[] => {
  const key = opts?.key || "start";
  const order = opts?.order || "asc";

  const schedulesWithoutDates = schedules.filter((s) => !s[key]);
  const schedulesWithDates = schedules.filter((s) => s[key]);

  const result = [...schedulesWithDates].sort((a, b) => {
    const aValue = a[key]!.getTime();
    const bValue = b[key]!.getTime();

    if (order === "asc") {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  return [...result, ...schedulesWithoutDates];
};

/**
 * Checks if two schedules overlap
 * @deprecated Use `areIntervalsOverlapping` from date-fns instead
 * @param scheduleA The first schedule
 * @param scheduleB The second schedule
 * @param allowBoundaryOverlap Whether to allow schedules to share boundary dates (exclusive comparison)
 * @returns True if the schedules overlap, false otherwise
 */
export const doSchedulesOverlap = (
  scheduleA: Schedule,
  scheduleB: Schedule,
  allowBoundaryOverlap: boolean = false,
): boolean => {
  if (allowBoundaryOverlap) {
    // Using strict inequality (<, >) allows back-to-back schedules
    return scheduleA.start < scheduleB.end && scheduleA.end > scheduleB.start;
  } else {
    // Using non-strict inequality (<=, >=) considers boundary overlaps
    return scheduleA.start <= scheduleB.end && scheduleA.end >= scheduleB.start;
  }
};

/**
 * Returns all schedules that overlap with other schedules in the input array
 * @param schedules Array of schedules to check for overlaps
 * @param allowBoundaryOverlap Whether to allow schedules to share boundary dates (exclusive comparison)
 * @returns Array of schedules that overlap with other schedules
 */
export const getOverlappingSchedules = <T extends Schedule>(
  schedules: T[],
  allowBoundaryOverlap: boolean = false,
): T[] => {
  return schedules.filter((schedule, index) => {
    return schedules.some((otherSchedule, otherIndex) => {
      if (index === otherIndex) return false;
      return areIntervalsOverlapping(schedule, otherSchedule, {
        inclusive: !allowBoundaryOverlap,
      });
    });
  });
};

/**
 * Finds gaps (void periods) between schedules
 * @param schedules Array of schedules to check for gaps
 * @returns Array of gaps between schedules, empty if no real gaps exist
 */
export const findScheduleGaps = (schedules: Schedule[]): ScheduleGap[] => {
  if (schedules.length <= 1) {
    return [];
  }

  // Sort schedules by start date
  const sortedSchedules = sortIntervals(schedules);

  // First pass: combine overlapping or adjacent schedules
  const periods: Schedule[] = [];
  let currentPeriod: Schedule | null = null;

  for (const schedule of sortedSchedules) {
    if (!currentPeriod) {
      currentPeriod = { ...schedule };
      continue;
    }

    // Check for overlap or exact boundary match (millisecond precision)
    // Example: one ends at 2023-01-10T15:59:59.999Z and next starts at 2023-01-10T16:00:00.000Z - no gap
    const exactBoundary = isEqual(
      schedule.start,
      addMilliseconds(currentPeriod.end, 1),
    );

    if (
      areIntervalsOverlapping(currentPeriod, schedule, { inclusive: true }) ||
      exactBoundary
    ) {
      // Extend the period if needed
      if (schedule.end.getTime() > currentPeriod.end.getTime()) {
        currentPeriod.end = schedule.end;
      }
    } else {
      // No overlap or exact boundary - save current period and start a new one
      periods.push(currentPeriod);
      currentPeriod = { ...schedule };
    }
  }

  // Add the last period
  if (currentPeriod) {
    periods.push(currentPeriod);
  }

  // Now find gaps between these consolidated periods
  const gaps: ScheduleGap[] = [];

  for (let i = 0; i < periods.length - 1; i++) {
    const current = periods[i];
    const next = periods[i + 1];

    // Skip if either period is undefined
    if (!current || !next) continue;

    // Only create gaps when there's actually time between periods
    // For millisecond precision, if next.startDate is later than current.end + 1ms
    if (next.start > addMilliseconds(current.end, 1)) {
      gaps.push({
        // Set gap start to 1ms after current.end
        start: addMilliseconds(current.end, 1),
        // Set gap end to 1ms before next.start
        end: subMilliseconds(next.start, 1),
      });
    }
  }

  return gaps;
};

/**
 * Checks if there are any gaps (void periods) between the given schedules
 * @param schedules Array of schedules to check for gaps
 * @returns True if there are gaps between schedules, false otherwise
 */
export const hasScheduleGaps = (schedules: Schedule[]): boolean => {
  return findScheduleGaps(schedules).length > 0;
};

/**
 * Generates monthly schedules for a given time period.
 * @param exactBoundary If true, the schedule will generate exact boundary dates, i.e.
 * { start: "2023-01-10T16:00:00.000Z", end: "2023-02-10T15:59:59.999Z"}. Defaults true in
 * browser and during SSR.
 */
export const generateMonthlySchedules = (
  { start, end }: { start: Date; end: Date },
  { exactBoundary }: { exactBoundary?: boolean } = {},
): GeneratedScheduleResult[] => {
  if (exactBoundary === undefined) {
    try {
      exactBoundary =
        // @ts-expect-error compatibility with nuxt only
        import.meta.browser || // in browser, default true
        // @ts-expect-error compatibility with nuxt only
        (import.meta.server && tryNuxtApp()?.payload?.serverRendered); // during SSR, default true
    } catch {
      exactBoundary = false;
    }
  }

  // validate start and end dates
  ({ start, end } = interval(start, end));

  const totalMonths = differenceInCalendarMonths(
    end,
    addMilliseconds(start.getTime(), 1), // we add 1ms to be compatible with and without exact boundary
    { in: GMT8 },
  );

  const schedules: GeneratedScheduleResult[] = [];
  let current = start;

  for (let i = 0; i < totalMonths; i++) {
    const next = min([add(current, { months: 1 }), end]);
    schedules.push({
      ...interval(current, exactBoundary ? subMilliseconds(next, 1) : next),
      days: differenceInCalendarDays(next, current, { in: GMT8 }),
    });
    current = next;
  }

  return schedules;
};

/**
 * Generates quarterly schedules for a given time period.
 * @param exactBoundary If true, the schedule will generate exact boundary dates, i.e.
 * { start: "2023-01-10T16:00:00.000Z", end: "2023-02-10T15:59:59.999Z"}. Defaults true in
 * browser and during SSR.
 */
export const generateQuarterlySchedules = (
  { start, end }: { start: Date; end: Date },
  { exactBoundary }: { exactBoundary?: boolean } = {},
): GeneratedScheduleResult[] => {
  if (exactBoundary === undefined) {
    try {
      exactBoundary =
        // @ts-expect-error compatibility with nuxt only
        import.meta.browser || // in browser, default true
        // @ts-expect-error compatibility with nuxt only
        (import.meta.server && tryNuxtApp()?.payload?.serverRendered); // during SSR, default true
    } catch {
      exactBoundary = false;
    }
  }

  // validate start and end dates
  ({ start, end } = interval(start, end));

  const totalMonths = differenceInCalendarMonths(
    end,
    addMilliseconds(start.getTime(), 1), // we add 1ms to be compatible with and without exact boundary
    { in: GMT8 },
  );
  const totalQuarters = monthsToQuarters(totalMonths);

  const schedules: GeneratedScheduleResult[] = [];
  let current = start;

  for (let i = 0; i < totalQuarters; i++) {
    const next = min([add(current, { months: 3 }), end]);
    schedules.push({
      ...interval(current, exactBoundary ? subMilliseconds(next, 1) : next),
      days: differenceInCalendarDays(next, current, { in: GMT8 }),
    });
    current = next;
  }

  return schedules;
};

/**
 * Generates yearly schedules for a given time period.
 * @param exactBoundary If true, the schedule will generate exact boundary dates, i.e.
 * { start: "2023-01-10T16:00:00.000Z", end: "2024-01-10T15:59:59.999Z"}. Defaults true in
 * browser and during SSR.
 */
export const generateYearlySchedules = (
  { start, end }: { start: Date; end: Date },
  { exactBoundary }: { exactBoundary?: boolean } = {},
): GeneratedScheduleResult[] => {
  if (exactBoundary === undefined) {
    try {
      exactBoundary =
        // @ts-expect-error compatibility with nuxt only
        import.meta.browser || // in browser, default true
        // @ts-expect-error compatibility with nuxt only
        (import.meta.server && tryNuxtApp()?.payload?.serverRendered); // during SSR, default true
    } catch {
      exactBoundary = false;
    }
  }

  // validate start and end dates
  ({ start, end } = interval(start, end));

  const totalMonths = differenceInCalendarMonths(
    end,
    addMilliseconds(start.getTime(), 1), // we add 1ms to be compatible with and without exact boundary
    { in: GMT8 },
  );
  const totalYears = monthsToYears(totalMonths);

  const schedules: GeneratedScheduleResult[] = [];
  let current = start;

  for (let i = 0; i < totalYears; i++) {
    const next = min([add(current, { years: 1 }), end]);
    schedules.push({
      ...interval(current, exactBoundary ? subMilliseconds(next, 1) : next),
      days: differenceInCalendarDays(next, current, { in: GMT8 }),
    });
    current = next;
  }

  return schedules;
};

/**
 * Converts an exclusive schedule to an inclusive schedule. If the schedule is already inclusive, it returns the original schedule.
 * @example
 * const schedule = { start: new Date("2023-01-01T16:00:00.000Z"), end: new Date("2023-01-15T16:00:00.000Z") };
 * const inclusiveSchedule = translateExclusiveToInclusive(schedule);
 * //         ^ { start: new Date("2023-01-01T16:00:00.000Z"), end: new Date("2023-01-15T15:59:59.999Z") }
 */
export const translateExclusiveToInclusive = <T extends Schedule>(
  schedule: T,
): T => {
  // If end date doesn't have milliseconds exactly at 0, assume it's already inclusive
  if (schedule.end.getMilliseconds() !== 0) {
    return { ...schedule };
  }

  // Create a copy of the schedule
  const result = { ...schedule };

  // Subtract 1 millisecond from the end date to make it inclusive
  result.end = subMilliseconds(schedule.end, 1);

  return result;
};

/**
 * Converts an inclusive schedule to an exclusive schedule. If the schedule is already exclusive, it returns the original schedule.
 * @example
 * const schedule = { start: new Date("2023-01-01T16:00:00.000Z"), end: new Date("2023-01-15T16:00:00.000Z") };
 * const exclusiveSchedule = translateInclusiveToExclusive(schedule);
 * //         ^ { start: new Date("2023-01-01T16:00:00.000Z"), end: new Date("2023-01-15T15:59:59.999Z") }
 */
export const translateInclusiveToExclusive = <T extends Schedule>(
  schedule: T,
): T => {
  // If end date has milliseconds exactly at 0, assume it's already exclusive
  if (schedule.end.getMilliseconds() === 0) {
    return { ...schedule };
  }

  // Create a copy of the schedule
  const result = { ...schedule };

  // // Add 1 millisecond to the end date to make it exclusive
  // result.end = addMilliseconds(schedule.end, 1);

  // Round to nearest minute ceiling
  result.end = roundToNearestMinutes(schedule.end, { roundingMethod: "ceil" });

  return result;
};
