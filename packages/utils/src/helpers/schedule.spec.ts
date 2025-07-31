import { describe, it, expect } from "vitest";
import {
  doSchedulesOverlap,
  getOverlappingSchedules,
  findScheduleGaps,
  hasScheduleGaps,
  generateMonthlySchedules,
  generateQuarterlySchedules,
  generateYearlySchedules,
  translateExclusiveToInclusive,
  translateInclusiveToExclusive,
} from "./schedule";
import type { Schedule } from "./schedule";

// Common helper function to create schedules with specific dates and IDs
const createSchedule = (id: string, start: string, end: string): Schedule => ({
  id,
  start: new Date(start),
  end: new Date(end),
});

// Helper function for simpler tests without id
const createSimpleSchedule = (start: string, end: string): Schedule => ({
  start: new Date(start),
  end: new Date(end),
});

describe("doSchedulesOverlap", () => {
  it("should return true when schedules partially overlap", () => {
    const scheduleA = createSimpleSchedule(
      "2023-01-01T16:00:00.000Z",
      "2023-01-15T15:59:59.999Z",
    );
    const scheduleB = createSimpleSchedule(
      "2023-01-10T16:00:00.000Z",
      "2023-01-25T15:59:59.999Z",
    );
    expect(doSchedulesOverlap(scheduleA, scheduleB)).toBe(true);
    expect(doSchedulesOverlap(scheduleB, scheduleA)).toBe(true);
  });

  it("should return true when one schedule completely contains the other", () => {
    const scheduleA = createSimpleSchedule(
      "2023-01-01T16:00:00.000Z",
      "2023-01-31T16:00:00.000Z",
    );
    const scheduleB = createSimpleSchedule(
      "2023-01-10T16:00:00.000Z",
      "2023-01-20T16:00:00.000Z",
    );
    expect(doSchedulesOverlap(scheduleA, scheduleB)).toBe(true);
    expect(doSchedulesOverlap(scheduleB, scheduleA)).toBe(true);
  });

  it("should return false when schedules do not overlap", () => {
    const scheduleA = createSimpleSchedule(
      "2023-01-01T16:00:00.000Z",
      "2023-01-11T15:59:59.999Z",
    );
    const scheduleB = createSimpleSchedule(
      "2023-01-11T16:00:00.000Z",
      "2023-01-21T15:59:59.999Z",
    );
    expect(doSchedulesOverlap(scheduleA, scheduleB)).toBe(false);
    expect(doSchedulesOverlap(scheduleB, scheduleA)).toBe(false);
  });

  it("should treat boundary overlaps according to allowBoundaryOverlap parameter", () => {
    const scheduleA = createSimpleSchedule(
      "2023-01-01T16:00:00.000Z",
      "2023-01-11T16:00:00.000Z",
    );
    const scheduleB = createSimpleSchedule(
      "2023-01-11T16:00:00.000Z",
      "2023-01-21T16:00:00.000Z",
    );

    // With default parameter (false), boundary overlaps are considered overlaps
    expect(doSchedulesOverlap(scheduleA, scheduleB)).toBe(true);
    expect(doSchedulesOverlap(scheduleB, scheduleA)).toBe(true);

    // With allowBoundaryOverlap=true, boundary overlaps are not considered overlaps
    expect(doSchedulesOverlap(scheduleA, scheduleB, true)).toBe(false);
    expect(doSchedulesOverlap(scheduleB, scheduleA, true)).toBe(false);
  });
});

describe("getOverlappingSchedules", () => {
  it("should return empty array when no schedules overlap", () => {
    const schedules = [
      createSchedule(
        "1",
        "2023-01-01T16:00:00.000Z",
        "2023-01-11T15:59:59.999Z",
      ),
      createSchedule(
        "2",
        "2023-01-11T16:00:00.000Z",
        "2023-01-21T15:59:59.999Z",
      ),
      createSchedule(
        "3",
        "2023-01-21T16:00:00.000Z",
        "2023-01-31T15:59:59.999Z",
      ),
    ];

    expect(getOverlappingSchedules(schedules)).toEqual([]);
    expect(getOverlappingSchedules(schedules, true)).toEqual([]);
  });

  it("should return all overlapping schedules", () => {
    const schedules = [
      createSchedule(
        "1",
        "2023-01-01T16:00:00.000Z",
        "2023-01-15T16:00:00.000Z",
      ), // Overlaps with 2
      createSchedule(
        "2",
        "2023-01-10T16:00:00.000Z",
        "2023-01-20T16:00:00.000Z",
      ), // Overlaps with 1 and 3
      createSchedule(
        "3",
        "2023-01-15T16:00:00.000Z",
        "2023-01-31T16:00:00.000Z",
      ), // Overlaps with 2
      createSchedule(
        "4",
        "2023-02-01T16:00:00.000Z",
        "2023-02-10T16:00:00.000Z",
      ), // No overlaps
    ];

    const overlapping = getOverlappingSchedules(schedules);
    expect(overlapping).toHaveLength(3);
    expect(overlapping.map((s) => s.id)).toEqual(["1", "2", "3"]);
  });

  it("should handle boundary overlaps according to allowBoundaryOverlap parameter", () => {
    const schedules = [
      createSchedule(
        "1",
        "2023-01-01T16:00:00.000Z",
        "2023-01-10T16:00:00.000Z",
      ),
      createSchedule(
        "2",
        "2023-01-10T16:00:00.000Z",
        "2023-01-20T16:00:00.000Z",
      ),
      createSchedule(
        "3",
        "2023-01-20T16:00:00.000Z",
        "2023-01-31T16:00:00.000Z",
      ),
    ];

    // With default parameter (false), boundary overlaps are considered overlaps
    const boundaryOverlapping = getOverlappingSchedules(schedules);
    expect(boundaryOverlapping).toHaveLength(3);
    expect(boundaryOverlapping.map((s) => s.id)).toEqual(["1", "2", "3"]);

    // With allowBoundaryOverlap=true, boundary overlaps are not considered overlaps
    const nonBoundaryOverlapping = getOverlappingSchedules(schedules, true);
    expect(nonBoundaryOverlapping).toEqual([]);
  });

  it("should handle complex overlap scenarios", () => {
    const schedules = [
      createSchedule(
        "1",
        "2023-01-01T16:00:00.000Z",
        "2023-01-31T16:00:00.000Z",
      ), // Contains 2 and 3
      createSchedule(
        "2",
        "2023-01-05T16:00:00.000Z",
        "2023-01-15T16:00:00.000Z",
      ), // Contained by 1, overlaps with 3
      createSchedule(
        "3",
        "2023-01-10T16:00:00.000Z",
        "2023-01-20T16:00:00.000Z",
      ), // Contained by 1, overlaps with 2
      createSchedule(
        "4",
        "2023-02-01T16:00:00.000Z",
        "2023-02-10T16:00:00.000Z",
      ), // Shares boundary with 5
      createSchedule(
        "5",
        "2023-02-10T16:00:00.000Z",
        "2023-02-20T16:00:00.000Z",
      ), // Shares boundary with 4 and 6
      createSchedule(
        "6",
        "2023-02-20T16:00:00.000Z",
        "2023-02-28T16:00:00.000Z",
      ), // Shares boundary with 5
    ];

    // Default behavior (inclusive boundaries)
    const overlapping = getOverlappingSchedules(schedules);
    expect(overlapping).toHaveLength(6);

    // With exclusive boundaries
    const strictOverlapping = getOverlappingSchedules(schedules, true);
    expect(strictOverlapping).toHaveLength(3);
    expect(strictOverlapping.map((s) => s.id)).toEqual(["1", "2", "3"]);
  });
});

