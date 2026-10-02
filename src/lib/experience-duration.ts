export type ExperienceDate = {
  year: number;
  month: number;
};

type ExperienceRange = {
  start: ExperienceDate;
  end?: ExperienceDate;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function monthIndex(date: ExperienceDate): number {
  if (
    !Number.isInteger(date.year) ||
    date.year < 1 ||
    date.year > 9999 ||
    !Number.isInteger(date.month) ||
    date.month < 1 ||
    date.month > 12
  ) {
    throw new RangeError(
      "Experience dates require a year from 1 to 9999 and a month from 1 to 12.",
    );
  }

  return date.year * 12 + date.month - 1;
}

function parseMonthKey(key: string): ExperienceDate {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(key);
  if (!match) throw new RangeError("Month keys must use YYYY-MM.");

  const date = { year: Number(match[1]), month: Number(match[2]) };
  monthIndex(date);
  return date;
}

/** Use the portfolio owner's timezone, regardless of the server or browser timezone. */
export function monthKey(date: Date): string {
  if (!Number.isFinite(date.getTime()))
    throw new RangeError("A valid date is required.");

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    calendar: "gregory",
    numberingSystem: "latn",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  if (!year || !month)
    throw new RangeError("Could not determine the calendar month.");

  const key = `${year.padStart(4, "0")}-${month}`;
  parseMonthKey(key);
  return key;
}

function interval(range: ExperienceRange, asOf: number): [number, number] {
  const start = monthIndex(range.start);
  const end = range.end ? monthIndex(range.end) : undefined;

  // Completed ranges include their final month. Open or future-ended ranges
  // stop before the unfinished as-of month, without inventing an exact day.
  const endExclusive = end !== undefined && end <= asOf ? end + 1 : asOf;
  return [start, Math.max(start, endExclusive)];
}

export function monthsBetween(
  start: ExperienceDate,
  asOfMonth: string,
  end?: ExperienceDate,
): number {
  const [first, endExclusive] = interval(
    { start, end },
    monthIndex(parseMonthKey(asOfMonth)),
  );
  return endExclusive - first;
}

/** Count the union of all worked months so concurrent roles are counted once. */
export function totalExperienceMonths(
  ranges: ExperienceRange[],
  asOfMonth: string,
): number {
  const asOf = monthIndex(parseMonthKey(asOfMonth));
  const intervals = ranges
    .map((range) => interval(range, asOf))
    .filter(([start, end]) => end > start)
    .sort(([left], [right]) => left - right);

  let total = 0;
  let first: number | undefined;
  let last = 0;

  for (const [start, end] of intervals) {
    if (first === undefined) {
      first = start;
      last = end;
    } else if (start <= last) {
      last = Math.max(last, end);
    } else {
      total += last - first;
      first = start;
      last = end;
    }
  }

  return total + (first === undefined ? 0 : last - first);
}

export function formatDuration(months: number): string {
  if (!Number.isInteger(months) || months < 0) {
    throw new RangeError(
      "Duration must be a non-negative whole number of months.",
    );
  }
  if (months === 0) return "Less than a month";

  const years = Math.floor(months / 12);
  const remainder = months % 12;
  return [
    years ? `${years} ${years === 1 ? "year" : "years"}` : "",
    remainder ? `${remainder} ${remainder === 1 ? "month" : "months"}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function formatAsOfMonth(key: string): string {
  const { year, month } = parseMonthKey(key);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}
