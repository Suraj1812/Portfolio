import assert from "node:assert/strict";
import test from "node:test";

import {
  formatAsOfMonth,
  formatDuration,
  monthKey,
  monthsBetween,
  totalExperienceMonths,
} from "../src/lib/experience-duration.ts";

const resumeRoles = [
  { start: { year: 2025, month: 12 } },
  { start: { year: 2025, month: 6 }, end: { year: 2026, month: 1 } },
  { start: { year: 2023, month: 8 }, end: { year: 2025, month: 5 } },
  { start: { year: 2023, month: 2 }, end: { year: 2023, month: 7 } },
];

test("current roles count completed calendar months", () => {
  assert.equal(monthsBetween({ year: 2025, month: 12 }, "2026-10"), 10);
  assert.equal(monthsBetween({ year: 2026, month: 10 }, "2026-10"), 0);
  assert.equal(monthsBetween({ year: 2025, month: 12 }, "2026-11"), 11);
});

test("completed roles include their final month", () => {
  assert.equal(monthsBetween({ year: 2025, month: 6 }, "2026-10", { year: 2026, month: 1 }), 8);
  assert.equal(monthsBetween({ year: 2025, month: 6 }, "2026-10", { year: 2025, month: 6 }), 1);
  assert.equal(monthsBetween({ year: 2026, month: 10 }, "2026-10", { year: 2026, month: 10 }), 1);
});

test("December and January boundaries preserve endpoint semantics", () => {
  assert.equal(monthsBetween({ year: 2025, month: 12 }, "2026-01"), 1);
  assert.equal(monthsBetween({ year: 2025, month: 12 }, "2026-02", { year: 2026, month: 1 }), 2);
  assert.equal(monthsBetween({ year: 2026, month: 1 }, "2027-01"), 12);
});

test("NEXUS and Evtaar overlap is counted once", () => {
  const overlapping = resumeRoles.slice(0, 2);
  assert.equal(totalExperienceMonths(overlapping, "2026-10"), 16);
  assert.equal(totalExperienceMonths(overlapping.toReversed(), "2026-10"), 16);
});

test("the four resume roles total 44 months in October 2026", () => {
  assert.deepEqual(resumeRoles.map(({ start, end }) => monthsBetween(start, "2026-10", end)), [10, 8, 22, 6]);
  assert.equal(totalExperienceMonths(resumeRoles, "2026-10"), 44);
  assert.equal(formatDuration(totalExperienceMonths(resumeRoles, "2026-10")), "3 years 8 months");
  assert.equal(totalExperienceMonths(resumeRoles, "2026-11"), 45);
});

test("gaps add no experience and nested or duplicate roles add no extra months", () => {
  const first = { start: { year: 2025, month: 1 }, end: { year: 2025, month: 2 } };
  const second = { start: { year: 2025, month: 4 }, end: { year: 2025, month: 5 } };
  const nested = { start: { year: 2025, month: 1 }, end: { year: 2025, month: 1 } };
  assert.equal(totalExperienceMonths([second, first, nested, first], "2026-10"), 4);
  assert.equal(totalExperienceMonths([], "2026-10"), 0);
});

test("future starts and reversed ranges contribute zero", () => {
  assert.equal(monthsBetween({ year: 2027, month: 1 }, "2026-10"), 0);
  assert.equal(monthsBetween({ year: 2027, month: 1 }, "2026-10", { year: 2027, month: 4 }), 0);
  assert.equal(monthsBetween({ year: 2026, month: 4 }, "2026-10", { year: 2026, month: 3 }), 0);
  assert.equal(totalExperienceMonths([{ start: { year: 2027, month: 1 } }], "2026-10"), 0);
});

test("a future end is treated as ongoing until that month is reached", () => {
  assert.equal(monthsBetween({ year: 2026, month: 9 }, "2026-10", { year: 2026, month: 12 }), 1);
});

test("monthKey follows Kolkata midnight at the December-to-January boundary", () => {
  assert.equal(monthKey(new Date("2025-12-31T18:29:59.999Z")), "2025-12");
  assert.equal(monthKey(new Date("2025-12-31T18:30:00.000Z")), "2026-01");
});

test("leap-day month switching follows Kolkata rather than the host timezone", () => {
  assert.equal(monthKey(new Date("2024-02-29T18:29:59.999Z")), "2024-02");
  assert.equal(monthKey(new Date("2024-02-29T18:30:00.000Z")), "2024-03");
  assert.equal(monthsBetween({ year: 2024, month: 2 }, "2024-03"), 1);
});

test("duration formatting handles zero, singular, plural, and exact years", () => {
  assert.equal(formatDuration(0), "Less than a month");
  assert.equal(formatDuration(1), "1 month");
  assert.equal(formatDuration(10), "10 months");
  assert.equal(formatDuration(12), "1 year");
  assert.equal(formatDuration(13), "1 year 1 month");
  assert.equal(formatDuration(24), "2 years");
  assert.equal(formatDuration(25), "2 years 1 month");
});

test("as-of labels are plain calendar months without timezone conversion", () => {
  assert.equal(formatAsOfMonth("2026-10"), "October 2026");
  assert.equal(formatAsOfMonth("2026-01"), "January 2026");
  assert.equal(formatAsOfMonth("2025-12"), "December 2025");
});

test("malformed dates and fractional or negative durations are rejected", () => {
  assert.throws(() => monthKey(new Date("invalid")), RangeError);
  assert.throws(() => monthsBetween({ year: 2026, month: 13 }, "2026-10"), RangeError);
  assert.throws(() => monthsBetween({ year: 0, month: 1 }, "2026-10"), RangeError);
  assert.throws(() => monthsBetween({ year: 2026, month: 1 }, "2026-1"), RangeError);
  assert.throws(() => formatAsOfMonth("2026-00"), RangeError);
  assert.throws(() => formatDuration(-1), RangeError);
  assert.throws(() => formatDuration(1.5), RangeError);
});