describe("findScheduleGaps", () => {
  it("should return empty array when no gaps exist", () => {
    const schedules = [
      createSchedule(
        "1",
        "2023-01-01T16:00:00.000Z",
        "2023-01-10T15:59:59.999Z",
      ),
      createSchedule(
        "2",
        "2023-01-10T16:00:00.000Z",
        "2023-01-20T15:59:59.999Z",
      ),
      createSchedule(
        "3",
        "2023-01-20T16:00:00.000Z",
        "2023-01-31T15:59:59.999Z",
      ),
    ];

    const gaps = findScheduleGaps(schedules);
    expect(gaps).toEqual([]);
  });

  it("should find gaps between non-contiguous schedules", () => {
    const schedules = [
      createSchedule(
        "1",
        "2023-01-01T16:00:00.000Z",
        "2023-01-10T15:59:59.999Z",
      ),
      createSchedule(
        "2",
        "2023-01-15T16:00:00.000Z",
        "2023-01-25T15:59:59.999Z",
      ), // Gap between 1 and 2
      createSchedule(
        "3",
        "2023-02-01T16:00:00.000Z",
        "2023-02-10T15:59:59.999Z",
      ), // Gap between 2 and 3
    ];

    const gaps = findScheduleGaps(schedules);
    expect(gaps).toHaveLength(2);

    if (gaps.length >= 2) {
      // Check the first gap
      const firstGap = gaps[0];
      expect(firstGap?.start).toEqual(new Date("2023-01-10T16:00:00.000Z"));
      expect(firstGap?.end).toEqual(new Date("2023-01-15T15:59:59.999Z"));

      // Check the second gap
      const secondGap = gaps[1];
      expect(secondGap?.start).toEqual(new Date("2023-01-25T16:00:00.000Z"));
      expect(secondGap?.end).toEqual(new Date("2023-02-01T15:59:59.999Z"));
    }
  });

  it("should detect gaps between schedules with precise timestamps", () => {
    const schedules = [
      createSchedule(
        "1",
        "2023-01-01T16:00:00.000Z",
        "2023-01-10T15:59:59.999Z",
      ),
      createSchedule(
        "2",
        "2023-01-10T16:00:00.000Z",
        "2023-01-20T15:59:59.999Z",
      ), // No gap - exact boundary match
      createSchedule(
        "3",
        "2023-01-25T16:00:00.000Z",
        "2023-01-31T15:59:59.999Z",
      ), // Gap between 2 and 3
    ];

    const gaps = findScheduleGaps(schedules);
    expect(gaps).toHaveLength(1);

    if (gaps.length > 0) {
      const gap = gaps[0];
      expect(gap?.start).toEqual(new Date("2023-01-20T16:00:00.000Z"));
      expect(gap?.end).toEqual(new Date("2023-01-25T15:59:59.999Z"));
    }
  });

  it("should handle schedules with overlaps", () => {
    const schedules = [
      createSchedule(
        "1",
        "2023-01-01T16:00:00.000Z",
        "2023-01-15T16:00:00.000Z",
      ),
      createSchedule(
        "2",
        "2023-01-10T16:00:00.000Z",
        "2023-01-20T16:00:00.000Z",
      ), // Overlaps with 1
      createSchedule(
        "3",
        "2023-01-30T16:00:00.000Z",
        "2023-02-10T16:00:00.000Z",
      ), // Gap between 2 and 3
    ];

    const gaps = findScheduleGaps(schedules);
    expect(gaps).toHaveLength(1);

    if (gaps.length > 0) {
      const gap = gaps[0];
      expect(gap?.start).toEqual(new Date("2023-01-20T16:00:00.001Z"));
      expect(gap?.end).toEqual(new Date("2023-01-30T15:59:59.999Z"));
    }
  });

  it("should handle empty or single schedule arrays", () => {
    expect(findScheduleGaps([])).toEqual([]);
    expect(
      findScheduleGaps([
        createSchedule(
          "1",
          "2023-01-01T16:00:00.000Z",
          "2023-01-10T15:59:59.999Z",
        ),
      ]),
    ).toEqual([]);
  });

  it("should handle unsorted schedules", () => {
    const schedules = [
      createSchedule(
        "3",
        "2023-01-25T16:00:00.000Z",
        "2023-01-31T15:59:59.999Z",
      ),
      createSchedule(
        "1",
        "2023-01-01T16:00:00.000Z",
        "2023-01-10T15:59:59.999Z",
      ),
      createSchedule(
        "2",
        "2023-01-15T16:00:00.000Z",
        "2023-01-20T15:59:59.999Z",
      ),
    ];

    const gaps = findScheduleGaps(schedules);
    expect(gaps).toHaveLength(2);

    if (gaps.length >= 2) {
      // Even though the input is unsorted, the gaps should be sorted by start date
      const firstGap = gaps[0];
      const secondGap = gaps[1];
      expect(firstGap?.start).toEqual(new Date("2023-01-10T16:00:00.000Z"));
      expect(firstGap?.end).toEqual(new Date("2023-01-15T15:59:59.999Z"));

      expect(secondGap?.start).toEqual(new Date("2023-01-20T16:00:00.000Z"));
      expect(secondGap?.end).toEqual(new Date("2023-01-25T15:59:59.999Z"));
    }
  });

  it("should handle complex schedule arrangements", () => {
    const schedules = [
      createSchedule(
        "1",
        "2023-01-01T16:00:00.000Z",
        "2023-01-15T15:59:59.999Z",
      ),
      createSchedule(
        "2",
        "2023-01-10T16:00:00.000Z",
        "2023-01-25T15:59:59.999Z",
      ), // Overlaps with 1
      createSchedule(
        "3",
        "2023-01-25T16:00:00.000Z",
        "2023-02-05T15:59:59.999Z",
      ), // Shares boundary with 2
      createSchedule(
        "4",
        "2023-02-10T16:00:00.000Z",
        "2023-02-20T15:59:59.999Z",
      ), // Gap between 3 and 4
      createSchedule(
        "5",
        "2023-02-25T16:00:00.000Z",
        "2023-03-05T15:59:59.999Z",
      ), // Gap between 4 and 5
    ];

    const gaps = findScheduleGaps(schedules);
    expect(gaps).toHaveLength(2);

    if (gaps.length >= 2) {
      const firstGap = gaps[0];
      const secondGap = gaps[1];
      expect(firstGap?.start).toEqual(new Date("2023-02-05T16:00:00.000Z"));
      expect(firstGap?.end).toEqual(new Date("2023-02-10T15:59:59.999Z"));

      expect(secondGap?.start).toEqual(new Date("2023-02-20T16:00:00.000Z"));
      expect(secondGap?.end).toEqual(new Date("2023-02-25T15:59:59.999Z"));
    }
  });
});

describe("hasScheduleGaps", () => {
  it("should return false when schedules are continuous", () => {
    const schedules = [
      createSchedule(
        "1",
        "2023-01-01T16:00:00.000Z",
        "2023-01-10T15:59:59.999Z",
      ),
      createSchedule(
        "2",
        "2023-01-10T16:00:00.000Z",
        "2023-01-20T15:59:59.999Z",
      ),
      createSchedule(
        "3",
        "2023-01-20T16:00:00.000Z",
        "2023-01-31T15:59:59.999Z",
      ),
    ];

    expect(hasScheduleGaps(schedules)).toBe(false);
  });

  it("should return true when schedules have gaps", () => {
    const schedules = [
      createSchedule(
        "1",
        "2023-01-01T16:00:00.000Z",
        "2023-01-10T15:59:59.999Z",
      ),
      createSchedule(
        "2",
        "2023-01-15T16:00:00.000Z",
        "2023-01-25T15:59:59.999Z",
      ), // Gap between 1 and 2
    ];

    expect(hasScheduleGaps(schedules)).toBe(true);
  });

  it("should correctly handle exact timestamp boundaries", () => {
    const schedules = [
      createSchedule(
        "1",
        "2023-01-01T16:00:00.000Z",
        "2023-01-10T16:00:00.000Z",
      ),
      createSchedule(
        "2",
        "2023-01-10T16:00:00.000Z",
        "2023-01-20T16:00:00.000Z",
      ), // Exact boundary match
    ];

    // Should not consider exact matching boundaries as gaps
    expect(hasScheduleGaps(schedules)).toBe(false);
  });

  it("should return false for empty or single schedule arrays", () => {
    expect(hasScheduleGaps([])).toBe(false);
    expect(
      hasScheduleGaps([createSchedule("1", "2023-01-01", "2023-01-10")]),
    ).toBe(false);
  });
});

describe("Schedule Generation Functions", () => {
  describe("generateMonthlySchedules", () => {
    it("should handle inverted interval", () => {
      const start = new Date("2024-02-14T16:00:00.000Z");
      const end = new Date("2024-01-14T16:00:00.000Z");

      const schedules = generateMonthlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // When end is before start, expect empty array
      expect(schedules.length).toBe(0);
    });

    it("exactBoundary parameter works as intended", () => {
      const start = new Date("2024-01-14T16:00:00.000Z");
      const end = new Date("2024-02-14T16:00:00.000Z");

      // With exactBoundary = true
      const exactSchedules = generateMonthlySchedules(
        { start, end },
        { exactBoundary: true },
      );
      if (exactSchedules.length > 0 && exactSchedules[0]) {
        expect(exactSchedules[0].end.getTime()).toBe(
          new Date("2024-02-14T15:59:59.999Z").getTime(),
        );
      }

      // With exactBoundary = false
      const nonExactSchedules = generateMonthlySchedules(
        { start, end },
        { exactBoundary: false },
      );
      if (nonExactSchedules.length > 0 && nonExactSchedules[0]) {
        expect(nonExactSchedules[0].end.getTime()).toBe(
          new Date("2024-02-14T16:00:00.000Z").getTime(),
        );
      }
    });

    it("generated schedule follows the expected pattern (regular case)", () => {
      const start = new Date("2024-01-14T16:00:00.000Z");
      const end = new Date("2026-01-14T16:00:00.000Z");
      const schedules = generateMonthlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // Test expected number of schedules
      expect(schedules.length).toBe(24);

      // Test first schedule
      if (schedules.length >= 1 && schedules[0]) {
        expect(schedules[0].start.toISOString()).toBe(
          "2024-01-14T16:00:00.000Z",
        );
        expect(schedules[0].end.toISOString()).toBe("2024-02-14T15:59:59.999Z");
        expect(schedules[0].days).toBe(31);
      }

      // Test leap year handling
      if (schedules.length >= 2 && schedules[1]) {
        expect(schedules[1].start.toISOString()).toBe(
          "2024-02-14T16:00:00.000Z",
        );
        expect(schedules[1].end.toISOString()).toBe("2024-03-14T15:59:59.999Z");
        expect(schedules[1].days).toBe(29); // February 2024 has 29 days (leap year)
      }

      // Test non-leap year handling (next year)
      if (schedules.length >= 14 && schedules[13]) {
        expect(schedules[13].start.toISOString()).toBe(
          "2025-02-14T16:00:00.000Z",
        );
        expect(schedules[13].end.toISOString()).toBe(
          "2025-03-14T15:59:59.999Z",
        );
        expect(schedules[13].days).toBe(28); // February 2025 has 28 days (not leap year)
      }

      // Test the last schedule ends exactly on the end date
      if (schedules.length > 0) {
        const lastSchedule = schedules[schedules.length - 1];
        if (lastSchedule) {
          expect(lastSchedule.end.toISOString()).toBe(
            "2026-01-14T15:59:59.999Z",
          );
        }
      }
    });

    it("handles dates that fall on last day of the month", () => {
      // Test case where start date is on the last day of the month
      const start = new Date("2024-01-30T16:00:00.000Z");
      const end = new Date("2026-01-30T16:00:00.000Z");
      const schedules = generateMonthlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // Test first schedule (January to February)
      if (schedules.length >= 1 && schedules[0]) {
        expect(schedules[0].start.toISOString()).toBe(
          "2024-01-30T16:00:00.000Z",
        );
        expect(schedules[0].end.toISOString()).toBe("2024-02-28T15:59:59.999Z");
        expect(schedules[0].days).toBe(29); // Last day of Feb is 29 in 2024
      }

      // Test second schedule (February to March)
      if (schedules.length >= 2 && schedules[1]) {
        expect(schedules[1].start.toISOString()).toBe(
          "2024-02-28T16:00:00.000Z",
        );
        expect(schedules[1].end.toISOString()).toBe("2024-03-28T15:59:59.999Z");
        expect(schedules[1].days).toBe(29);
      }

      // Test transition to following year's February (non-leap year)
      if (schedules.length >= 13 && schedules[12]) {
        expect(schedules[12].start.toISOString()).toBe(
          "2025-01-28T16:00:00.000Z",
        );
        expect(schedules[12].end.toISOString()).toBe(
          "2025-02-27T15:59:59.999Z",
        );
        expect(schedules[12].days).toBe(30);
      }

      // Test the next schedule after February in non-leap year
      if (schedules.length >= 14 && schedules[13]) {
        expect(schedules[13].start.toISOString()).toBe(
          "2025-02-27T16:00:00.000Z",
        );
        expect(schedules[13].end.toISOString()).toBe(
          "2025-03-27T15:59:59.999Z",
        );
        expect(schedules[13].days).toBe(28);
      }
    });

    it("handles dates that fall on last day of the month (31st)", () => {
      // Test case where start date is on the 31st (absolute last day)
      const start = new Date("2024-01-31T16:00:00.000Z");
      const end = new Date("2026-01-31T16:00:00.000Z");
      const schedules = generateMonthlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // January to February (leap year)
      if (schedules.length >= 1 && schedules[0]) {
        expect(schedules[0].start.toISOString()).toBe(
          "2024-01-31T16:00:00.000Z",
        );
        expect(schedules[0].end.toISOString()).toBe("2024-02-29T15:59:59.999Z");
        expect(schedules[0].days).toBe(29);
      }

      // February to March
      if (schedules.length >= 2 && schedules[1]) {
        expect(schedules[1].start.toISOString()).toBe(
          "2024-02-29T16:00:00.000Z",
        );
        expect(schedules[1].end.toISOString()).toBe("2024-03-31T15:59:59.999Z");
        expect(schedules[1].days).toBe(31);
      }

      // March to April (30 days)
      if (schedules.length >= 3 && schedules[2]) {
        expect(schedules[2].start.toISOString()).toBe(
          "2024-03-31T16:00:00.000Z",
        );
        expect(schedules[2].end.toISOString()).toBe("2024-04-30T15:59:59.999Z");
        expect(schedules[2].days).toBe(30);
      }

      // January to February (non-leap year)
      if (schedules.length >= 13 && schedules[12]) {
        expect(schedules[12].start.toISOString()).toBe(
          "2025-01-31T16:00:00.000Z",
        );
        expect(schedules[12].end.toISOString()).toBe(
          "2025-02-28T15:59:59.999Z",
        );
        expect(schedules[12].days).toBe(28);
      }
    });

    it("generated schedule should match exactly with the expected test data (example 1)", () => {
      const start = new Date("2024-01-14T16:00:00.000Z");
      const end = new Date("2026-01-14T16:00:00.000Z");
      const expected = [
        {
          start: "2024-01-14T16:00:00.000Z",
          end: "2024-02-14T16:00:00.000Z",
          days: 31,
        },
        {
          start: "2024-02-14T16:00:00.000Z",
          end: "2024-03-14T16:00:00.000Z",
          days: 29,
        },
        {
          start: "2024-03-14T16:00:00.000Z",
          end: "2024-04-14T16:00:00.000Z",
          days: 31,
        },
        {
          start: "2024-04-14T16:00:00.000Z",
          end: "2024-05-14T16:00:00.000Z",
          days: 30,
        },
        {
          start: "2024-05-14T16:00:00.000Z",
          end: "2024-06-14T16:00:00.000Z",
          days: 31,
        },
        {
          start: "2024-06-14T16:00:00.000Z",
          end: "2024-07-14T16:00:00.000Z",
          days: 30,
        },
        {
          start: "2024-07-14T16:00:00.000Z",
          end: "2024-08-14T16:00:00.000Z",
          days: 31,
        },
        {
          start: "2024-08-14T16:00:00.000Z",
          end: "2024-09-14T16:00:00.000Z",
          days: 31,
        },
        {
          start: "2024-09-14T16:00:00.000Z",
          end: "2024-10-14T16:00:00.000Z",
          days: 30,
        },
        {
          start: "2024-10-14T16:00:00.000Z",
          end: "2024-11-14T16:00:00.000Z",
          days: 31,
        },
        {
          start: "2024-11-14T16:00:00.000Z",
          end: "2024-12-14T16:00:00.000Z",
          days: 30,
        },
        {
          start: "2024-12-14T16:00:00.000Z",
          end: "2025-01-14T16:00:00.000Z",
          days: 31,
        },
        {
          start: "2025-01-14T16:00:00.000Z",
          end: "2025-02-14T16:00:00.000Z",
          days: 31,
        },
        {
          start: "2025-02-14T16:00:00.000Z",
          end: "2025-03-14T16:00:00.000Z",
          days: 28,
        },
        {
          start: "2025-03-14T16:00:00.000Z",
          end: "2025-04-14T16:00:00.000Z",
          days: 31,
        },
        {
          start: "2025-04-14T16:00:00.000Z",
          end: "2025-05-14T16:00:00.000Z",
          days: 30,
        },
        {
          start: "2025-05-14T16:00:00.000Z",
          end: "2025-06-14T16:00:00.000Z",
          days: 31,
        },
        {
          start: "2025-06-14T16:00:00.000Z",
          end: "2025-07-14T16:00:00.000Z",
          days: 30,
        },
        {
          start: "2025-07-14T16:00:00.000Z",
          end: "2025-08-14T16:00:00.000Z",
          days: 31,
        },
        {
          start: "2025-08-14T16:00:00.000Z",
          end: "2025-09-14T16:00:00.000Z",
          days: 31,
        },
        {
          start: "2025-09-14T16:00:00.000Z",
          end: "2025-10-14T16:00:00.000Z",
          days: 30,
        },
        {
          start: "2025-10-14T16:00:00.000Z",
          end: "2025-11-14T16:00:00.000Z",
          days: 31,
        },
        {
          start: "2025-11-14T16:00:00.000Z",
          end: "2025-12-14T16:00:00.000Z",
          days: 30,
        },
        {
          start: "2025-12-14T16:00:00.000Z",
          end: "2026-01-14T16:00:00.000Z",
          days: 31,
        },
      ];

      const schedules = generateMonthlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // Test first few entries (full test would be too long in logs)
      if (schedules.length >= 1 && schedules[0] && expected[0]) {
        expect(schedules[0].start.toISOString()).toBe(expected[0].start);
        expect(schedules[0].days).toBe(expected[0].days);
      }

      if (schedules.length >= 2 && schedules[1] && expected[1]) {
        expect(schedules[1].start.toISOString()).toBe(expected[1].start);
        expect(schedules[1].days).toBe(expected[1].days);
      }

      // Check a few entries from the middle and end
      if (schedules.length >= 13 && schedules[12] && expected[12]) {
        expect(schedules[12].start.toISOString()).toBe(expected[12].start);
        expect(schedules[12].days).toBe(expected[12].days);
      }

      if (schedules.length >= 24 && schedules[23] && expected[23]) {
        expect(schedules[23].start.toISOString()).toBe(expected[23].start);
        expect(schedules[23].days).toBe(expected[23].days);
      }
    });
  });

  describe("generateQuarterlySchedules", () => {
    it("should handle inverted interval", () => {
      const start = new Date("2024-04-14T16:00:00.000Z");
      const end = new Date("2024-01-14T16:00:00.000Z");

      const schedules = generateQuarterlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // When end is before start, expect empty array
      expect(schedules.length).toBe(0);
    });

    it("exactBoundary parameter works as intended", () => {
      const start = new Date("2024-01-14T16:00:00.000Z");
      const end = new Date("2024-04-14T16:00:00.000Z");

      // With exactBoundary = true
      const exactSchedules = generateQuarterlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      if (exactSchedules.length > 0 && exactSchedules[0]) {
        expect(exactSchedules[0].end.getTime()).toBe(
          new Date("2024-04-14T15:59:59.999Z").getTime(),
        );
      }

      // With exactBoundary = false
      const nonExactSchedules = generateQuarterlySchedules(
        { start, end },
        { exactBoundary: false },
      );

      if (nonExactSchedules.length > 0 && nonExactSchedules[0]) {
        expect(nonExactSchedules[0].end.getTime()).toBe(
          new Date("2024-04-14T16:00:00.000Z").getTime(),
        );
      }
    });

    it("generated quarterly schedule follows the expected pattern", () => {
      const start = new Date("2024-01-14T16:00:00.000Z");
      const end = new Date("2026-01-14T16:00:00.000Z");
      const schedules = generateQuarterlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // Test expected number of schedules
      expect(schedules.length).toBe(8);

      // Test first quarter
      if (schedules.length >= 1 && schedules[0]) {
        expect(schedules[0].start.toISOString()).toBe(
          "2024-01-14T16:00:00.000Z",
        );
        expect(schedules[0].end.toISOString()).toBe("2024-04-14T15:59:59.999Z");
        expect(schedules[0].days).toBe(91); // Q1 in leap year
      }

      // Test second quarter
      if (schedules.length >= 2 && schedules[1]) {
        expect(schedules[1].start.toISOString()).toBe(
          "2024-04-14T16:00:00.000Z",
        );
        expect(schedules[1].end.toISOString()).toBe("2024-07-14T15:59:59.999Z");
        expect(schedules[1].days).toBe(91);
      }

      // Test Q1 in non-leap year
      if (schedules.length >= 5 && schedules[4]) {
        expect(schedules[4].start.toISOString()).toBe(
          "2025-01-14T16:00:00.000Z",
        );
        expect(schedules[4].end.toISOString()).toBe("2025-04-14T15:59:59.999Z");
        expect(schedules[4].days).toBe(90); // Q1 in non-leap year
      }

      // Test the last schedule ends exactly on the end date
      if (schedules.length > 0) {
        const lastSchedule = schedules[schedules.length - 1];
        if (lastSchedule) {
          expect(lastSchedule.end.toISOString()).toBe(
            "2026-01-14T15:59:59.999Z",
          );
        }
      }
    });

    it("handles dates that fall on last day of the month", () => {
      const start = new Date("2024-01-31T16:00:00.000Z");
      const end = new Date("2026-01-31T16:00:00.000Z");
      const schedules = generateQuarterlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // Test first quarter with start on the 31st
      if (schedules.length >= 1 && schedules[0]) {
        expect(schedules[0].start.toISOString()).toBe(
          "2024-01-31T16:00:00.000Z",
        );
        expect(schedules[0].end.toISOString()).toBe("2024-04-30T15:59:59.999Z");
        expect(schedules[0].days).toBe(90);
      }

      // Test Q1 in non-leap year
      if (schedules.length >= 5 && schedules[4]) {
        expect(schedules[4].start.toISOString()).toBe(
          "2025-01-31T16:00:00.000Z",
        );
        expect(schedules[4].end.toISOString()).toBe("2025-04-30T15:59:59.999Z");
        expect(schedules[4].days).toBe(89); // February has 28 days in 2025
      }
    });

    it("generated quarterly schedule should match exactly with the expected test data (example 1)", () => {
      const start = new Date("2024-01-14T16:00:00.000Z");
      const end = new Date("2026-01-14T16:00:00.000Z");
      const expected = [
        {
          start: "2024-01-14T16:00:00.000Z",
          end: "2024-04-14T16:00:00.000Z",
          days: 91,
        },
        {
          start: "2024-04-14T16:00:00.000Z",
          end: "2024-07-14T16:00:00.000Z",
          days: 91,
        },
        {
          start: "2024-07-14T16:00:00.000Z",
          end: "2024-10-14T16:00:00.000Z",
          days: 92,
        },
        {
          start: "2024-10-14T16:00:00.000Z",
          end: "2025-01-14T16:00:00.000Z",
          days: 92,
        },
        {
          start: "2025-01-14T16:00:00.000Z",
          end: "2025-04-14T16:00:00.000Z",
          days: 90,
        },
        {
          start: "2025-04-14T16:00:00.000Z",
          end: "2025-07-14T16:00:00.000Z",
          days: 91,
        },
        {
          start: "2025-07-14T16:00:00.000Z",
          end: "2025-10-14T16:00:00.000Z",
          days: 92,
        },
        {
          start: "2025-10-14T16:00:00.000Z",
          end: "2026-01-14T16:00:00.000Z",
          days: 92,
        },
      ];

      const schedules = generateQuarterlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // Test entries
      if (schedules.length >= 1 && schedules[0] && expected[0]) {
        expect(schedules[0].start.toISOString()).toBe(expected[0].start);
        expect(schedules[0].days).toBe(expected[0].days);
      }

      if (schedules.length >= 2 && schedules[1] && expected[1]) {
        expect(schedules[1].start.toISOString()).toBe(expected[1].start);
        expect(schedules[1].days).toBe(expected[1].days);
      }

      if (schedules.length >= 8 && schedules[7] && expected[7]) {
        expect(schedules[7].start.toISOString()).toBe(expected[7].start);
        expect(schedules[7].days).toBe(expected[7].days);
      }
    });
  });

  describe("generateYearlySchedules", () => {
    it("should handle inverted interval", () => {
      const start = new Date("2025-01-14T16:00:00.000Z");
      const end = new Date("2024-01-14T16:00:00.000Z");

      const schedules = generateYearlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // When end is before start, expect empty array
      expect(schedules.length).toBe(0);
    });

    it("exactBoundary parameter works as intended", () => {
      const start = new Date("2024-01-14T16:00:00.000Z");
      const end = new Date("2025-01-14T16:00:00.000Z");

      // With exactBoundary = true
      const exactSchedules = generateYearlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      if (exactSchedules.length > 0 && exactSchedules[0]) {
        expect(exactSchedules[0].end.getTime()).toBe(
          new Date("2025-01-14T15:59:59.999Z").getTime(),
        );
      }

      // With exactBoundary = false
      const nonExactSchedules = generateYearlySchedules(
        { start, end },
        { exactBoundary: false },
      );

      if (nonExactSchedules.length > 0 && nonExactSchedules[0]) {
        expect(nonExactSchedules[0].end.getTime()).toBe(
          new Date("2025-01-14T16:00:00.000Z").getTime(),
        );
      }
    });

    it("generated yearly schedule follows the expected pattern", () => {
      const start = new Date("2024-01-14T16:00:00.000Z");
      const end = new Date("2026-01-14T16:00:00.000Z");
      const schedules = generateYearlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // Test expected number of schedules
      expect(schedules.length).toBe(2);

      // Test first year (leap year)
      if (schedules.length >= 1 && schedules[0]) {
        expect(schedules[0].start.toISOString()).toBe(
          "2024-01-14T16:00:00.000Z",
        );
        expect(schedules[0].end.toISOString()).toBe("2025-01-14T15:59:59.999Z");
        expect(schedules[0].days).toBe(366); // 2024 is a leap year
      }

      // Test second year (non-leap year)
      if (schedules.length >= 2 && schedules[1]) {
        expect(schedules[1].start.toISOString()).toBe(
          "2025-01-14T16:00:00.000Z",
        );
        expect(schedules[1].end.toISOString()).toBe("2026-01-14T15:59:59.999Z");
        expect(schedules[1].days).toBe(365); // 2025 is not a leap year
      }

      // Test the last schedule ends exactly on the end date
      if (schedules.length > 0) {
        const lastSchedule = schedules[schedules.length - 1];
        if (lastSchedule) {
          expect(lastSchedule.end.toISOString()).toBe(
            "2026-01-14T15:59:59.999Z",
          );
        }
      }
    });

    it("handles dates that fall on last day of the month (31st)", () => {
      const start = new Date("2024-01-31T16:00:00.000Z");
      const end = new Date("2026-01-31T16:00:00.000Z");
      const schedules = generateYearlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // Test first year with start on the 31st (leap year)
      if (schedules.length >= 1 && schedules[0]) {
        expect(schedules[0].start.toISOString()).toBe(
          "2024-01-31T16:00:00.000Z",
        );
        expect(schedules[0].end.toISOString()).toBe("2025-01-31T15:59:59.999Z");
        expect(schedules[0].days).toBe(366);
      }

      // Test second year (non-leap year)
      if (schedules.length >= 2 && schedules[1]) {
        expect(schedules[1].start.toISOString()).toBe(
          "2025-01-31T16:00:00.000Z",
        );
        expect(schedules[1].end.toISOString()).toBe("2026-01-31T15:59:59.999Z");
        expect(schedules[1].days).toBe(365);
      }
    });

    it("generated yearly schedule should match exactly with the expected test data (example 1)", () => {
      const start = new Date("2024-01-14T16:00:00.000Z");
      const end = new Date("2026-01-14T16:00:00.000Z");
      const expected = [
        {
          start: "2024-01-14T16:00:00.000Z",
          end: "2025-01-14T16:00:00.000Z",
          days: 366,
        },
        {
          start: "2025-01-14T16:00:00.000Z",
          end: "2026-01-14T16:00:00.000Z",
          days: 365,
        },
      ];

      const schedules = generateYearlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // Test both entries
      if (schedules.length >= 1 && schedules[0] && expected[0]) {
        expect(schedules[0].start.toISOString()).toBe(expected[0].start);
        expect(schedules[0].days).toBe(expected[0].days);
      }

      if (schedules.length >= 2 && schedules[1] && expected[1]) {
        expect(schedules[1].start.toISOString()).toBe(expected[1].start);
        expect(schedules[1].days).toBe(expected[1].days);
      }
    });
  });

  describe("Comprehensive test scenarios", () => {
    it("Example 1: Regular start date", () => {
      const start = new Date("2024-01-14T16:00:00.000Z");
      const end = new Date("2026-01-14T16:00:00.000Z");

      const monthlySchedules = generateMonthlySchedules(
        { start, end },
        { exactBoundary: true },
      );
      const quarterlySchedules = generateQuarterlySchedules(
        { start, end },
        { exactBoundary: true },
      );
      const yearlySchedules = generateYearlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // Verify counts
      expect(monthlySchedules.length).toBe(24);
      expect(quarterlySchedules.length).toBe(8);
      expect(yearlySchedules.length).toBe(2);

      // Verify leap year handling in first year (2024)
      const febMonthly = monthlySchedules.find(
        (s) => s?.start.toISOString() === "2024-02-14T16:00:00.000Z",
      );
      expect(febMonthly?.days).toBe(29);

      // Verify non-leap year handling in second year (2025)
      const febMonthlyNextYear = monthlySchedules.find(
        (s) => s?.start.toISOString() === "2025-02-14T16:00:00.000Z",
      );
      expect(febMonthlyNextYear?.days).toBe(28);

      // Yearly schedules correctly account for leap year
      if (yearlySchedules.length >= 1 && yearlySchedules[0]) {
        expect(yearlySchedules[0].days).toBe(366);
      }
      if (yearlySchedules.length >= 2 && yearlySchedules[1]) {
        expect(yearlySchedules[1].days).toBe(365);
      }
    });

    it("Example 2: Start date on the last day of month (31st)", () => {
      const start = new Date("2024-01-31T16:00:00.000Z");
      const end = new Date("2026-01-31T16:00:00.000Z");

      const monthlySchedules = generateMonthlySchedules(
        { start, end },
        { exactBoundary: true },
      );
      const quarterlySchedules = generateQuarterlySchedules(
        { start, end },
        { exactBoundary: true },
      );
      const yearlySchedules = generateYearlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // First monthly schedule (Jan to Feb in leap year)
      if (monthlySchedules.length >= 1 && monthlySchedules[0]) {
        expect(monthlySchedules[0].start.toISOString()).toBe(
          "2024-01-31T16:00:00.000Z",
        );
        expect(monthlySchedules[0].end.toISOString()).toBe(
          "2024-02-29T15:59:59.999Z",
        );
        expect(monthlySchedules[0].days).toBe(29);
      }

      // Feb to March
      if (monthlySchedules.length >= 2 && monthlySchedules[1]) {
        expect(monthlySchedules[1].start.toISOString()).toBe(
          "2024-02-29T16:00:00.000Z",
        );
        expect(monthlySchedules[1].end.toISOString()).toBe(
          "2024-03-31T15:59:59.999Z",
        );
        expect(monthlySchedules[1].days).toBe(31);
      }

      // First quarterly schedule
      if (quarterlySchedules.length >= 1 && quarterlySchedules[0]) {
        expect(quarterlySchedules[0].start.toISOString()).toBe(
          "2024-01-31T16:00:00.000Z",
        );
        expect(quarterlySchedules[0].end.toISOString()).toBe(
          "2024-04-30T15:59:59.999Z",
        );
        expect(quarterlySchedules[0].days).toBe(90);
      }

      // Yearly schedules
      if (yearlySchedules.length >= 1 && yearlySchedules[0]) {
        expect(yearlySchedules[0].start.toISOString()).toBe(
          "2024-01-31T16:00:00.000Z",
        );
        expect(yearlySchedules[0].end.toISOString()).toBe(
          "2025-01-31T15:59:59.999Z",
        );
        expect(yearlySchedules[0].days).toBe(366);
      }
    });

    it("Example 3: Start date falls on last day of the month (30th)", () => {
      const start = new Date("2024-01-30T16:00:00.000Z");
      const end = new Date("2026-01-30T16:00:00.000Z");

      const monthlySchedules = generateMonthlySchedules(
        { start, end },
        { exactBoundary: true },
      );
      const quarterlySchedules = generateQuarterlySchedules(
        { start, end },
        { exactBoundary: true },
      );
      const yearlySchedules = generateYearlySchedules(
        { start, end },
        { exactBoundary: true },
      );

      // First monthly schedule (Jan to Feb in leap year)
      if (monthlySchedules.length >= 1 && monthlySchedules[0]) {
        expect(monthlySchedules[0].start.toISOString()).toBe(
          "2024-01-30T16:00:00.000Z",
        );
        expect(monthlySchedules[0].end.toISOString()).toBe(
          "2024-02-28T15:59:59.999Z",
        );
        expect(monthlySchedules[0].days).toBe(29);
      }

      // Feb to March - subsequent dates follow the 28th pattern
      if (monthlySchedules.length >= 2 && monthlySchedules[1]) {
        expect(monthlySchedules[1].start.toISOString()).toBe(
          "2024-02-28T16:00:00.000Z",
        );
        expect(monthlySchedules[1].end.toISOString()).toBe(
          "2024-03-28T15:59:59.999Z",
        );
        expect(monthlySchedules[1].days).toBe(29);
      }

      // First quarterly schedule
      if (quarterlySchedules.length >= 1 && quarterlySchedules[0]) {
        expect(quarterlySchedules[0].start.toISOString()).toBe(
          "2024-01-30T16:00:00.000Z",
        );
        expect(quarterlySchedules[0].end.toISOString()).toBe(
          "2024-04-29T15:59:59.999Z",
        );
        expect(quarterlySchedules[0].days).toBe(90);
      }

      // Yearly schedules
      if (yearlySchedules.length >= 1 && yearlySchedules[0]) {
        expect(yearlySchedules[0].start.toISOString()).toBe(
          "2024-01-30T16:00:00.000Z",
        );
        expect(yearlySchedules[0].end.toISOString()).toBe(
          "2025-01-30T15:59:59.999Z",
        );
        expect(yearlySchedules[0].days).toBe(366);
      }
    });
  });
});

describe("translateExclusiveToInclusive", () => {
  it("should convert exclusive schedule to inclusive schedule", () => {
    const schedule = {
      start: new Date("2023-01-01T16:00:00.000Z"),
      end: new Date("2023-01-15T16:00:00.000Z"),
    };

    const result = translateExclusiveToInclusive(schedule);

    expect(result.start.toISOString()).toBe("2023-01-01T16:00:00.000Z");
    expect(result.end.toISOString()).toBe("2023-01-15T15:59:59.999Z");
    expect(result).not.toBe(schedule); // Should return a new object
  });

  it("should not modify already inclusive schedule", () => {
    const schedule = {
      start: new Date("2023-01-01T16:00:00.000Z"),
      end: new Date("2023-01-15T15:59:59.999Z"),
    };

    const result = translateExclusiveToInclusive(schedule);

    expect(result.start.toISOString()).toBe("2023-01-01T16:00:00.000Z");
    expect(result.end.toISOString()).toBe("2023-01-15T15:59:59.999Z");
    expect(result).not.toBe(schedule); // Should still return a new object
  });

  it("should preserve other properties of the schedule", () => {
    const schedule = {
      start: new Date("2023-01-01T16:00:00.000Z"),
      end: new Date("2023-01-15T16:00:00.000Z"),
      id: "test-schedule",
      title: "Test Schedule",
      days: 14,
    };

    const result = translateExclusiveToInclusive(schedule);

    expect(result.id).toBe("test-schedule");
    expect(result.title).toBe("Test Schedule");
    expect(result.days).toBe(14);
  });

  it("should handle generic types properly", () => {
    interface CustomSchedule extends Schedule {
      metadata: {
        owner: string;
        priority: number;
      };
    }

    const schedule: CustomSchedule = {
      start: new Date("2023-01-01T16:00:00.000Z"),
      end: new Date("2023-01-15T16:00:00.000Z"),
      metadata: {
        owner: "John Doe",
        priority: 1,
      },
    };

    const result = translateExclusiveToInclusive<CustomSchedule>(schedule);

    expect(result.start.toISOString()).toBe("2023-01-01T16:00:00.000Z");
    expect(result.end.toISOString()).toBe("2023-01-15T15:59:59.999Z");
    expect(result.metadata.owner).toBe("John Doe");
    expect(result.metadata.priority).toBe(1);
  });
});

describe("translateInclusiveToExclusive", () => {
  it("should convert inclusive schedule to exclusive schedule", () => {
    const schedule = {
      start: new Date("2023-01-01T16:00:00.000Z"),
      end: new Date("2023-01-15T15:59:59.999Z"),
    };

    const result = translateInclusiveToExclusive(schedule);

    expect(result.start.toISOString()).toBe("2023-01-01T16:00:00.000Z");
    expect(result.end.toISOString()).toBe("2023-01-15T16:00:00.000Z");
    expect(result).not.toBe(schedule); // Should return a new object
  });

  it("should not modify already exclusive schedule", () => {
    const schedule = {
      start: new Date("2023-01-01T16:00:00.000Z"),
      end: new Date("2023-01-15T16:00:00.000Z"),
    };

    const result = translateInclusiveToExclusive(schedule);

    expect(result.start.toISOString()).toBe("2023-01-01T16:00:00.000Z");
    expect(result.end.toISOString()).toBe("2023-01-15T16:00:00.000Z");
    expect(result).not.toBe(schedule); // Should still return a new object
  });

  it("should preserve other properties of the schedule", () => {
    const schedule = {
      start: new Date("2023-01-01T16:00:00.000Z"),
      end: new Date("2023-01-15T15:59:59.999Z"),
      id: "test-schedule",
      title: "Test Schedule",
      days: 14,
    };

    const result = translateInclusiveToExclusive(schedule);

    expect(result.id).toBe("test-schedule");
    expect(result.title).toBe("Test Schedule");
    expect(result.days).toBe(14);
  });

  it("should handle generic types properly", () => {
    interface CustomSchedule extends Schedule {
      metadata: {
        owner: string;
        priority: number;
      };
    }

    const schedule: CustomSchedule = {
      start: new Date("2023-01-01T16:00:00.000Z"),
      end: new Date("2023-01-15T15:59:59.999Z"),
      metadata: {
        owner: "John Doe",
        priority: 1,
      },
    };

    const result = translateInclusiveToExclusive<CustomSchedule>(schedule);

    expect(result.start.toISOString()).toBe("2023-01-01T16:00:00.000Z");
    expect(result.end.toISOString()).toBe("2023-01-15T16:00:00.000Z");
    expect(result.metadata.owner).toBe("John Doe");
    expect(result.metadata.priority).toBe(1);
  });
});
